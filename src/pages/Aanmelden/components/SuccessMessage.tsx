import { RegistrationFormData } from '../types/schema';
import { useEffect, useState, memo, useCallback } from 'react';
import QRCode from 'qrcode';
import { toast } from 'react-hot-toast';
import { cc, cn, colors } from '@/styles/shared';
import { CSSConfetti } from '@/components/common/CSSConfetti';
import { getOptimizedImageUrl } from '@/utils/imageOptimization';

interface SuccessMessageProps {
  data: RegistrationFormData;
}

// Locatie constanten
const VENUE = {
  name: 'Grote Kerk',
  address: 'Loolaan 16',
  postalCode: '7315 AB',
  city: 'Apeldoorn',
  coordinates: {
    lat: 52.21163749694824,
    lng: 5.962539196014404
  }
};

// Helper functie voor Google Maps URL
const getMapsUrl = () => {
  const query = encodeURIComponent(`${VENUE.name}, ${VENUE.address}, ${VENUE.city}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
};

export const SuccessMessage: React.FC<SuccessMessageProps> = memo(({ data }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti effect
    setShowConfetti(true);

    // Genereer QR code
    QRCode.toDataURL('https://dekoninklijkeloop.nl', {
      width: 128,
      margin: 2,
      color: {
        dark: '#ff9328', // Keep as hex for QR code library compatibility
        light: '#FFFFFF'
      }
    }).then(setQrCodeUrl);

    // Preload logo
    const img = new Image();
    img.src = getOptimizedImageUrl('664b8c1e593a1e81556b4238_0760849fb8_yn6vdm', {
      width: 180,
      height: 180,
      crop: 'fill',
      quality: 'auto',
      format: 'auto'
    });
  }, []);


  const handlePrint = async () => {
    try {
      setIsPrinting(true);
      const registrationId = Math.random().toString(36).substr(2, 9).toUpperCase();
      const printContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Aanmeldbevestiging - De Koninklijke Loop</title>
            <meta charset="utf-8">
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
              
              body {
                font-family: 'Inter', system-ui, -apple-system, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 40px 20px;
              }
              .header {
                text-align: center;
                margin-bottom: 40px;
                position: relative;
              }
              .header img {
                max-height: 100px;
                margin-bottom: 20px;
              }
              .header h1 {
                font-size: 24px;
                color: #ff9328; /* Keep for print compatibility */
                margin-bottom: 10px;
              }
              .registration-id {
                position: absolute;
                top: 0;
                right: 0;
                font-size: 14px;
                color: #6b7280;
              }
              .details {
                margin: 30px 0;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 20px;
              }
              .detail-row {
                display: flex;
                justify-content: space-between;
                padding: 12px 0;
                border-bottom: 1px solid #e5e7eb;
              }
              .detail-row:last-child {
                border-bottom: none;
              }
              .label {
                font-weight: 600;
                color: #4b5563;
              }
              .info-box {
                background: #fff7ed;
                border: 1px solid #fed7aa;
                border-radius: 8px;
                padding: 20px;
                margin-top: 30px;
              }
              .info-box h3 {
                color: #ff9328; /* Keep for print compatibility */
                margin-top: 0;
              }
              .qr-section {
                text-align: center;
                margin: 30px 0;
              }
              .qr-code {
                width: 128px;
                height: 128px;
                margin: 0 auto;
              }
              .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                font-size: 14px;
                color: #6b7280;
              }
              .location-info {
                margin-top: 20px;
                padding: 15px;
                background: #f9fafb;
                border-radius: 8px;
              }
              @media print {
                body {
                  padding: 0;
                }
                .no-print {
                  display: none;
                }
                @page {
                  margin: 2cm;
                }
              }
              .location-section {
                margin: 30px 0;
                padding: 20px;
                background: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
              }
              .location-header {
                display: flex;
                align-items: center;
                margin-bottom: 16px;
              }
              .location-icon {
                width: 24px;
                height: 24px;
                margin-right: 12px;
                color: #ff9328; /* Keep for print compatibility */
              }
              .map-image {
                width: 100%;
                height: 300px;
                object-fit: cover;
                border-radius: 8px;
                margin: 16px 0;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="registration-id">ID: ${registrationId}</div>
              <img src="${getOptimizedImageUrl('664b8c1e593a1e81556b4238_0760849fb8_yn6vdm', { width: 180, height: 180, crop: 'fill', quality: 'auto', format: 'auto' })}" alt="DKL Logo">
              <h1>Aanmeldbevestiging</h1>
              <p>Datum: ${new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>

            <div class="details">
              <div class="detail-row">
                <span class="label">Naam:</span>
                <span>${data.naam}</span>
              </div>
              <div class="detail-row">
                <span class="label">Email:</span>
                <span>${data.email}</span>
              </div>
              <div class="detail-row">
                <span class="label">Rol:</span>
                <span>${data.rol}</span>
              </div>
              <div class="detail-row">
                <span class="label">Afstand:</span>
                <span>${data.afstand}</span>
              </div>
              ${data.telefoon ? `
              <div class="detail-row">
                <span class="label">Telefoon:</span>
                <span>${data.telefoon}</span>
              </div>
              ` : ''}
            </div>

            <div class="info-box">
              <h3>Belangrijke informatie</h3>
              <ul>
                <li>Het evenement vindt plaats op 16 mei 2025</li>
                <li>Zorg dat je op tijd aanwezig bent voor je start</li>
                <li>Houd onze website in de gaten voor het laatste nieuws</li>
                <li>Neem deze bevestiging mee naar het evenement</li>
              </ul>
              
              <div class="location-info">
                <strong>Locatie:</strong><br>
                Sportpark Prinses Irene<br>
                Sportlaan 5<br>
                5076 AM Haaren
              </div>
            </div>

            <div class="qr-section">
              <img src="${qrCodeUrl}" alt="QR Code" class="qr-code">
              <p>Scan deze code voor meer informatie</p>
            </div>

            <div class="footer">
              <p>De Koninklijke Loop 2026</p>
              <p>www.dekoninklijkeloop.nl | info@dekoninklijkeloop.nl</p>
              <p><small>Dit is een automatisch gegenereerd document</small></p>
            </div>

            <div class="location-section">
              <div class="location-header">
                <svg class="location-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
                <h3 style="font-size: 18px; font-weight: 600; color: #111827; margin: 0;">Startlocatie</h3>
              </div>
              <div style="margin-bottom: 16px;">
                <p style="font-weight: 600; margin: 0;">${VENUE.name}</p>
                <p style="margin: 4px 0;">${VENUE.address}</p>
                <p style="margin: 0;">${VENUE.postalCode} ${VENUE.city}</p>
              </div>
            </div>
          </body>
        </html>
      `;

      // Wacht tot fonts geladen zijn
      await document.fonts.ready;

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Popup blocker detected');
      }

      printWindow.document.write(printContent);
      printWindow.document.close();

      // Wacht tot alles geladen is
      const loadPromise = new Promise((resolve) => {
        printWindow.onload = resolve;
      });

      await loadPromise;
      printWindow.focus();
      printWindow.print();
      printWindow.close();
      
      toast.success('Print preview geopend');
    } catch (error) {
      console.error('Print error:', error);
      toast.error('Er ging iets mis bij het printen');
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <>
      {showConfetti && <CSSConfetti />}
      
      {/* Structured Data for Successful Registration */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ConfirmAction",
          "actionStatus": "CompletedActionStatus",
          "agent": {
            "@type": "Person",
            "name": data.naam,
            "email": data.email
          },
          "object": {
            "@type": "RegisterAction",
            "event": {
              "@type": "Event",
              "@id": "https://www.dekoninklijkeloop.nl/aanmelden#event",
              "name": "De Koninklijke Loop 2025",
              "startDate": "2025-05-17T09:00:00+02:00",
              "endDate": "2025-05-17T15:00:00+02:00",
              "location": {
                "@type": "Place",
                "name": VENUE.name,
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": VENUE.address,
                  "addressLocality": VENUE.city,
                  "postalCode": VENUE.postalCode,
                  "addressCountry": "NL"
                }
              }
            }
          },
          "result": {
            "@type": "Reservation",
            "reservationStatus": "https://schema.org/ReservationConfirmed",
            "underName": data.naam,
            "reservationFor": {
              "@type": "Event",
              "name": "De Koninklijke Loop 2025"
            }
          }
        })}
      </script>

      <article className={cn(cc.container.base, 'py-12 sm:py-16')} role="main" aria-labelledby="success-heading">
        <div className={cn('max-w-2xl mx-auto bg-white rounded-xl overflow-hidden', cc.shadow.lg)}>
        {/* Header sectie */}
        <header className={cn(colors.primary.bg, 'p-8 text-center')}>
          <div className="mb-4">
            <img
              src={getOptimizedImageUrl('664b8c1e593a1e81556b4238_0760849fb8_yn6vdm', {
                width: 96,
                height: 96,
                crop: 'fill',
                quality: 'auto',
                format: 'auto'
              })}
              alt="DKL Logo"
              className="h-24 mx-auto"
            />
          </div>
          <h1 id="success-heading" className={cn(cc.text.h2, 'text-white mb-2', cc.typography.heading)}>
            Bedankt voor je aanmelding!
        </h1>
          <p className={cn(cc.text.h5, 'text-white/90')}>
            We hebben je aanmelding ontvangen en een bevestigingsmail gestuurd naar{' '}
            <span className={cn(cc.text.body)}>{data.email}</span>
        </p>
      </header>

        {/* Aanmeldgegevens sectie */}
        <section className="p-8" aria-labelledby="registration-details-heading">
          <h2 id="registration-details-heading" className={cn(cc.text.h4, 'text-gray-900 mb-6', cc.typography.heading)}>
            Je aanmeldgegevens
          </h2>
          <dl className="space-y-4">
            <div className={cn(cc.flex.between, 'py-3', cc.divider.horizontal, 'border-gray-200')}>
              <dt className={cn(cc.text.body, 'text-gray-600')}>Naam</dt>
              <dd className={cn(cc.text.body, 'text-gray-900')}>{data.naam}</dd>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <dt className={cn(cc.text.body, 'text-gray-600')}>Rol</dt>
              <dd className={cn(cc.text.body, 'text-gray-900')}>{data.rol}</dd>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <dt className={cn(cc.text.body, 'text-gray-600')}>Afstand</dt>
              <dd className={cn(cc.text.body, 'text-gray-900')}>{data.afstand}</dd>
      </div>
            {data.telefoon && (
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <dt className={cn(cc.text.body, 'text-gray-600')}>Telefoon</dt>
                <dd className={cn(cc.text.body, 'text-gray-900')}>{data.telefoon}</dd>
              </div>
            )}
          </dl>

          {/* Belangrijke informatie */}
          <aside className={cn('mt-8 bg-orange-50 border border-orange-200 rounded-lg p-6')} aria-labelledby="important-info-heading">
            <h3 id="important-info-heading" className={cn(cc.text.h5, 'text-gray-900 mb-4')}>
              Belangrijke informatie
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className={cn(colors.primary.text, 'mr-2')}>•</span>
                Het evenement vindt plaats op 16 mei 2025
              </li>
              <li className="flex items-start">
                <span className={cn(colors.primary.text, 'mr-2')}>•</span>
                Zorg dat je op tijd aanwezig bent voor je start
              </li>
              <li className="flex items-start">
                <span className={cn(colors.primary.text, 'mr-2')}>•</span>
                Houd onze website in de gaten voor het laatste nieuws
              </li>
            </ul>
          </aside>
        </section>

        {/* Locatie sectie */}
        <section className="p-8 border-t border-gray-100" aria-labelledby="location-heading">
          <div className="flex items-center mb-6">
            <span className={cn(colors.primary.text, 'text-xl mr-3')} aria-hidden="true">📍</span>
            <h2 id="location-heading" className={cn(cc.text.h4, 'text-gray-900', cc.typography.heading)}>
              Startlocatie
            </h2>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <address className="space-y-2 mb-4 not-italic">
              <strong className={cn(cc.text.body, 'text-gray-900')}>{VENUE.name}</strong>
              <p className={cn(cc.text.body, 'text-gray-600')}>{VENUE.address}</p>
              <p className={cn(cc.text.body, 'text-gray-600')}>{VENUE.postalCode} {VENUE.city}</p>
            </address>

            <a
              href={getMapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-orange-50',
                colors.primary.text,
                cc.transition.base
              )}
            >
              <span className="text-sm">🔗</span>
              <span>Bekijk op Google Maps</span>
            </a>
        </div>
      </section>

        {/* Footer met social media en print/download knoppen */}
        <footer className="bg-gray-50 px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
            <a
              href="/"
              className={cn(
                'inline-flex items-center px-6 py-3 text-white',
                cc.border.circle,
                colors.primary.bg,
                colors.primary.hover,
                cc.transition.base,
                'hover:-translate-y-0.5',
                cc.shadow.lg
              )}
            >
              Terug naar home
            </a>
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className={cn(
                'inline-flex items-center gap-2 px-6 py-3 bg-white disabled:opacity-50 disabled:cursor-not-allowed',
                cc.border.circle,
                colors.primary.text,
                'border-2',
                colors.primary.border,
                'hover:bg-orange-50',
                cc.transition.base
              )}
              aria-label="Print bevestiging"
            >
              <span>🖨️</span>
              <span>{isPrinting ? 'Bezig...' : 'Print bevestiging'}</span>
            </button>
          </div>

          {/* Social Media Links */}
          <nav className="flex justify-center items-center gap-6 mt-4" aria-label="Social media links">
            <a
              href="https://facebook.com/dekoninklijkeloop"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(colors.primary.text, 'hover:text-primary-dark', cc.transition.colors)}
              aria-label="Volg ons op Facebook"
            >
              <span style={{ fontSize: '24px' }}>📘</span>
            </a>
            <a
              href="https://instagram.com/dekoninklijkeloop"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(colors.primary.text, 'hover:text-primary-dark', cc.transition.colors)}
              aria-label="Volg ons op Instagram"
            >
              <span style={{ fontSize: '24px' }}>📷</span>
            </a>
            <a
              href="https://youtube.com/@dekoninklijkeloop"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(colors.primary.text, 'hover:text-primary-dark', cc.transition.colors)}
              aria-label="Volg ons op YouTube"
            >
              <span style={{ fontSize: '24px' }}>📺</span>
            </a>
            <a
              href="https://linkedin.com/company/dekoninklijkeloop"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(colors.primary.text, 'hover:text-primary-dark', cc.transition.colors)}
              aria-label="Volg ons op LinkedIn"
            >
              <span style={{ fontSize: '24px' }}>💼</span>
            </a>
          </nav>
        </footer>
      </div>
    </article>
    </>
  );
});

SuccessMessage.displayName = 'SuccessMessage';