import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { useLang } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Heart } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/favorites")({ component: FavoritesPage, ssr: false });

type Favorite = {
  id: string;
  title: string;
  description: string | null;
  ingredients: string[];
  instructions: string[];
  created_at: string;
};

function FavoritesPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useLang();
  const [favs, setFavs] = useState<Favorite[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("favorites")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error(error.message);
        else setFavs((data ?? []) as Favorite[]);
        setFetching(false);
      });
  }, [user]);

  const remove = async (id: string) => {
    const { error } = await supabase.from("favorites").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      setFavs((f) => f.filter((x) => x.id !== id));
      toast.success(t("favRemoved"));
    }
  };

  if (loading || !user || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-3xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-4xl md:text-5xl">{t("favTitle")}</h1>
          <p className="text-muted-foreground">{t("favSub")}</p>
        </div>

        {favs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Heart className="h-10 w-10 mx-auto mb-3 opacity-40" />
              {t("favEmpty")}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {favs.map((f) => (
              <Card key={f.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div>
                    <CardTitle className="font-display text-2xl">{f.title}</CardTitle>
                    {f.description && <CardDescription className="mt-1">{f.description}</CardDescription>}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => remove(f.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">{t("ingredients")}</h3>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {f.ingredients.map((i, idx) => <li key={idx}>{i}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{t("preparation")}</h3>
                    <ol className="list-decimal pl-5 text-sm space-y-1">
                      {f.instructions.map((s, idx) => <li key={idx}>{s}</li>)}
                    </ol>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
