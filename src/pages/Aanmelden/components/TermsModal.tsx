import { cc, cn, colors } from '@/styles/shared';
import { memo } from 'react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export const TermsModal = memo(({ isOpen, onClose, onAccept }: TermsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={cn('fixed inset-0 overflow-y-auto bg-black/50 backdrop-blur-sm', cc.zIndex.modal)}>
      <div className={cn(cc.flex.center, 'min-h-full p-4')}>
        <div className={cn('relative w-full max-w-2xl bg-white rounded-xl', cc.shadow.xl)}>
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-xl">
            <h2 className={cn(cc.text.h4, 'text-gray-900')}>
              Algemene Voorwaarden
            </h2>
            <button
              onClick={onClose}
              className={cn(
                'text-gray-400 hover:text-gray-500 rounded-lg p-1',
                cc.transition.colors,
                'focus:outline-none focus:ring-2 focus:ring-primary/20'
              )}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content met volledige voorwaarden */}
          <div className="p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
            <div className="prose prose-sm max-w-none text-gray-600 prose-headings:text-gray-900 prose-strong:text-gray-900">
              <p className={cn(cc.text.body, 'text-gray-900')}>Koninklijke Loop – 17 mei 2025</p>

              <h3 className={cn(cc.text.h5, 'text-gray-900 mt-6 mb-4')}>Artikel 1: Definities</h3>
              <p><strong>1.1 Organisatoren:</strong> De rechtspersonen en/of natuurlijke personen die verantwoordelijk zijn voor de organisatie van het Evenement, te weten de Koninklijke Loop op 17 mei 2025.</p>
              <p><strong>1.2 Deelnemer:</strong> De natuurlijke persoon (m/v/o), niet handelend als ondernemer, die zich op een door de Organisatoren toegestane wijze heeft ingeschreven voor deelname aan het Evenement.</p>
              <p><strong>1.3 Evenement:</strong> De Koninklijke Loop, een sponsorloop die door de Organisatoren wordt gehouden op 17 mei 2025.</p>
              <p><strong>1.4 Overeenkomst:</strong> De overeenkomst tussen Deelnemer en Organisatoren betreffende deelname aan het Evenement.</p>

              <h3 className={cn(cc.text.h5, 'text-gray-900 mt-6 mb-4')}>Artikel 2: Deelname</h3>
              <p><strong>2.1</strong> Deelname aan het Evenement is uitsluitend mogelijk indien de Deelnemer of diens gezaghebbende het inschrijfformulier volledig, naar waarheid en correct heeft ingevuld. Door inschrijving stemt de Deelnemer, dan wel de gezaghebbende, in met deze Algemene Voorwaarden. De Organisatoren behouden zich het recht voor om inschrijvingen met foutieve of onjuiste gegevens te annuleren.</p>
              <p><strong>2.2</strong> Deelname is enkel toegestaan aan natuurlijke personen. Het is niet toegestaan tijdens het Evenement begeleid te worden door een of meer personen op fietsen of andere vervoersmiddelen, tenzij met uitdrukkelijke en schriftelijke toestemming van de Organisatoren. Deelnemers mogen geen honden of andere (huis)dieren meenemen tijdens het Evenement.</p>
              <p><strong>2.3</strong> De deelname aan het Evenement is strikt persoonlijk. Het is niet toegestaan een ander persoon in de plaats van een ingeschreven Deelnemer te laten deelnemen.</p>
              <p><strong>2.6</strong> Indien het Evenement door overmacht of onvoorziene omstandigheden (zoals ongevallen, extreme weersomstandigheden, aanslagen, pandemie, etc.) geen doorgang kan vinden, vindt er geen restitutie van gedoneerde gelden plaats.</p>
              <p><strong>2.7</strong> De wedstrijdleiding is te allen tijde bevoegd een Deelnemer te diskwalificeren en deelname aan het Evenement te ontzeggen. Evenzo kan de medische staf, indien daartoe aanleiding bestaat, een Deelnemer verdere deelname verbieden.</p>
              <p><strong>2.8</strong> De Organisatoren kunnen, in geval van overmacht of uitzonderlijke omstandigheden, besluiten het Evenement (tussentijds) te beëindigen, op te schorten, te neutraliseren, de route te wijzigen of de te lopen afstand aan te passen. In deze gevallen vindt geen restitutie van reeds gedoneerde bedragen plaats.</p>
              <p><strong>2.9</strong> Een besluit van de Organisatoren om het Evenement geen doorgang te laten vinden of voortijdig te beëindigen, schept geen aansprakelijkheid voor vergoeding van door Deelnemers gemaakte kosten.</p>

              <h3 className={cn(cc.text.h5, 'text-gray-900 mt-6 mb-4')}>Artikel 3: Aansprakelijkheid</h3>
              <p><strong>3.1</strong> De Deelnemer of de voor hem/haar gezaghebbende verklaart zich bewust te zijn dat deelname aan het Evenement zowel fysieke als mentale fitheid vereist. De Deelnemer bevestigt over de vereiste gezondheid te beschikken en zich door training en voorbereiding adequaat te hebben voorbereid op het Evenement.</p>
              <p><strong>3.2</strong> Deelname geschiedt volledig voor eigen risico. De Organisatoren zijn niet aansprakelijk voor enige schade die de Deelnemer mocht lijden als gevolg van deelname, tenzij deze schade het directe gevolg is van opzet, grove schuld of nalatigheid aan de zijde van de Organisatoren. Deze uitsluiting omvat ook ernstige schade, zoals letsel of overlijden.</p>
              <p><strong>3.3</strong> Indien, ondanks het in het vorige lid bepaalde, aansprakelijkheid van de Organisatoren wordt aangenomen, is de schadevergoeding beperkt tot het bedrag dat de verzekeraar van de Organisatoren ter zake van die schade uitkeert.</p>

              <h3 className={cn(cc.text.h5, 'text-gray-900 mt-6 mb-4')}>Artikel 4: Persoonlijke eigendommen</h3>
              <p><strong>4.1</strong> De Organisatoren zijn niet aansprakelijk voor verlies, diefstal of beschadiging van persoonlijke eigendommen van Deelnemers tijdens het Evenement.</p>
              <p><strong>4.2</strong> Deelnemers worden geadviseerd waardevolle spullen thuis te laten en alleen het hoognodige mee te nemen tijdens het Evenement.</p>

              <h3 className={cn(cc.text.h5, 'text-gray-900 mt-6 mb-4')}>Artikel 5: Privacy</h3>
              <p><strong>5.1</strong> De door de Deelnemer verstrekte persoonsgegevens worden door de Organisatoren opgenomen in een bestand. Door deelname aan het Evenement verleent een Deelnemer toestemming aan de Organisatoren tot gebruik van de persoonsgegevens voor het verzenden van informatie aan de Deelnemer.</p>
              <p><strong>5.2</strong> De Deelnemer verleent door het aangaan van de Overeenkomst toestemming aan de Organisatoren tot openbaarmaking van tijdens of rond het Evenement gemaakte foto's en beeldmateriaal en dergelijke, waarop de Deelnemer zichtbaar is.</p>

              <h3 className={cn(cc.text.h5, 'text-gray-900 mt-6 mb-4')}>Artikel 6: Geschillenregeling</h3>
              <p><strong>6.1</strong> Op deze algemene voorwaarden is Nederlands recht van toepassing.</p>
              <p><strong>6.2</strong> Alle geschillen die mochten ontstaan naar aanleiding van de Overeenkomst zullen worden voorgelegd aan de bevoegde rechter in het arrondissement waar de Organisatoren zijn gevestigd.</p>

              <h3 className={cn(cc.text.h5, 'text-gray-900 mt-6 mb-4')}>Artikel 7: Gedragsregels</h3>
              <p><strong>7.1</strong> Deelnemers dienen zich te houden aan de aanwijzingen van de Organisatoren, vrijwilligers en medisch personeel tijdens het Evenement.</p>
              <p><strong>7.2</strong> Deelnemers dienen zich sportief en respectvol te gedragen tegenover andere deelnemers, vrijwilligers en toeschouwers.</p>
              <p><strong>7.3</strong> Het is niet toegestaan tijdens het Evenement uitingen te doen of kleding te dragen die als aanstootgevend of discriminerend kunnen worden ervaren.</p>

              <h3 className={cn(cc.text.h5, 'text-gray-900 mt-6 mb-4')}>Artikel 8: Slotbepaling</h3>
              <p><strong>8.1</strong> In gevallen waar deze voorwaarden niet in voorzien, beslist de organisatie.</p>
              <p><strong>8.2</strong> Deze algemene voorwaarden kunnen door de Organisatoren worden aangepast. De meest recente versie is bindend.</p>
              <p><strong>8.3</strong> Deze algemene voorwaarden zijn laatst gewijzigd op 1 januari 2024.</p>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 z-10 flex items-center justify-end gap-4 p-6 
            border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <button
              onClick={onClose}
              className={cn(
                'px-4 py-2 text-gray-700 hover:text-gray-900 rounded-lg',
                cc.transition.colors,
                'focus:outline-none focus:ring-2 focus:ring-primary/20'
              )}
            >
              Sluiten
            </button>
            <button
              onClick={() => {
                onAccept();
                onClose();
              }}
              className={cn(
                'px-4 py-2 text-white rounded-lg',
                colors.primary.bg,
                colors.primary.hover,
                cc.transition.base,
                'focus:outline-none focus:ring-2 focus:ring-primary/20'
              )}
            >
              Ik ga akkoord
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

TermsModal.displayName = 'TermsModal';
