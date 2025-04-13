import type { CTACardData } from './types';

export const ctaCardsData: CTACardData[] = [
  {
    title: "Meld je aan",
    description: "Doe mee met De Koninklijke Loop als wandelaar en steun een goed doel.",
    icon: "register",
    actionType: "inschrijven",
    buttonText: "Aanmelden"
  },
  {
    title: "Doneer",
    description: "Help ons dit evenement nog mooier te maken met jouw donatie aan de sponsorloop.",
    icon: "info",
    actionType: "doneren",
    buttonText: "Doneren"
  },
  {
    title: "Meer informatie",
    description: "Lees meer over het evenement De Koninklijke Loop, de route en onze missie.",
    icon: "info",
    actionType: "navigate",
    path: "/wat-is-de-koninklijkeloop",
    buttonText: "Lees meer"
  }
]; 