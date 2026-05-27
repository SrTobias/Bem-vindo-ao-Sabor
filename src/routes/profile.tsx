import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { DislikedIngredients } from "@/components/DislikedIngredients";
import { DietSelector } from "@/components/DietSelector";
import { ThemeSelector } from "@/components/ThemeSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User } from "lucide-react";

export const Route = createFileRoute("/profile")({ component: ProfilePage, ssr: false });

function ProfilePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (loading || !user) {
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
        <section className="space-y-2">
          <h1 className="font-display text-4xl">O teu perfil</h1>
          <p className="text-muted-foreground">Gere as tuas preferências alimentares.</p>
        </section>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="h-5 w-5 text-primary" />
              Conta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Email: {user.email}</p>
          </CardContent>
        </Card>

        <DietSelector />

        <ThemeSelector />

        <DislikedIngredients />
      </main>
    </div>
  );
}
