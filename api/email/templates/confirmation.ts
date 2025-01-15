import { RegistrationFormData } from '../../../src/pages/Aanmelden/types/schema';

export const getConfirmationEmailTemplate = (data: RegistrationFormData) => {
  const rolText = {
    Deelnemer: 'als deelnemer',
    Begeleider: 'als begeleider',
    Vrijwilliger: 'als vrijwilliger'
  }[data.rol];

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Aanmeldbevestiging - De Koninklijke Loop</title>
        <style>
          body {
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #374151;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            max-width: 200px;
            margin-bottom: 20px;
          }
          h1 {
            color: #ff9328;
            font-size: 24px;
            margin-bottom: 20px;
          }
          .content {
            background: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .details {
            margin: 20px 0;
            padding: 20px;
            background: #f9fafb;
            border-radius: 6px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #ff9328;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 20px;
          }
          .social-links {
            margin-top: 20px;
          }
          .social-links a {
            color: #ff9328;
            text-decoration: none;
            margin: 0 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://res.cloudinary.com/dgfuv7wif/image/upload/v1733267882/664b8c1e593a1e81556b4238_0760849fb8_yn6vdm.png" alt="DKL Logo" class="logo">
            <h1>Bedankt voor je aanmelding!</h1>
          </div>
          
          <div class="content">
            <p>Beste ${data.naam},</p>
            
            <p>Bedankt voor je aanmelding ${rolText} voor De Koninklijke Loop 2025! We hebben je registratie succesvol ontvangen.</p>
            
            <div class="details">
              <h2>Je aanmeldgegevens:</h2>
              <ul>
                <li><strong>Naam:</strong> ${data.naam}</li>
                <li><strong>E-mail:</strong> ${data.email}</li>
                <li><strong>Rol:</strong> ${data.rol}</li>
                <li><strong>Afstand:</strong> ${data.afstand}</li>
                ${data.telefoon ? `<li><strong>Telefoon:</strong> ${data.telefoon}</li>` : ''}
                ${data.bijzonderheden ? `<li><strong>Bijzonderheden:</strong> ${data.bijzonderheden}</li>` : ''}
              </ul>
            </div>

            <p><strong>Belangrijke informatie:</strong></p>
            <ul>
              <li>Het evenement vindt plaats op 17 mei 2025</li>
              <li>Locatie: Grote Kerk, Loolaan 16, 7315 AB Apeldoorn</li>
              <li>Zorg dat je op tijd aanwezig bent voor je start</li>
              <li>Houd onze website in de gaten voor het laatste nieuws</li>
            </ul>

            <p>Heb je vragen? Neem dan gerust contact met ons op via <a href="mailto:info@dekoninklijkeloop.nl">info@dekoninklijkeloop.nl</a></p>

            <a href="https://dekoninklijkeloop.nl" class="button">Bezoek onze website</a>
          </div>

          <div class="footer">
            <p>De Koninklijke Loop 2025</p>
            <p>Een initiatief van Stichting De Koninklijke Loop</p>
            <div class="social-links">
              <a href="https://facebook.com/dekoninklijkeloop">Facebook</a>
              <a href="https://instagram.com/dekoninklijkeloop">Instagram</a>
              <a href="https://linkedin.com/company/dekoninklijkeloop">LinkedIn</a>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}; 