import { Link } from 'react-router-dom';
import { AanmeldFormData } from '../types';

interface SuccessMessageProps {
  data: AanmeldFormData;
}

export function SuccessMessage({ data }: SuccessMessageProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 print:shadow-none print:p-0">
      {/* Success Header - Verbeterde tekstkleuren */}
      <div className="text-center mb-8 print:mb-4">
        <div className="text-6xl mb-4 print:hidden">🎉</div>
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Bedankt voor je inschrijving!
        </h1>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Je inschrijving voor de Koninklijke loop op 17 mei 2025 is succesvol ontvangen.
          We hebben een bevestigingsmail gestuurd naar <span className="font-medium">{data.email}</span>.
        </p>
      </div>

      {/* Motivatie Boodschap - Verbeterde achtergrond contrast */}
      <div className="bg-blue-50 border-l-4 border-primary p-4 mb-8 print:bg-white print:border-none">
        <p className="text-gray-800">
          De Koninklijke Loop is meer dan alleen een hardloopevenement. Het is een dag waarop we 
          samen lopen voor inclusiviteit en verbinding. Jouw deelname maakt het verschil voor 
          mensen met een beperking. Bedankt dat je onderdeel bent van deze bijzondere dag!
        </p>
      </div>

      {/* Registratie Details - Verbeterd contrast */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8 print:bg-white print:p-0">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Jouw inschrijfgegevens</h2>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem label="Naam" value={data.naam} />
            <DetailItem label="E-mail" value={data.email} />
            {data.telefoon && (
              <DetailItem label="Telefoon" value={data.telefoon} />
            )}
            <DetailItem label="Rol" value={data.rol} />
            <DetailItem label="Afstand" value={data.afstand} />
            <DetailItem label="Ondersteuning" value={data.ondersteuning} />
            {data.bijzonderheden && (
              <div className="col-span-full">
                <DetailItem label="Bijzonderheden" value={data.bijzonderheden} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actie Knoppen - Ongewijzigd want goede contrast */}
      <div className="flex justify-center gap-4 print:hidden">
        <Link
          to="/"
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark 
            transition-all transform hover:-translate-y-1 hover:shadow-lg"
        >
          Terug naar homepage
        </Link>
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200
            transition-all transform hover:-translate-y-1 hover:shadow-lg"
        >
          Print bevestiging
        </button>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-gray-200 pb-2">
      <span className="text-sm font-medium text-gray-600 block">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
} 