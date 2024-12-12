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
    icon: "donate",
    actionType: "doneren",
    buttonText: "Doneren"
  },
  {
    title: "Wie zijn wij",
    description: "Lees meer over De Koninklijke Loop en onze missie.",
    icon: "about",
    actionType: "navigate",
    path: "/over-ons",
    buttonText: "Wie zijn wij"
  }
];

// Debug log
console.log("CTACards data:", ctaCardsData); 