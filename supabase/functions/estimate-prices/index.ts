// Estimate shopping list price via Lovable AI (Portugal market averages)
import { z } from "npm:zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BodySchema = z.object({
  ingredients: z.array(z.string().min(1).max(200)).min(1).max(60),
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
    const { ingredients } = parsed.data;

    const tool = {
      type: "function",
      function: {
        name: "return_estimate",
        description: "Estimativa de preços em EUR para lista de compras (Portugal).",
        parameters: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  estimated_eur: { type: "number", description: "Preço médio estimado em EUR" },
                  note: { type: "string", description: "Quantidade assumida ou observação" },
                },
                required: ["name", "estimated_eur"],
                additionalProperties: false,
              },
            },
            total_eur: { type: "number", description: "Soma estimada do total" },
            disclaimer: { type: "string" },
          },
          required: ["items", "total_eur"],
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
          {
            role: "system",
            content:
              "És um assistente que estima preços médios de mercearia em Portugal (EUR), com base nos preços típicos de supermercados como Continente, Pingo Doce, Lidl, Auchan. Devolve uma estimativa razoável por item considerando a quantidade indicada na receita. Inclui um 'disclaimer' a dizer que são estimativas aproximadas e podem variar.",
          },
          {
            role: "user",
            content: `Estima o custo desta lista de compras em Portugal:\n${ingredients.map((i) => `- ${i}`).join("\n")}`,
          },
        ],
        tools: [tool],
        tool_choice: { type: "function", function: { name: "return_estimate" } },
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      if (res.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de pedidos atingido. Tenta daqui a pouco." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (res.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway ${res.status}: ${txt}`);
    }

    const data = await res.json();
    const call = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) throw new Error("Sem resposta estruturada da IA");
    const estimate = JSON.parse(call.function.arguments);

    return new Response(JSON.stringify({ estimate }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("estimate-prices error", e);
    const msg = e instanceof Error ? e.message : "Erro desconhecido";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
