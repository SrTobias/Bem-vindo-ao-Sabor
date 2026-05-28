import { useSyncExternalStore } from "react";

export type Lang = "pt" | "en";

const KEY = "app.lang";

const translations = {
  pt: {
    welcome: "Bem-vindo ao Sabor",
    welcomeSub: "Inicia sessão para guardar as tuas receitas favoritas.",
    continueGoogle: "Continuar com Google",
    orEmail: "ou com email",
    signIn: "Entrar",
    signUp: "Criar conta",
    email: "Email",
    password: "Palavra-passe",
    forgot: "Esqueci-me da palavra-passe",
    enterEmailFirst: "Introduz o teu email primeiro",
    resetSent: "Email de recuperação enviado!",
    accountCreated: "Conta criada! Verifica o teu email.",
    googleError: "Erro no Google sign-in",
    language: "Idioma",
  },
  en: {
    welcome: "Welcome to Sabor",
    welcomeSub: "Sign in to save your favorite recipes.",
    continueGoogle: "Continue with Google",
    orEmail: "or with email",
    signIn: "Sign in",
    signUp: "Create account",
    email: "Email",
    password: "Password",
    forgot: "Forgot password",
    enterEmailFirst: "Enter your email first",
    resetSent: "Recovery email sent!",
    accountCreated: "Account created! Check your email.",
    googleError: "Google sign-in failed",
    language: "Language",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["pt"];

const listeners = new Set<() => void>();

function getLang(): Lang {
  if (typeof window === "undefined") return "pt";
  const v = window.localStorage.getItem(KEY);
  return v === "en" ? "en" : "pt";
}

export function setLang(lang: Lang) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, lang);
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useLang() {
  const lang = useSyncExternalStore(subscribe, getLang, () => "pt" as Lang);
  const t = (key: TranslationKey) => translations[lang][key];
  return { lang, setLang, t };
}
