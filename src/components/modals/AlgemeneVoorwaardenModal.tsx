import React from 'react';
import { Dialog } from '@headlessui/react';
import CloseIcon from '@mui/icons-material/Close';

interface AlgemeneVoorwaardenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlgemeneVoorwaardenModal: React.FC<AlgemeneVoorwaardenModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm">
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-primary px-6 py-4 flex items-center justify-between">
                <Dialog.Title className="text-xl font-bold text-white">
                  Algemene Voorwaarden
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="text-white hover:bg-white/10 p-1 rounded-full transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-8 max-h-[70vh] overflow-y-auto">
                <div className="prose prose-orange max-w-none">
                  <h2>Koninklijke loop 18 mei 2024</h2>
                  
                  <h3>Artikel 1: Definities</h3>
                  <p>1.1 Organisatoren: De organisatoren betrokken bij het organiseren van de Sponsorloop; Koninklijke loop 18 mei 2024.</p>
                  <p>1.2 Deelnemer: De natuurlijke persoon (m/v/o), niet handelend als ondernemer, die zich op een door de Organisator toegelaten wijze heeft ingeschreven voor deelname aan de Sponsorloop.</p>
                  <p>1.3 Evenement: Sponsorloop die door de Organisatoren wordt georganiseerd op 18 mei 2024.</p>
                  <p>1.4 Overeenkomst: De overeenkomst strekkende tot deelname van de deelnemer aan het Evenement.</p>

                  <h3>Artikel 2: Deelname</h3>
                  <p>2.1 Deelname aan het Evenement is uitsluitend mogelijk door een natuurlijk persoon wanneer deze of de gezaghebbende van de deelnemer het daartoe strekkende inschrijvingsformulier volledig en naar waarheid heeft ingevuld. Met de inschrijving heeft de deelnemer danwel gezaghebbende ingestemd met deze algemene voorwaarden. De Organisatoren behouden zich het recht om te allen tijde inschrijvingen van Deelnemers met vals ingevulde persoonlijke gegevens te annuleren en te verwijderen.</p>
                  <p>2.2 Deelname staat alleen open voor natuurlijke personen. Het is Deelnemers niet toegestaan zich te laten begeleiden door een of meer personen op een fiets of ander vervoersmiddel tenzij met uitdrukkelijke schriftelijke toestemming van de Organisatoren. Het is niet toegestaan honden (al dan niet aangelijnd) mee deel te laten nemen aan het Evenement.</p>
                  <p>2.3 De deelname aan het Evenement geschiedt door de Deelnemer persoonlijk. Het is niet toegestaan een ander in de plaats van de Deelnemer te laten deelnemen.</p>
                  <p>2.6 Indien het Evenement door uitzonderlijke omstandigheden of vanwege overmacht (bijvoorbeeld ongevallen, storm, aanslagen, pandemie et cetera) niet kan doorgaan, vindt geen restitutie plaats van het donatiegeld.</p>
                  <p>2.7 De wedstrijdleiding heeft het recht een Deelnemer te diskwalificeren en tot de deelname van het Evenement te ontzetten. Ook de medische staf heeft het recht een Deelnemer (verdere) deelname aan het Evenement te ontzeggen.</p>
                  <p>2.8 De Organisatoren kunnen gedurende het Evenement op grond van uitzonderlijke omstandigheden of vanwege overmacht besluiten het Evenement voortijdig te beëindigen, op te schorten of neutraliseren. Ook kunnen de Organisatoren op grond van uitzonderlijke omstandigheden gedurende het Evenement besluiten de te lopen route of af te leggen afstand te wijzigen. In bedoelde gevallen vindt geen restitutie plaats van het gedoneerde geld.</p>
                  <p>2.9 Een besluit van de Organisatoren om het Evenement geen doorgang te laten vinden doet geen aansprakelijkheid ontstaan voor vergoeding van eventuele door de Deelnemers gemaakte kosten.</p>

                  <h3>Artikel 3: Aansprakelijkheid</h3>
                  <p>3.1 De Deelnemer of Gezaghebbende over Deelnemer verklaart zich bekend met het feit dat deelname aan het Evenement een voldoende goede gezondheid in fysieke en psychische zin vereist. Tevens verklaart de Deelnemer dat hij/zij aan deze eis voldoet en dat hij/zij zich door training en anderszins voldoende heeft voorbereid op het Evenement.</p>
                  <p>3.2 Deelname geschiedt op eigen risico. De Organisatoren zijn niet aansprakelijk voor enige schade, hoe ook genaamd, die de Deelnemer mocht lijden als gevolg van deelname, tenzij deze schade het directe gevolg is van aan de Organisator toe te rekenen opzet, grove schuld of nalatigheid. Deze uitsluiting van aansprakelijkheid geldt ook voor ernstige schadesoorten zoals mogelijke schadesoorten ten gevolge van letsel en overlijden.</p>
                  <p>3.3 Indien – ondanks het bepaald in het eerste lid van dit artikel – aansprakelijkheid van de Organisatoren voor schade van de Deelnemer moet worden aangenomen, blijft de verplichting van Organisatoren tot vergoeding van die schade beperkt tot ten hoogste het bedrag dat de verzekeraar van de Organisatoren ter zake van die schade uitkeert.</p>
                  <p>3.4 De Deelnemer dient voldoende verzekerd te zijn tegen het risico van schade die hij/zij of een nabestaande mocht lijden ten gevolge van zijn of haar overlijden, letsel of ziekte als gevolg van deelname aan het Evenement. De Deelnemer vrijwaart de Organisatoren voor schade die derden mochten lijden als gevolg van een aan de Deelnemer toe te rekenen handelen of nalaten van handelen met betrekking tot het Evenement. De Deelnemer dient voldoende verzekerd te zijn tegen het risico van aansprakelijkheid voor bedoelde schade.</p>

                  <h3>Artikel 4: Persoonlijke eigendommen</h3>
                  <p>4.1 Indien de Organisatoren gedurende het Evenement zaken van de Deelnemer voor hem/haar bewaart of indien een Deelnemer – al dan niet met instemming van de Organisatoren – zaken achterlaat in een al dan niet door de Organisatie beheerde ruimte, zijn de Organisatoren niet aansprakelijk voor schade die ontstaat door verlies, diefstal, vermissing of beschadiging enzovoort van die zaken.</p>

                  <h3>Artikel 5: Privacy</h3>
                  <p>5.1 Bij inschrijving verleent de Deelnemer toestemming aan de Organisatoren en haar partners voor openbaarmaking van tijdens of rond het Evenement gemaakte foto's, audio- en videomateriaal en dergelijke, waarop de Deelnemer zichtbaar of hoorbaar is.</p>
                  <p>5.2 De door de Deelnemer verstrekte persoonsgegevens worden opgenomen in een bestand. De Deelnemer verleent door het aangaan van de overeenkomst toestemming aan de Organisatoren tot gebruik van de persoonsgegevens voor doeleinden zoals beschreven in de Privacyverklaring van de Organisatoren.</p>
                  <p>5.3 Vanaf 25 mei 2018 gelden nieuwe Europese privacy-regels van de General Data Protection Regulation (GDPR), in het Nederlands de Algemene verordening gegevensbescherming (AVG). Organisator respecteert deze privacy-regels en handelt conform deze wetgeving. Op dit punt maken de meest recente versies van de Privacyverklaring van de Organisatoren integraal deel uit van deze Algemene Voorwaarden.</p>

                  <h3>Artikel 6: Geschillenregeling</h3>
                  <p>6.1 Geschillen tussen Deelnemer en Organisatoren worden – met uitsluiting van de burgerlijk rechter – door arbitrage beslecht overeenkomstig het arbitrage reglement van het Nederlands Arbitrage Instituut. Er is sprake van een geschil indien een van beide partijen verklaart dat dit het geval is. Op de Overeenkomst, deze Algemene Voorwaarden en alle rechtsbetrekkingen die tussen de Organisatoren en de Deelnemer mochten ontstaan, is uitsluitend Nederlands recht van toepassing.</p>

                  <h3>Artikel 7: Algemene gedragsregels</h3>
                  <p>7.1 Instructie van politie, organisatie, Evenement begeleiding en medewerkers moeten direct en stipt worden opgevolgd. Ook dienen Deelnemers de aangegeven aanlooproute te volgen. Het niet opvolgen van de instructies kan diskwalificatie tot gevolg hebben.</p>
                  <p>7.2 De Wegenverkeerswet en het reglement 'Verkeersregels en Verkeerstekens' blijven tijdens de loop onverkort van kracht, tenzij uitdrukkelijk anders aangegeven is in die situaties waarin aan de Organisatoren ontheffing verleend is.</p>
                  <p>7.3 In het start/finishgebied, langs het parcours en op de route naar het start-finishgebied geldt een algeheel verbod op flyeren, sampling en andere promotionele activiteiten anders dan door de stichting expliciet en voorafgaand aan het Evenement toegezegd.</p>
                  <p>7.4 Van iedere Deelnemer wordt verwacht geen schade toe te brengen aan de natuur of aan andermans eigendommen en geen afval achter te laten.</p>

                  <h3>Artikel 8: Slotbepaling</h3>
                  <p>8.1 Indien een of enkele artikelen van deze voorwaarden nietig of onwettig zouden zijn, om welke reden dan ook, doet dit geen afbreuk aan de geldigheid van de andere onderdelen van de voorwaarden.</p>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                <button
                  onClick={onClose}
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Sluiten
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AlgemeneVoorwaardenModal;
