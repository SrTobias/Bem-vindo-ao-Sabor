// Recipe AI edge function - generates recipes via Lovable AI Gateway
import { z } from "npm:zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BodySchema = z.object({
  mode: z.enum(["pantry", "dish", "surprise"]),
  disliked: z.array(z.string()).max(100).default([]),
  pantry: z.array(z.string()).max(100).optional(),
  dish: z.string().max(200).optional(),
  diet: z.enum(["omnivore", "vegetarian", "vegan"]).default("omnivore"),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { mode, disliked, pantry, dish } = parsed.data;

    const dislikedTxt = disliked.length ? `O utilizador NÃO gosta destes ingredientes (evita-os SEMPRE): ${disliked.join(", ")}.` : "";

    let userPrompt = "";
    if (mode === "pantry") {
      userPrompt = `${dislikedTxt}\nIngredientes disponíveis em casa: ${(pantry ?? []).join(", ")}.\nSugere UM prato que se possa cozinhar maioritariamente com estes ingredientes (podes assumir sal, pimenta, azeite, água). Indica claramente se faltam ingredientes essenciais.`;
    } else if (mode === "dish") {
      userPrompt = `${dislikedTxt}\nO utilizador quer fazer: "${dish}".\nDá a receita completa. Lista todos os ingredientes necessários (com quantidades).`;
    } else {
      userPrompt = `${dislikedTxt}\nSugere um prato delicioso e variado à escolha (cozinha portuguesa, mediterrânica ou internacional). Surpreende!`;
    }

    const tool = {
      type: "function",
      function: {
        name: "return_recipe",
        description: "Devolve uma receita estruturada em português.",
        parameters: {
          type: "object",
          properties: {
            title: { type: "string", description: "Nome do prato" },
            description: { type: "string", description: "Descrição curta e apetitosa (1-2 frases)" },
            servings: { type: "string", description: "Doses, ex: '4 pessoas'" },
            time: { type: "string", description: "Tempo total, ex: '45 min'" },
            ingredients: {
              type: "array",
              items: { type: "string" },
              description: "Lista de ingredientes com quantidades",
            },
            instructions: {
              type: "array",
              items: { type: "string" },
              description: "Passos de preparação, claros e ordenados",
            },
            missing_ingredients: {
              type: "array",
              items: { type: "string" },
              description: "Ingredientes essenciais que faltam (vazio se nenhum)",
            },
          },
          required: ["title", "description", "ingredients", "instructions"],
          additionalProperties: false,
        },
      },
    };

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "És um chef experiente que dá receitas práticas em português europeu. Responde SEMPRE através da função return_recipe." },
          { role: "user", content: userPrompt },
        ],
        tools: [tool],
        tool_choice: { type: "function", function: { name: "return_recipe" } },
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      if (res.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de pedidos atingido. Tenta daqui a pouco." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (res.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados. Adiciona créditos nas definições." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw new Error(`AI gateway ${res.status}: ${txt}`);
    }

    const data = await res.json();
    const call = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) throw new Error("Sem resposta estruturada da IA");
    const recipe = JSON.parse(call.function.arguments);

    return new Response(JSON.stringify({ recipe }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("recipe-ai error", e);
    const msg = e instanceof Error ? e.message : "Erro desconhecido";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
