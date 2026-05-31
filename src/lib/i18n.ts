import { useSyncExternalStore } from "react";

export type Lang = "pt" | "en";

const KEY = "app.lang";

const translations = {
  pt: {
    // Auth
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
    langPt: "Português",
    langEn: "English",
    newPassword: "Nova palavra-passe",
    newPasswordSub: "Define a tua nova palavra-passe.",
    updatePassword: "Atualizar palavra-passe",
    minChars: "Mínimo 6 caracteres",
    invalidLink: "Link inválido ou expirado",
    passwordUpdated: "Palavra-passe atualizada!",

    // Header
    favorites: "Favoritos",
    profile: "Perfil",

    // Home
    homeTitle: "O que vais cozinhar hoje?",
    homeSub: "Diz-nos o que tens, o que apetece, ou deixa-nos surpreender-te.",
    tabPantry: "Tenho em casa",
    tabDish: "Quero um prato",
    tabSurprise: "Surpreende-me",

    // ModeForm
    pantryTitle: "O que tens em casa?",
    pantryDesc: "Adiciona os ingredientes disponíveis e a IA sugere um prato.",
    dishTitle: "Que prato queres comer?",
    dishDesc: "Damos a receita e mostramos onde comprar os ingredientes perto de ti.",
    surpriseTitle: "Surpreende-me!",
    surpriseDesc: "A IA vai escolher um prato delicioso para ti.",
    ingredientsHome: "Ingredientes em casa",
    pantryPlaceholder: "ex: ovos, arroz, tomate",
    dishName: "Nome do prato",
    dishPlaceholder: "ex: bacalhau à brás",
    avoiding: "A evitar",
    cooking: "A cozinhar ideias...",
    generateRecipe: "Gerar receita",
    addSomeIngredients: "Adiciona alguns ingredientes",
    sayWhichDish: "Diz que prato queres",
    recipeError: "Erro ao gerar receita",
    estimatedCost: "Custo estimado da lista",
    calculating: "A calcular...",
    estimatePrices: "Estimar preços",
    totalEstimated: "Total estimado",
    priceError: "Erro a estimar preços",
    whereToBuy: "Onde comprar perto de ti",
    closest: "Mais perto",
    bestRated: "Melhor avaliados",
    searching: "A procurar...",
    findSupermarkets: "Encontrar supermercados perto",
    view: "Ver",
    searchList: "Procurar lista",
    geoUnavailable: "Geolocalização indisponível",
    noLocation: "Não foi possível obter localização",
    supermarketError: "Erro a procurar supermercados",
    noSupermarkets: "Sem supermercados perto.",

    // Recipe display
    save: "Guardar",
    needLogin: "Precisas de iniciar sessão",
    saveError: "Erro a guardar",
    savedToFavorites: "Adicionado aos favoritos",
    missingIngredients: "Faltam estes ingredientes:",
    ingredients: "Ingredientes",
    preparation: "Preparação",

    // Profile
    profileTitle: "O teu perfil",
    profileSub: "Gere as tuas preferências alimentares.",
    account: "Conta",
    dietType: "Tipo de dieta",
    dietDesc: "Escolhe o teu regime alimentar para que as receitas sugeridas respeitem as tuas preferências.",
    saveDiet: "Guardar dieta",
    savingDiet: "A guardar...",
    dietSaved: "Dieta guardada",
    dietError: "Erro a guardar dieta",
    dietOmnivore: "Omnívoro (como de tudo)",
    dietOmnivoreDesc: "Carne, peixe, laticínios e vegetais",
    dietVegetarian: "Vegetariano",
    dietVegetarianDesc: "Sem carne nem peixe, mas pode incluir ovos e laticínios",
    dietVegan: "Vegano",
    dietVeganDesc: "Apenas ingredientes de origem vegetal",
    dislikedTitle: "Ingredientes que não gostas",
    dislikedDesc: "Estes ingredientes serão sempre evitados nas sugestões.",
    dislikedPlaceholder: "ex: coentros",
    savePrefs: "Guardar preferências",
    saving: "A guardar...",
    prefsSaved: "Preferências guardadas",
    themeTitle: "Cores do site",
    themeDesc: "Escolhe a paleta de cores que preferes.",

    // Favorites
    favTitle: "As tuas receitas favoritas",
    favSub: "Tudo o que guardaste, num só sítio.",
    favEmpty: "Ainda não tens favoritos. Gera uma receita e guarda-a!",
    favRemoved: "Receita removida",

    // Misc
    notFound: "Página não encontrada.",
    back: "Voltar",
    somethingWrong: "Algo correu mal",
    tryAgain: "Tentar de novo",
    typeAndEnter: "Escreve e pressiona Enter",
  },
  en: {
    // Auth
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
    langPt: "Português",
    langEn: "English",
    newPassword: "New password",
    newPasswordSub: "Set your new password.",
    updatePassword: "Update password",
    minChars: "Minimum 6 characters",
    invalidLink: "Invalid or expired link",
    passwordUpdated: "Password updated!",

    // Header
    favorites: "Favorites",
    profile: "Profile",

    // Home
    homeTitle: "What are you cooking today?",
    homeSub: "Tell us what you have, what you fancy, or let us surprise you.",
    tabPantry: "I have at home",
    tabDish: "I want a dish",
    tabSurprise: "Surprise me",

    // ModeForm
    pantryTitle: "What do you have at home?",
    pantryDesc: "Add the ingredients you have and AI will suggest a dish.",
    dishTitle: "What dish do you want?",
    dishDesc: "We give you the recipe and show where to buy ingredients near you.",
    surpriseTitle: "Surprise me!",
    surpriseDesc: "AI will pick a delicious dish for you.",
    ingredientsHome: "Ingredients at home",
    pantryPlaceholder: "e.g. eggs, rice, tomato",
    dishName: "Dish name",
    dishPlaceholder: "e.g. bacalhau à brás",
    avoiding: "Avoiding",
    cooking: "Cooking up ideas...",
    generateRecipe: "Generate recipe",
    addSomeIngredients: "Add some ingredients",
    sayWhichDish: "Tell us which dish",
    recipeError: "Failed to generate recipe",
    estimatedCost: "Estimated shopping cost",
    calculating: "Calculating...",
    estimatePrices: "Estimate prices",
    totalEstimated: "Estimated total",
    priceError: "Failed to estimate prices",
    whereToBuy: "Where to buy near you",
    closest: "Closest",
    bestRated: "Best rated",
    searching: "Searching...",
    findSupermarkets: "Find nearby supermarkets",
    view: "View",
    searchList: "Search list",
    geoUnavailable: "Geolocation unavailable",
    noLocation: "Couldn't get your location",
    supermarketError: "Failed to find supermarkets",
    noSupermarkets: "No supermarkets nearby.",

    // Recipe display
    save: "Save",
    needLogin: "You need to sign in",
    saveError: "Failed to save",
    savedToFavorites: "Added to favorites",
    missingIngredients: "Missing these ingredients:",
    ingredients: "Ingredients",
    preparation: "Preparation",

    // Profile
    profileTitle: "Your profile",
    profileSub: "Manage your food preferences.",
    account: "Account",
    dietType: "Diet type",
    dietDesc: "Choose your diet so the suggested recipes respect your preferences.",
    saveDiet: "Save diet",
    savingDiet: "Saving...",
    dietSaved: "Diet saved",
    dietError: "Failed to save diet",
    dietOmnivore: "Omnivore (I eat everything)",
    dietOmnivoreDesc: "Meat, fish, dairy and vegetables",
    dietVegetarian: "Vegetarian",
    dietVegetarianDesc: "No meat or fish, may include eggs and dairy",
    dietVegan: "Vegan",
    dietVeganDesc: "Plant-based ingredients only",
    dislikedTitle: "Ingredients you dislike",
    dislikedDesc: "These ingredients will always be avoided in suggestions.",
    dislikedPlaceholder: "e.g. coriander",
    savePrefs: "Save preferences",
    saving: "Saving...",
    prefsSaved: "Preferences saved",
    themeTitle: "Site colors",
    themeDesc: "Choose the color palette you prefer.",

    // Favorites
    favTitle: "Your favorite recipes",
    favSub: "Everything you saved, in one place.",
    favEmpty: "No favorites yet. Generate a recipe and save it!",
    favRemoved: "Recipe removed",

    // Misc
    notFound: "Page not found.",
    back: "Back",
    somethingWrong: "Something went wrong",
    tryAgain: "Try again",
    typeAndEnter: "Type and press Enter",
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
