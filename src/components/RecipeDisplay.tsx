import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Heart, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface Recipe {
  title: string;
  description: string;
  servings?: string;
  time?: string;
  ingredients: string[];
  instructions: string[];
  missing_ingredients?: string[];
}

export function RecipeDisplay({ recipe, extra }: { recipe: Recipe; extra?: React.ReactNode }) {
  const { user } = useAuth();

  const save = async () => {
    if (!user) return toast.error("Precisas de iniciar sessão");
    const { error } = await supabase.from("favorites").insert({
      user_id: user.id,
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
    });
    if (error) toast.error("Erro a guardar");
    else toast.success("Adicionado aos favoritos");
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className="font-display text-3xl">{recipe.title}</CardTitle>
            <p className="text-muted-foreground mt-2">{recipe.description}</p>
            <div className="flex gap-3 mt-3 text-sm text-muted-foreground">
              {recipe.servings && <span className="flex items-center gap-1"><Users className="h-4 w-4" />{recipe.servings}</span>}
              {recipe.time && <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{recipe.time}</span>}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={save}>
            <Heart className="h-4 w-4" /> Guardar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {recipe.missing_ingredients && recipe.missing_ingredients.length > 0 && (
          <div className="flex gap-2 items-start p-3 rounded-md bg-accent/30 border border-accent">
            <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Faltam estes ingredientes:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {recipe.missing_ingredients.map((i) => <Badge key={i} variant="outline">{i}</Badge>)}
              </div>
            </div>
          </div>
        )}

        <div>
          <h3 className="font-display text-xl mb-2">Ingredientes</h3>
          <ul className="space-y-1">
            {recipe.ingredients.map((i, idx) => (
              <li key={idx} className="flex gap-2"><span className="text-accent-foreground">·</span>{i}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-xl mb-2">Preparação</h3>
          <ol className="space-y-3">
            {recipe.instructions.map((step, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  {idx + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {extra}
      </CardContent>
    </Card>
  );
}
