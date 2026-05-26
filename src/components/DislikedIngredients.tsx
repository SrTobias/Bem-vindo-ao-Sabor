import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ChipInput } from "@/components/ChipInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Ban } from "lucide-react";

const COMMON = ["cogumelos", "coentros", "azeitonas", "anchovas", "queijo azul", "alho", "cebola", "pimento", "marisco", "fígado"];

export function DislikedIngredients() {
  const { user } = useAuth();
  const [list, setList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("disliked_ingredients")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.disliked_ingredients) setList(data.disliked_ingredients);
      });
  }, [user]);

  const save = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ disliked_ingredients: list })
      .eq("user_id", user.id);
    setLoading(false);
    if (error) toast.error("Erro a guardar");
    else toast.success("Preferências guardadas");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Ban className="h-5 w-5 text-primary" />
          Ingredientes que não gostas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Estes ingredientes serão sempre evitados nas sugestões.
        </p>
        <ChipInput value={list} onChange={setList} placeholder="ex: coentros" suggestions={COMMON} />
        <Button onClick={save} disabled={loading} size="sm">
          {loading ? "A guardar..." : "Guardar preferências"}
        </Button>
      </CardContent>
    </Card>
  );
}

export function useDisliked() {
  const { user } = useAuth();
  const [disliked, setDisliked] = useState<string[]>([]);
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("disliked_ingredients")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => setDisliked(data?.disliked_ingredients ?? []));
  }, [user]);
  return disliked;
}

export function useProfilePrefs() {
  const { user } = useAuth();
  const [disliked, setDisliked] = useState<string[]>([]);
  const [diet, setDiet] = useState<"omnivore" | "vegetarian" | "vegan">("omnivore");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("disliked_ingredients, diet")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.disliked_ingredients) setDisliked(data.disliked_ingredients);
        if (data?.diet) setDiet(data.diet as "omnivore" | "vegetarian" | "vegan");
      });
  }, [user]);

  return { disliked, diet };
}
