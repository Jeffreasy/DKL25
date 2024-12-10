import type { CTACardData } from './types';

export const ctaCardsData: CTACardData[] = [
  {
    title: "Schrijf je in",
    description: "Doe mee met De Koninklijke Loop en steun een goed doel.",
    icon: "register",
    actionType: "inschrijven",
    buttonText: "Inschrijven"
  },
  {
    title: "Doneer",
    description: "Help ons om nog meer impact te maken met jouw donatie.",
    icon: "info",
    actionType: "doneren",
    buttonText: "Doneren"
  },
  {
    title: "Meer informatie",
    description: "Lees meer over De Koninklijke Loop en onze missie.",
    icon: "info",
    actionType: "navigate",
    path: "/wat-is-de-koninklijkeloop",
    buttonText: "Lees meer"
  }
]; 