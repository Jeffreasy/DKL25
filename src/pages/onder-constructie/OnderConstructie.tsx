import React from 'react';
import { motion } from 'framer-motion';
import { FaTools } from 'react-icons/fa';
import { SEO } from '../../components/common/SEO';
import { useUnderConstruction } from '../../hooks/useUnderConstruction';
import { cc, cn, colors } from '@/styles/shared';

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
      <div className={cn('min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50', cc.flex.center, cc.typography.body)}>
        <div className={cn(cc.container.narrow, 'px-6 py-12 text-center')}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className={cn(cc.flex.center, 'mb-6')}>
              <FaTools className={cn('w-16 h-16', colors.primary.text)} aria-label="Onder constructie" />
            </div>
            <h1 className={cn(cc.text.h1, 'font-bold text-gray-900 tracking-tight leading-tight', cc.typography.heading)}>
              {data.title}
            </h1>
            <p className={cn(cc.text.h4, cc.text.muted, cc.typography.body, 'max-w-2xl mx-auto leading-relaxed')}>
              {data.message}
            </p>
            <p className={cn(cc.text.h5, 'font-semibold', colors.primary.text, cc.typography.body)}>
              {data.footer_text}
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default OnderConstructie;