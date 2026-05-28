import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ChefHat, Loader2, Languages } from "lucide-react";
import { useLang, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({ component: AuthPage, ssr: false });

function AuthPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { lang, setLang, t } = useLang();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (user) navigate({ to: "/" }); }, [user, navigate]);

  const signIn = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message); else navigate({ to: "/" });
  };

  const signUp = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: window.location.origin },
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success(t("accountCreated"));
  };

  const forgotPassword = async () => {
    if (!email) {
      toast.error(t("enterEmailFirst"));
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success(t("resetSent"));
  };

  const google = async () => {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) toast.error(t("googleError"));
  };

  if (loading) return <div className="min-h-screen grid place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center relative">
          <div className="absolute right-4 top-4 flex items-center gap-1.5">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <Select value={lang} onValueChange={(v) => setLang(v as Lang)}>
              <SelectTrigger className="h-8 w-[90px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt">PT-PT</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-center mb-2"><ChefHat className="h-10 w-10 text-primary" /></div>
          <CardTitle className="font-display text-3xl">{t("welcome")}</CardTitle>
          <CardDescription>{t("welcomeSub")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full mb-4" onClick={google}>{t("continueGoogle")}</Button>
          <div className="text-center text-xs text-muted-foreground mb-4">{t("orEmail")}</div>
          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">{t("signIn")}</TabsTrigger>
              <TabsTrigger value="signup">{t("signUp")}</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="space-y-3 mt-4">
              <div><Label>{t("email")}</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
              <div><Label>{t("password")}</Label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>
              <Button className="w-full" onClick={signIn} disabled={busy}>{busy ? "..." : t("signIn")}</Button>
              <button
                type="button"
                onClick={forgotPassword}
                disabled={busy}
                className="w-full text-xs text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
              >
                {t("forgot")}
              </button>
            </TabsContent>
            <TabsContent value="signup" className="space-y-3 mt-4">
              <div><Label>{t("email")}</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
              <div><Label>{t("password")}</Label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} minLength={6} /></div>
              <Button className="w-full" onClick={signUp} disabled={busy}>{busy ? "..." : t("signUp")}</Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
