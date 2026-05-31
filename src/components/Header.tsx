import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLang, saveUserLanguage, type Lang } from "@/lib/i18n";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChefHat, Heart, LogOut, User, Languages } from "lucide-react";

export function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { lang, setLang, t } = useLang();

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  const handleLanguageChange = async (newLang: Lang) => {
    setLang(newLang);
    // Save to database for logged-in users
    if (user) {
      await saveUserLanguage(user, newLang);
    }
  };

  return (
    <header className="border-b bg-card/60 backdrop-blur sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <ChefHat className="h-6 w-6 text-primary" />
          <span className="font-display text-2xl">Sabor</span>
        </Link>
        <nav className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="flex items-center gap-1.5">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <Select value={lang} onValueChange={(v) => handleLanguageChange(v as Lang)}>
              <SelectTrigger className="h-8 w-[90px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt">{t("langPt")}</SelectItem>
                <SelectItem value="en">{t("langEn")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/favorites"><Heart className="h-4 w-4" /> {t("favorites")}</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/profile"><User className="h-4 w-4" /> {t("profile")}</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button size="sm" asChild>
              <Link to="/auth">{t("signIn")}</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
