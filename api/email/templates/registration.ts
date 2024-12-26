import { z } from 'zod';

// Basis type voor registratie data
export const RegistrationEmailData = z.object({
  naam: z.string(),
  email: z.string().email(),
  rol: z.enum(['Deelnemer', 'Begeleider', 'Vrijwilliger']),
  afstand: z.string(),
  telefoon: z.string().optional(),
  ondersteuning: z.enum(['Ja', 'Nee', 'Anders']),
  bijzonderheden: z.string().optional()
});

// Type voor de email template props
export interface EmailTemplateProps extends z.infer<typeof RegistrationEmailData> {
  isAdmin?: boolean;
  isConfirmation?: boolean;
}

export const getRegistrationEmailHtml = ({ 
  naam, 
  email, 
  rol, 
  afstand,
  telefoon,
  ondersteuning,
  bijzonderheden,
  isAdmin = false,
  isConfirmation = false 
}: EmailTemplateProps) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isAdmin ? 'Nieuwe aanmelding' : 'Bedankt voor je aanmelding'} - De Koninklijke Loop</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #ff9328; padding: 24px; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; font-size: 28px; margin: 0; text-align: center; font-weight: 700; letter-spacing: -0.025em;">
      ${isAdmin ? 'Nieuwe aanmelding ontvangen' : 'Bedankt voor je aanmelding!'}
    </h1>
  </div>

  <div style="background: white; border-radius: 0 0 12px 12px; padding: 24px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    ${isAdmin ? `
      <div style="margin-bottom: 24px;">
        <p style="font-size: 15px; margin-bottom: 16px;">Er is een nieuwe aanmelding ontvangen voor De Koninklijke Loop 2025.</p>
      </div>
    ` : `
      <div style="margin-bottom: 24px;">
        <p style="font-size: 15px; margin-bottom: 16px;">Beste ${naam},</p>
        <p style="font-size: 15px; margin-bottom: 16px;">
          Bedankt voor je aanmelding voor De Koninklijke Loop 2025! We zijn blij dat je erbij bent als ${rol.toLowerCase()}.
        </p>
      </div>
    `}

    <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
      <h2 style="font-size: 18px; font-weight: 600; color: #374151; margin: 0 0 16px; letter-spacing: -0.025em;">
        ${isAdmin ? 'Aanmeldgegevens' : 'Je aanmeldgegevens'}
      </h2>
      <div style="font-size: 15px; line-height: 1.7;">
        <p style="margin: 0 0 8px;"><strong>Naam:</strong> ${naam}</p>
        <p style="margin: 0 0 8px;"><strong>E-mail:</strong> ${email}</p>
        <p style="margin: 0 0 8px;"><strong>Rol:</strong> ${rol}</p>
        <p style="margin: 0 0 8px;"><strong>Afstand:</strong> ${afstand}</p>
        ${telefoon ? `<p style="margin: 0 0 8px;"><strong>Telefoon:</strong> ${telefoon}</p>` : ''}
        ${ondersteuning !== 'Nee' ? `
          <p style="margin: 0 0 8px;"><strong>Ondersteuning:</strong> ${ondersteuning}</p>
          ${bijzonderheden ? `<p style="margin: 0;"><strong>Bijzonderheden:</strong> ${bijzonderheden}</p>` : ''}
        ` : ''}
      </div>
    </div>

    ${!isAdmin ? `
      <div style="background: #FFF7ED; border: 1px solid #FFEDD5; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h2 style="font-size: 18px; font-weight: 600; color: #374151; margin: 0 0 16px; letter-spacing: -0.025em;">
          Belangrijke informatie
        </h2>
        <ul style="font-size: 15px; line-height: 1.7; margin: 0; padding-left: 20px;">
          <li>Het evenement vindt plaats op 17 mei 2025</li>
          <li>Zorg dat je op tijd aanwezig bent voor je start</li>
          <li>Houd onze website in de gaten voor het laatste nieuws</li>
          ${rol !== 'Deelnemer' ? `<li>Je ontvangt later meer informatie over je rol als ${rol.toLowerCase()}</li>` : ''}
        </ul>
      </div>
    ` : ''}

    <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #E5E7EB;">
      <div style="margin-bottom: 16px;">
        <a href="https://dekoninklijkeloop.nl" 
           style="display: inline-block; background: #ff9328; color: white; padding: 12px 24px; text-decoration: none; border-radius: 9999px; font-weight: 500; letter-spacing: -0.025em; font-size: 15px;">
          Bezoek onze website
        </a>
      </div>

      <div style="margin-bottom: 16px;">
        <a href="https://facebook.com/dekoninklijkeloop" style="color: #ff9328; text-decoration: none; margin: 0 8px; font-weight: 500; font-size: 14px;">Facebook</a>
        <a href="https://instagram.com/dekoninklijkeloop" style="color: #ff9328; text-decoration: none; margin: 0 8px; font-weight: 500; font-size: 14px;">Instagram</a>
      </div>

      <div style="text-align: center; margin-top: 24px;">
        <img src="https://res.cloudinary.com/dgfuv7wif/image/upload/v1733267882/664b8c1e593a1e81556b4238_0760849fb8_yn6vdm.png" 
             alt="De Koninklijke Loop" 
             style="max-width: 200px; height: auto;">
      </div>

      <p style="color: #6B7280; font-size: 12px; margin-top: 16px; line-height: 1.5;">
        ${isAdmin 
          ? `Dit is een automatische notificatie van een nieuwe aanmelding.` 
          : `Deze bevestiging is verzonden door De Koninklijke Loop.<br>
             Heb je vragen? Neem dan contact met ons op via info@dekoninklijkeloop.nl`
        }
      </p>

      <p style="color: #6B7280; font-size: 12px; margin: 0; line-height: 1.5;">
        © 2024 De Koninklijke Loop. Alle rechten voorbehouden.
      </p>
    </div>
  </div>
</body>
</html>
`; 