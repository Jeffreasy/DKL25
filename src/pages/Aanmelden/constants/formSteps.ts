export const formSteps = [
  {
    id: 1,
    title: 'Contactgegevens',
    description: 'Vul je persoonlijke gegevens in',
    fields: ['naam', 'email']
  },
  {
    id: 2,
    title: 'Rol',
    description: 'Kies je rol voor het evenement',
    fields: ['rol']
  },
  {
    id: 3,
    title: 'Afstand',
    description: 'Kies je gewenste afstand',
    fields: ['afstand']
  },
  {
    id: 4,
    title: 'Ondersteuning',
    description: 'Geef aan of je ondersteuning nodig hebt',
    fields: ['ondersteuning', 'bijzonderheden']
  }
] as const; 