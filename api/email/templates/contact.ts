import { z } from 'zod';

// Type definitie voor contact email data
const ContactEmailData = z.object({
  naam: z.string(),
  email: z.string().email(),
  bericht: z.string(),
  privacy: z.boolean()
});

type ContactEmailProps = {
  naam: string;
  email: string;
  bericht: string;
  isConfirmation?: boolean;
};

export const getContactEmailHtml = ({ 
  naam, 
  email, 
  bericht,
  isConfirmation = false 
}: ContactEmailProps) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isConfirmation ? 'Bedankt voor je bericht' : 'Nieuw Contact Formulier'} - De Koninklijke Loop</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #ff9328; padding: 24px; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; font-size: 28px; margin: 0; text-align: center; font-weight: 700; letter-spacing: -0.025em;">
      ${isConfirmation ? 'Bedankt voor je bericht' : 'Nieuw Contact Formulier'}
    </h1>
  </div>

  <div style="background: white; border-radius: 0 0 12px 12px; padding: 24px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    ${isConfirmation ? `
      <div style="margin-bottom: 24px;">
        <p style="font-size: 15px; margin-bottom: 16px;">Beste ${naam},</p>
        <p style="font-size: 15px; margin-bottom: 16px;">
          We hebben je bericht ontvangen en zullen zo spoedig mogelijk contact met je opnemen.
        </p>
        <p style="font-size: 15px; margin-bottom: 16px;">
          Hieronder vind je een kopie van je bericht:
        </p>
      </div>
    ` : `
      <div style="margin-bottom: 24px;">
        <p style="font-size: 15px; margin-bottom: 16px;">Er is een nieuw bericht ontvangen via het contactformulier:</p>
      </div>
    `}

    <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
      <div style="margin-bottom: 16px;">
        <div style="font-weight: 600; color: #374151; margin-bottom: 4px; letter-spacing: -0.025em;">Van:</div>
        <div style="font-size: 15px;">${naam} (${email})</div>
      </div>

      <div>
        <div style="font-weight: 600; color: #374151; margin-bottom: 4px; letter-spacing: -0.025em;">Bericht:</div>
        <div style="white-space: pre-wrap; background: white; padding: 12px; border-radius: 6px; border: 1px solid #E5E7EB; font-size: 15px; line-height: 1.7;">
          ${bericht}
        </div>
      </div>
    </div>

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
        ${isConfirmation 
          ? 'Dit bericht is verzonden via het contactformulier op dekoninklijkeloop.nl'
          : `Je kunt direct antwoorden op deze email om contact op te nemen met ${naam}`
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