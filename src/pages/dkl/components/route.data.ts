export interface RouteItem {
  title: string;
  content: string;
  icon: string;
  komootUrl?: string;
}

export const routeData: RouteItem[] = [
  {
    title: 'De Loop over De Koninklijke Weg',
    content: 'Met Koninklijke Loop wandelen we over een speciaal wandelpad. Het is namelijk het laatste stukje van de Koninklijke Weg. Deze route loopt van Paleis Noordeinde naar Paleis Het Loo, en is bij elkaar 170 kilometer lang. Natuurlijk gaan we dat hele stuk niet op zaterdag 17 mei lopen. Met de Koninklijke Loop wandelen we van Kootwijk naar Paleis Het Loo.',
    icon: 'directions_walk'
  },
  {
    title: 'Koninklijke Weg',
    content: 'De Koninklijke Weg loopt van Paleis Noordeinde in Den Haag, via Soestdijk naar Paleis Het Loo. Onderweg loop je door het Groene Hart, over de Utrechtse Heuvelrug en via de Veluwe.',
    icon: 'emoji_flags'
  },
  {
    title: 'Paleis Noordeinde',
    content: 'Paleis Noordeinde is het beginpunt van de Koninklijke Weg. Het paleis is een van de drie paleizen die door de Nederlandse staat ter beschikking zijn gesteld aan het staatshoofd.',
    icon: 'place'
  },
  {
    title: 'Toegankelijkheid',
    content: 'Het pad is voor iedereen toegankelijk, ook voor mensen met een lichamelijke beperking. De route is onderverdeeld in 21 etappes variërend in lengte van 5,4 tot 14 km.',
    icon: 'accessible'
  },
  {
    title: 'Onze Route',
    content: 'Dit is de route die we lopen tijdens de Koninklijke Loop. Bekijk de interactieve kaart hieronder voor meer details.',
    icon: 'map',
    komootUrl: 'https://www.komoot.nl/tour/1234567890'
  }
];

export const contentItems = [
  {
    icon: "emoji_flags",
    title: "Koninklijke Weg",
    text: "De Koninklijke Weg loopt van Paleis Noordeinde in Den Haag, via Soestdijk naar Paleis Het Loo. Onderweg loop je door het Groene Hart, over de Utrechtse Heuvelrug en via de Veluwe."
  },
  {
    icon: "place",
    title: "Paleis Noordeinde",
    text: "Paleis Noordeinde is het beginpunt van de Koninklijke Weg. Het paleis is een van de drie paleizen die door de Nederlandse staat ter beschikking zijn gesteld aan het staatshoofd."
  },
  {
    icon: "accessible",
    title: "Toegankelijkheid",
    text: "Het pad is voor iedereen toegankelijk, ook voor mensen met een lichamelijke beperking. De route is onderverdeeld in 21 etappes variërend in lengte van 5,4 tot 14 km.",
    illustration: {
      src: "https://cdn.prod.website-files.com/65c6896e8519c5d0bae5586f/671ff32e5e9bec64a207e3b2_route%20Koninklijke%20weg.jpg",
      caption: "Anneke van de Glind"
    }
  },
  {
    icon: "map",
    title: "Onze Route",
    text: "Dit is de route die we lopen tijdens de Koninklijke Loop. Bekijk de interactieve kaart hieronder voor meer details.",
    mapUrl: "https://www.komoot.com/nl-nl/tour/1914852208/embed?share_token=amNaNnjQrpHjos4rnAN4E3jReDmCWWTlgUuoGvDgE4cA7mkSzG&profile=1"
  }
]; 