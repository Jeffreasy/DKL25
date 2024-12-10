import React, { useRef, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import CloseIcon from '@mui/icons-material/Close';
import GavelIcon from '@mui/icons-material/Gavel';
import GroupIcon from '@mui/icons-material/Group';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import SecurityIcon from '@mui/icons-material/Security';
import BackpackIcon from '@mui/icons-material/Backpack';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import BalanceIcon from '@mui/icons-material/Balance';
import RuleIcon from '@mui/icons-material/Rule';
import ArticleIcon from '@mui/icons-material/Article';
import type { TermsModalProps } from './types';

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onScrollComplete }) => {
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      hasTriggeredRef.current = false;
    }
  }, [isOpen]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    
    const scrollOffset = 50;
    const isAtBottom = 
      element.scrollHeight - element.clientHeight - element.scrollTop <= scrollOffset;

    if (isAtBottom && !hasTriggeredRef.current && onScrollComplete) {
      hasTriggeredRef.current = true;
      onScrollComplete();
    }
  };

  return (
    <Dialog
      data-cy="terms-modal"
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm animate-fade-in" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel 
          className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl animate-slide-up"
          onScroll={handleScroll}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center z-10">
            <div className="flex items-center gap-3">
              <GavelIcon className="text-primary text-3xl" />
              <Dialog.Title className="text-2xl font-bold text-gray-900">
                Algemene Voorwaarden
              </Dialog.Title>
            </div>
            <button
              data-cy="close-terms-modal"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Sluiten"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Content met alle artikelen */}
          <div className="px-6 py-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl font-bold text-primary text-center mb-8">
                Koninklijke loop 17 mei 2025
              </p>

              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <GroupIcon className="text-primary text-3xl" />
                  <h2 className="text-2xl font-bold m-0">Artikel 1: Definities</h2>
                </div>
                <div className="pl-9">
                  <p><strong>1.1 Organisatoren:</strong> De organisatoren betrokken bij het organiseren van de Sponsorloop; Koninklijke loop 17 mei 2025.</p>
                  <p><strong>1.2 Deelnemer:</strong> De natuurlijke persoon (m/v/o), niet handelend als ondernemer, die zich op een door de Organisator toegelaten wijze heeft ingeschreven voor deelname aan de Sponsorloop.</p>
                  <p><strong>1.3 Evenement:</strong> Sponsorloop die door de Organisatoren wordt georganiseerd op 17 mei 2025.</p>
                  <p><strong>1.4 Overeenkomst:</strong> De overeenkomst strekkende tot deelname van de deelnemer aan het Evenement.</p>
                </div>
              </section>

              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <DirectionsRunIcon className="text-primary text-3xl" />
                  <h2 className="text-2xl font-bold m-0">Artikel 2: Deelname</h2>
                </div>
                <div className="pl-9">
                  <p><strong>2.1</strong> Deelname aan het Evenement is uitsluitend mogelijk door een natuurlijk persoon wanneer deze of de gezaghebbende van de deelnemer het daartoe strekkende inschrijvingsformulier volledig en naar waarheid heeft ingevuld. Met de inschrijving heeft de deelnemer danwel gezaghebbende ingestemd met deze algemene voorwaarden. De Organisatoren behouden zich het recht om te allen tijde inschrijvingen van Deelnemers met vals ingevulde persoonlijke gegevens te annuleren en te verwijderen.</p>
                  <p><strong>2.2</strong> Deelname staat alleen open voor natuurlijke personen. Het is Deelnemers niet toegestaan zich te laten begeleiden door een of meer personen op een fiets of ander vervoersmiddel tenzij met uitdrukkelijke schriftelijke toestemming van de Organisatoren. Het is niet toegestaan honden (al dan niet aangelijnd) mee deel te laten nemen aan het Evenement.</p>
                  <p><strong>2.3</strong> De deelname aan het Evenement geschiedt door de Deelnemer persoonlijk. Het is niet toegestaan een ander in de plaats van de Deelnemer te laten deelnemen.</p>
                  <p><strong>2.6</strong> Indien het Evenement door uitzonderlijke omstandigheden of vanwege overmacht (bijvoorbeeld ongevallen, storm, aanslagen, pandemie et cetera) niet kan doorgaan, vindt geen restitutie plaats van het donatiegeld.</p>
                  <p><strong>2.7</strong> De wedstrijdleiding heeft het recht een Deelnemer te diskwalificeren en tot de deelname van het Evenement te ontzetten. Ook de medische staf heeft het recht een Deelnemer (verdere) deelname aan het Evenement te ontzeggen.</p>
                  <p><strong>2.8</strong> De Organisatoren kunnen gedurende het Evenement op grond van uitzonderlijke omstandigheden of vanwege overmacht besluiten het Evenement voortijdig te beëindigen, op te schorten of neutraliseren. Ook kunnen de Organisatoren op grond van uitzonderlijke omstandigheden gedurende het Evenement besluiten de te lopen route of af te leggen afstand te wijzigen. In bedoelde gevallen vindt geen restitutie plaats van het gedoneerde geld.</p>
                  <p><strong>2.9</strong> Een besluit van de Organisatoren om het Evenement geen doorgang te laten vinden doet geen aansprakelijkheid ontstaan voor vergoeding van eventuele door de Deelnemers gemaakte kosten.</p>
                </div>
              </section>

              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <SecurityIcon className="text-primary text-3xl" />
                  <h2 className="text-2xl font-bold m-0">Artikel 3: Aansprakelijkheid</h2>
                </div>
                <div className="pl-9">
                  <p><strong>3.1</strong> De Deelnemer of Gezaghebbende over Deelnemer verklaart zich bekend met het feit dat deelname aan het Evenement een voldoende goede gezondheid in fysieke en psychische zin vereist. Tevens verklaart de Deelnemer dat hij/zij aan deze eis voldoet en dat hij/zij zich door training en anderszins voldoende heeft voorbereid op het Evenement.</p>
                  <p><strong>3.2</strong> Deelname geschiedt op eigen risico. De Organisatoren zijn niet aansprakelijk voor enige schade, hoe ook genaamd, die de Deelnemer mocht lijden als gevolg van deelname, tenzij deze schade het directe gevolg is van aan de Organisator toe te rekenen opzet, grove schuld of nalatigheid. Deze uitsluiting van aansprakelijkheid geldt ook voor ernstige schadesoorten zoals mogelijke schadesoorten ten gevolge van letsel en overlijden.</p>
                  <p><strong>3.3</strong> Indien – ondanks het bepaald in het eerste lid van dit artikel – aansprakelijkheid van de Organisatoren voor schade van de Deelnemer moet worden aangenomen, blijft de verplichting van Organisatoren tot vergoeding van die schade beperkt tot ten hoogste het bedrag dat de verzekeraar van de Organisatoren ter zake van die schade uitkeert.</p>
                  <p><strong>3.4</strong> De Deelnemer dient voldoende verzekerd te zijn tegen het risico van schade die hij/zij of een nabestaande mocht lijden ten gevolge van zijn of haar overlijden, letsel of ziekte als gevolg van deelname aan het Evenement. De Deelnemer vrijwaart de Organisatoren voor schade die derden mochten lijden als gevolg van een aan de Deelnemer toe te rekenen handelen of nalaten van handelen met betrekking tot het Evenement. De Deelnemer dient voldoende verzekerd te zijn tegen het risico van aansprakelijkheid voor bedoelde schade.</p>
                </div>
              </section>

              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <BackpackIcon className="text-primary text-3xl" />
                  <h2 className="text-2xl font-bold m-0">Artikel 4: Persoonlijke eigendommen</h2>
                </div>
                <div className="pl-9">
                  <p><strong>4.1</strong> Indien de Organisatoren gedurende het Evenement zaken van de Deelnemer voor hem/haar bewaart of indien een Deelnemer – al dan niet met instemming van de Organisatoren – zaken achterlaat in een al dan niet door de Organisatie beheerde ruimte, zijn de Organisatoren niet aansprakelijk voor schade die ontstaat door verlies, diefstal, vermissing of beschadiging enzovoort van die zaken.</p>
                </div>
              </section>

              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <PrivacyTipIcon className="text-primary text-3xl" />
                  <h2 className="text-2xl font-bold m-0">Artikel 5: Privacy</h2>
                </div>
                <div className="pl-9">
                  <p><strong>5.1</strong> Bij inschrijving verleent de Deelnemer toestemming aan de Organisatoren en haar partners voor openbaarmaking van tijdens of rond het Evenement gemaakte foto's, audio- en videomateriaal en dergelijke, waarop de Deelnemer zichtbaar of hoorbaar is.</p>
                  <p><strong>5.2</strong> De door de Deelnemer verstrekte persoonsgegevens worden opgenomen in een bestand. De Deelnemer verleent door het aangaan van de overeenkomst toestemming aan de Organisatoren tot gebruik van de persoonsgegevens voor doeleinden zoals beschreven in de Privacyverklaring van de Organisatoren.</p>
                  <p><strong>5.3</strong> Vanaf 25 mei 2018 gelden nieuwe Europese privacy-regels van de General Data Protection Regulation (GDPR), in het Nederlands de Algemene verordening gegevensbescherming (AVG). Organisator respecteert deze privacy-regels en handelt conform deze wetgeving. Op dit punt maken de meest recente versies van de Privacyverklaring van de Organisatoren integraal deel uit van deze Algemene Voorwaarden.</p>
                </div>
              </section>

              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <BalanceIcon className="text-primary text-3xl" />
                  <h2 className="text-2xl font-bold m-0">Artikel 6: Geschillenregeling</h2>
                </div>
                <div className="pl-9">
                  <p><strong>6.1</strong> Geschillen tussen Deelnemer en Organisatoren worden – met uitsluiting van de burgerlijke rechter – door arbitrage beslecht overeenkomstig het arbitrage reglement van het Nederlands Arbitrage Instituut. Er is sprake van een geschil indien een van beide partijen verklaart dat dit het geval is. Op de Overeenkomst, deze Algemene Voorwaarden en alle rechtsbetrekkingen die tussen de Organisatoren en de Deelnemer mochten ontstaan, is uitsluitend Nederlands recht van toepassing.</p>
                </div>
              </section>

              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <RuleIcon className="text-primary text-3xl" />
                  <h2 className="text-2xl font-bold m-0">Artikel 7: Algemene gedragsregels</h2>
                </div>
                <div className="pl-9">
                  <p><strong>7.1</strong> Instructie van politie, organisatie, Evenement begeleiding en medewerkers moeten direct en stipt worden opgevolgd. Ook dienen Deelnemers de aangegeven aanlooproute te volgen. Het niet opvolgen van de instructies kan diskwalificatie tot gevolg hebben.</p>
                  <p><strong>7.2</strong> De Wegenverkeerswet en het reglement 'Verkeersregels en Verkeerstekens' blijven tijdens de loop onverkort van kracht, tenzij uitdrukkelijk anders aangegeven is in die situaties waarin aan de Organisatoren ontheffing verleend is.</p>
                  <p><strong>7.3</strong> In het start/finishgebied, langs het parcours en op de route naar het start-finishgebied geldt een algeheel verbod op flyeren, sampling en andere promotionele activiteiten anders dan door de stichting expliciet en voorafgaand aan het Evenement toegezegd.</p>
                  <p><strong>7.4</strong> Van iedere Deelnemer wordt verwacht geen schade toe te brengen aan de natuur of aan andermans eigendommen en geen afval achter te laten.</p>
                </div>
              </section>

              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <ArticleIcon className="text-primary text-3xl" />
                  <h2 className="text-2xl font-bold m-0">Artikel 8: Slotbepaling</h2>
                </div>
                <div className="pl-9">
                  <p><strong>8.1</strong> Indien een of enkele artikelen van deze voorwaarden nietig of onwettig zouden zijn, om welke reden dan ook, doet dit geen afbreuk aan de geldigheid van de andere onderdelen van de voorwaarden.</p>
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg min-w-[160px]"
            >
              Sluiten
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}; 