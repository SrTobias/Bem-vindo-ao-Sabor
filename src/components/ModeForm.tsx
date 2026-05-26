import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChipInput } from "@/components/ChipInput";
import { RecipeDisplay, type Recipe } from "@/components/RecipeDisplay";
import { supabase } from "@/integrations/supabase/client";
import { useProfilePrefs } from "@/components/DislikedIngredients";
import { toast } from "sonner";
import { Sparkles, Loader2, MapPin, ExternalLink, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Mode = "pantry" | "dish" | "surprise";

const PANTRY_SUGGESTIONS = ["ovos", "arroz", "massa", "tomate", "cebola", "alho", "frango", "batata", "atum", "feijão"];

interface Place {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  googleMapsUri?: string;
  rating?: number;
  location?: { latitude: number; longitude: number };
}

export function ModeForm({ mode }: { mode: Mode }) {
  const { disliked, diet } = useProfilePrefs();
  const [pantry, setPantry] = useState<string[]>([]);
  const [dish, setDish] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [findingPlaces, setFindingPlaces] = useState(false);

  const generate = async () => {
    if (mode === "pantry" && pantry.length === 0) return toast.error("Adiciona alguns ingredientes");
    if (mode === "dish" && !dish.trim()) return toast.error("Diz que prato queres");
    setLoading(true);
    setRecipe(null);
    setPlaces([]);
    const { data, error } = await supabase.functions.invoke("recipe-ai", {
      body: { mode, disliked, pantry, dish: dish.trim(), diet },
    });
    setLoading(false);
    if (error || data?.error) {
      toast.error(data?.error ?? "Erro ao gerar receita");
      return;
    }
    setRecipe(data.recipe);
  };

  const findSupermarkets = () => {
    if (!navigator.geolocation) return toast.error("Geolocalização indisponível");
    setFindingPlaces(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { data, error } = await supabase.functions.invoke("find-supermarkets", {
          body: { latitude: pos.coords.latitude, longitude: pos.coords.longitude, radius: 5000 },
        });
        setFindingPlaces(false);
        if (error || data?.error) return toast.error(data?.error ?? "Erro a procurar supermercados");
        setPlaces(data.places ?? []);
        if ((data.places ?? []).length === 0) toast.info("Sem supermercados perto.");
      },
      () => {
        setFindingPlaces(false);
        toast.error("Não foi possível obter localização");
      },
    );
  };

  return (
    <div>
      <Card>
        <CardHeader>
          {mode === "pantry" && (
            <>
              <CardTitle className="font-display text-2xl">O que tens em casa?</CardTitle>
              <CardDescription>Adiciona os ingredientes disponíveis e a IA sugere um prato.</CardDescription>
            </>
          )}
          {mode === "dish" && (
            <>
              <CardTitle className="font-display text-2xl">Que prato queres comer?</CardTitle>
              <CardDescription>Damos a receita e mostramos onde comprar os ingredientes perto de ti.</CardDescription>
            </>
          )}
          {mode === "surprise" && (
            <>
              <CardTitle className="font-display text-2xl">Surpreende-me!</CardTitle>
              <CardDescription>A IA vai escolher um prato delicioso para ti.</CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {mode === "pantry" && (
            <div>
              <Label className="mb-2 block">Ingredientes em casa</Label>
              <ChipInput value={pantry} onChange={setPantry} placeholder="ex: ovos, arroz, tomate" suggestions={PANTRY_SUGGESTIONS} />
            </div>
          )}
          {mode === "dish" && (
            <div>
              <Label className="mb-2 block" htmlFor="dish">Nome do prato</Label>
              <Input id="dish" value={dish} onChange={(e) => setDish(e.target.value)} placeholder="ex: bacalhau à brás" maxLength={200} />
            </div>
          )}
          {disliked.length > 0 && (
            <p className="text-xs text-muted-foreground">
              A evitar: {disliked.join(", ")}
            </p>
          )}
          <Button onClick={generate} disabled={loading} size="lg" className="w-full sm:w-auto">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "A cozinhar ideias..." : "Gerar receita"}
          </Button>
        </CardContent>
      </Card>

      {recipe && (
        <RecipeDisplay
          recipe={recipe}
          extra={
            mode === "dish" ? (
              <div>
                <h3 className="font-display text-xl mb-2">Onde comprar perto de ti</h3>
                {places.length === 0 ? (
                  <Button onClick={findSupermarkets} disabled={findingPlaces} variant="outline">
                    {findingPlaces ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                    {findingPlaces ? "A procurar..." : "Encontrar supermercados perto"}
                  </Button>
                ) : (
                  <ul className="space-y-2">
                    {places.map((p) => (
                      <li key={p.id} className="flex justify-between items-start gap-3 p-3 rounded-md border bg-card">
                        <div>
                          <div className="font-medium">{p.displayName?.text}</div>
                          <div className="text-sm text-muted-foreground">{p.formattedAddress}</div>
                          {p.rating && (
                            <div className="text-xs flex items-center gap-1 mt-1">
                              <Star className="h-3 w-3 fill-accent text-accent" /> {p.rating.toFixed(1)}
                            </div>
                          )}
                        </div>
                        {p.googleMapsUri && (
                          <a href={p.googleMapsUri} target="_blank" rel="noreferrer" className="text-sm text-primary inline-flex items-center gap-1 shrink-0">
                            Ver <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null
          }
        />
      )}
    </div>
  );
}
