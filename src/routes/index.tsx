import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { useLang } from "@/lib/i18n";

import { ModeForm } from "@/components/ModeForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/")({ component: Index, ssr: false });

function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useLang();

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
      <main className="container mx-auto px-4 py-10 max-w-3xl space-y-8">
        <section className="text-center space-y-2">
          <h1 className="font-display text-5xl md:text-6xl">{t("homeTitle")}</h1>
          <p className="text-muted-foreground text-lg">{t("homeSub")}</p>
        </section>

        <Tabs defaultValue="pantry" className="w-full">
          <TabsList className="grid grid-cols-3 w-full h-auto">
            <TabsTrigger value="pantry" className="py-2">{t("tabPantry")}</TabsTrigger>
            <TabsTrigger value="dish" className="py-2">{t("tabDish")}</TabsTrigger>
            <TabsTrigger value="surprise" className="py-2">{t("tabSurprise")}</TabsTrigger>
          </TabsList>
          <TabsContent value="pantry" className="mt-6"><ModeForm mode="pantry" /></TabsContent>
          <TabsContent value="dish" className="mt-6"><ModeForm mode="dish" /></TabsContent>
          <TabsContent value="surprise" className="mt-6"><ModeForm mode="surprise" /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
