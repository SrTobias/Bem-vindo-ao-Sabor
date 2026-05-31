import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Check } from "lucide-react";
import { THEMES, applyTheme, getStoredTheme, type ThemeId } from "@/lib/themes";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function ThemeSelector() {
  const { t } = useLang();
  const [current, setCurrent] = useState<ThemeId>("warm-sand");

  useEffect(() => {
    setCurrent(getStoredTheme());
  }, []);

  const pick = (id: ThemeId) => {
    setCurrent(id);
    applyTheme(id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Palette className="h-5 w-5 text-primary" />
          {t("themeTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{t("themeDesc")}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {THEMES.map((th) => (
            <button
              key={th.id}
              type="button"
              onClick={() => pick(th.id)}
              className={cn(
                "relative rounded-lg border-2 p-3 text-left transition-all hover:border-primary/50",
                current === th.id ? "border-primary" : "border-border",
              )}
            >
              <div className="flex gap-1 mb-2">
                {th.swatch.map((c, i) => (
                  <span
                    key={i}
                    className="h-6 w-6 rounded-full border border-black/10"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{th.name}</span>
                {current === th.id && <Check className="h-4 w-4 text-primary" />}
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
