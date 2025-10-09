import type { CTACardData } from './types';

export const ctaCardsData: CTACardData[] = [
  {
    title: "Meld je aan",
    description: "Doe mee met De Koninklijke Loop (DKL) als wandelaar en steun een goed doel.",
    icon: "register",
    actionType: "inschrijven",
    buttonText: "Aanmelden"
  },
  {
    title: "Doneer",
    description: "Help ons De Koninklijke Loop (DKL) nog mooier te maken met jouw donatie aan dit unieke wandelevenement.",
    icon: "info",
    actionType: "doneren",
    buttonText: "Doneren"
  },
  {
    title: "Meer informatie",
    description: "Lees meer over De Koninklijke Loop (DKL), de toegankelijke wandelroute en onze missie.",
    icon: "info",
    actionType: "navigate",
    path: "/wat-is-de-koninklijkeloop",
    buttonText: "Lees meer"
  }
]; 