import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Salad } from "lucide-react";

const DIET_OPTIONS = [
  { value: "omnivore", label: "Omnívoro (como de tudo)", description: "Carne, peixe, laticínios e vegetais" },
  { value: "vegetarian", label: "Vegetariano", description: "Sem carne nem peixe, mas pode incluir ovos e laticínios" },
  { value: "vegan", label: "Vegano", description: "Apenas ingredientes de origem vegetal" },
] as const;

export type Diet = "omnivore" | "vegetarian" | "vegan";

export function DietSelector() {
  const { user } = useAuth();
  const [diet, setDiet] = useState<Diet>("omnivore");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("diet")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.diet) setDiet(data.diet as Diet);
      });
  }, [user]);

  const save = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ diet })
      .eq("user_id", user.id);
    setLoading(false);
    if (error) toast.error("Erro a guardar dieta");
    else toast.success("Dieta guardada");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Salad className="h-5 w-5 text-primary" />
          Tipo de dieta
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Escolhe o teu regime alimentar para que as receitas sugeridas respeitem as tuas preferências.
        </p>
        <div className="space-y-2">
          {DIET_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                diet === option.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-secondary/50"
              }`}
            >
              <input
                type="radio"
                name="diet"
                value={option.value}
                checked={diet === option.value}
                onChange={() => setDiet(option.value)}
                className="mt-1 h-4 w-4 accent-primary"
              />
              <div>
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-muted-foreground">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
        <Button onClick={save} disabled={loading} size="sm">
          {loading ? "A guardar..." : "Guardar dieta"}
        </Button>
      </CardContent>
    </Card>
  );
}
