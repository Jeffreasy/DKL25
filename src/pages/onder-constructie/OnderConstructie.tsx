import React from 'react';
import { motion } from 'framer-motion';
import { FaTools } from 'react-icons/fa';
import { SEO } from '../../components/SEO';
import { useUnderConstruction } from '../../hooks/useUnderConstruction';

const OnderConstructie: React.FC = () => {
  const { data, loading, error } = useUnderConstruction();

  if (loading) {
    return (
      <>
        <SEO
          route="/onder-constructie"
          title="Onder Constructie - De Koninklijke Loop"
          description="Deze pagina is momenteel onder constructie."
        />
        <div className="min-h-screen pt-20 bg-white">
          <div className="w-full max-w-[1400px] mx-auto px-6 py-12 font-roboto antialiased">
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-64 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-56 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <SEO
          route="/onder-constructie"
          title="Onder Constructie - De Koninklijke Loop"
          description="Deze pagina is momenteel onder constructie."
        />
        <div className="min-h-screen pt-20 bg-white">
          <div className="w-full max-w-[1400px] mx-auto px-6 py-12 font-roboto antialiased">
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Fout bij laden</h1>
                <p className="text-gray-600">Er is een probleem opgetreden bij het laden van de pagina.</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        route="/onder-constructie"
        title={`${data.title} - De Koninklijke Loop`}
        description={data.message}
      />
      <div className="min-h-screen pt-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="w-full max-w-[1400px] mx-auto px-6 py-12 font-roboto antialiased">
          <div className="flex items-center justify-center min-h-[50vh]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg xs:rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden max-w-md w-full"
            >
              <div className="bg-primary p-4 sm:p-6">
                <FaTools className="w-8 h-8 mx-auto mb-2 text-white" />
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-heading">
                  {data.title}
                </h1>
              </div>
              <div className="p-4 sm:p-6 text-center">
                <p className="text-gray-600 mb-4 font-body">
                  {data.message}
                </p>
                <p className="text-primary font-semibold font-body">{data.footer_text}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnderConstructie;