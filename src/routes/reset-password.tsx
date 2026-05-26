import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ChefHat } from "lucide-react";

export const Route = createFileRoute("/reset-password")({ component: ResetPasswordPage, ssr: false });

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery") || hash.includes("access_token")) {
      setReady(true);
    } else {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) setReady(true);
        else {
          toast.error("Link inválido ou expirado");
          navigate({ to: "/auth" });
        }
      });
    }
  }, [navigate]);

  const update = async () => {
    if (password.length < 6) {
      toast.error("Mínimo 6 caracteres");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Palavra-passe atualizada!");
      navigate({ to: "/" });
    }
  };

  if (!ready) return null;

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2"><ChefHat className="h-10 w-10 text-primary" /></div>
          <CardTitle className="font-display text-3xl">Nova palavra-passe</CardTitle>
          <CardDescription>Define a tua nova palavra-passe.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Nova palavra-passe</Label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} minLength={6} />
          </div>
          <Button className="w-full" onClick={update} disabled={busy}>
            {busy ? "..." : "Atualizar palavra-passe"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
