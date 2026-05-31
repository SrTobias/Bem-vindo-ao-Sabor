import { useState, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLang } from "@/lib/i18n";
import { X } from "lucide-react";

interface Props {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}

export function ChipInput({ value, onChange, placeholder, suggestions }: Props) {
  const { t } = useLang();
  const [draft, setDraft] = useState("");

  const add = (raw: string) => {
    const v = raw.trim().toLowerCase();
    if (!v) return;
    if (value.includes(v)) return;
    onChange([...value, v]);
    setDraft("");
  };

  const remove = (v: string) => onChange(value.filter((x) => x !== v));

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(draft);
    } else if (e.key === "Backspace" && !draft && value.length) {
      remove(value[value.length - 1]);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2 min-h-[2rem]">
        {value.map((v) => (
          <Badge key={v} variant="secondary" className="text-sm py-1 pr-1">
            {v}
            <button onClick={() => remove(v)} className="ml-1 hover:text-destructive" aria-label={`Remover ${v}`}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKey}
        onBlur={() => draft && add(draft)}
        placeholder={placeholder ?? "Escreve e pressiona Enter"}
        maxLength={60}
      />
      {suggestions && suggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {suggestions.filter(s => !value.includes(s)).slice(0, 8).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="text-xs px-2 py-1 rounded-full border border-border bg-background hover:bg-secondary transition"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
