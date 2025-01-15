interface EmailTemplateProps {
    naam: string;
    email: string;
    bericht: string;
    isConfirmation?: boolean;
  }
  
  const LOGO_URL =
    'https://res.cloudinary.com/dgfuv7wif/image/upload/v1/45fbfc9a9b1d48299487e445c2ef3b30';
  
  const socialLinks = {
    facebook: 'https://www.facebook.com/profile.php?id=61555182577683',
    instagram: 'https://www.instagram.com/dekoninklijkeloop',
    website: 'https://www.dekoninklijkeloop.nl',
  };
  
  export function getContactEmailHtml({
    naam,
    email,
    bericht,
    isConfirmation = false,
  }: EmailTemplateProps): string {
    // Eventuele basis-escaping voor het bericht en <br/> vervanging voor nieuwe regels
    const safeMessage = bericht
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br/>');
  
    // De hoofdkleur voor je achtergrond
    const bgColor = '#FFE5CC';
  
    // Hoofdlayout in tables
    return `
  <!DOCTYPE html>
  <html lang="nl">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>${
        isConfirmation ? `Bedankt voor je bericht, ${naam}!` : `Nieuw bericht ontvangen`
      }</title>
      <!--
        Table-based layout voor maximale compatibiliteit,
        vooral in Outlook en andere desktop-clients.
      -->
    </head>
    <body style="margin:0; padding:0; background-color:${bgColor}; font-family:Arial, sans-serif;">
  
      <!-- Outer wrapper table -->
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:${bgColor};">
        <tr>
          <td align="center" style="padding:20px;">
          
            <!-- Container table -->
            <table width="600" border="0" cellspacing="0" cellpadding="0" 
                   style="background-color:#FFFFFF; border-radius:16px; overflow:hidden; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
              <!-- Header met logo en oranje gradient -->
              <tr>
                <td align="center" 
                    style="
                      background: linear-gradient(to bottom, rgba(255,147,40,0.4), rgba(255,147,40,0.5));
                      padding:32px;
                    ">
                  <img
                    src="${LOGO_URL}"
                    alt="Logo van De Koninklijke Loop"
                    style="width:180px; height:auto; display:block; margin-bottom:24px;"
                  />
                </td>
              </tr>
  
              <!-- Content -->
              <tr>
                <td style="padding:32px;">
  
                  <!-- Conditie: bevestigingsmail of nieuwe melding -->
                  ${
                    isConfirmation
                      ? `
                      <h1 style="color:#ff9328; font-size:24px; font-weight:bold; margin:0 0 16px; text-align:center;">
                        <span style="font-size:24px; margin-right:8px;">👋</span>
                        Bedankt voor je bericht, ${naam}!
                      </h1>
                      <p style="color:#4a5568; font-size:16px; text-align:center; margin:0 0 32px;">
                        We hebben je bericht goed ontvangen en nemen zo snel mogelijk contact met je op.
                      </p>
                      <table width="100%" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px;" cellspacing="0" cellpadding="16">
                        <tr>
                          <td>
                            <div style="color:#ff9328; font-weight:600; font-size:14px; margin-bottom:8px; display:flex; align-items:center;">
                              <span style="margin-right:8px;">💌</span> Je bericht
                            </div>
                            <p style="color:#2d3748; margin:0; line-height:1.6;">
                              ${safeMessage}
                            </p>
                          </td>
                        </tr>
                      </table>
                    `
                      : `
                      <h1 style="color:#ff9328; font-size:24px; font-weight:bold; margin:0 0 16px; text-align:center;">
                        <span style="font-size:24px; margin-right:8px;">📬</span>
                        Nieuw bericht ontvangen
                      </h1>
                      <table width="100%" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px;" cellspacing="0" cellpadding="16">
                        <tr>
                          <td>
                            <div style="color:#ff9328; font-weight:600; font-size:14px; margin-bottom:8px; display:flex; align-items:center;">
                              <span style="margin-right:8px;">👤</span> Van
                            </div>
                            <p style="color:#2d3748; margin:0; line-height:1.6;">
                              ${naam}
                            </p>
                            <div style="height:16px;"></div>
                            <div style="color:#ff9328; font-weight:600; font-size:14px; margin-bottom:8px; display:flex; align-items:center;">
                              <span style="margin-right:8px;">📧</span> Email
                            </div>
                            <p style="color:#2d3748; margin:0; line-height:1.6;">
                              ${email}
                            </p>
                            <div style="height:16px;"></div>
                            <div style="color:#ff9328; font-weight:600; font-size:14px; margin-bottom:8px; display:flex; align-items:center;">
                              <span style="margin-right:8px;">💭</span> Bericht
                            </div>
                            <p style="color:#2d3748; margin:0; line-height:1.6;">
                              ${safeMessage}
                            </p>
                          </td>
                        </tr>
                      </table>
                    `
                  }
  
                </td>
              </tr>
  
              <!-- Footer -->
              <tr>
                <td align="center" style="background:#f8fafc; padding:24px 32px; border-top:1px solid #e2e8f0;">
                  <div style="color:#2d3748; font-weight:600; margin-bottom:24px;">
                    Met vriendelijke groet,<br/>
                    Team De Koninklijke Loop
                  </div>
                  
                  <!-- Social buttons -->
                  <table border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center" style="padding:4px;">
                        <a href="${socialLinks.facebook}"
                           style="
                             display:inline-block; padding:8px 20px; background:#FF9328; color:#FFFFFF; text-decoration:none; border-radius:9999px;
                             font-weight:500; font-size:14px;
                           ">
                          <span style="margin-right:8px;">👍</span>Facebook
                        </a>
                      </td>
                      <td align="center" style="padding:4px;">
                        <a href="${socialLinks.instagram}"
                           style="
                             display:inline-block; padding:8px 20px; background:#FF9328; color:#FFFFFF; text-decoration:none; border-radius:9999px;
                             font-weight:500; font-size:14px;
                           ">
                          <span style="margin-right:8px;">📸</span>Instagram
                        </a>
                      </td>
                      <td align="center" style="padding:4px;">
                        <a href="${socialLinks.website}"
                           style="
                             display:inline-block; padding:8px 20px; background:#FF9328; color:#FFFFFF; text-decoration:none; border-radius:9999px;
                             font-weight:500; font-size:14px;
                           ">
                          <span style="margin-right:8px;">🌐</span>Website
                        </a>
                      </td>
                    </tr>
                  </table>
  
                  <p style="color:#718096; font-size:12px; margin-top:24px;">
                    ${
                      isConfirmation
                        ? '✨ Dit is een automatisch gegenereerde email. Je kunt niet op deze email reageren.'
                        : '✨ Je kunt direct reageren op deze email om contact op te nemen met de afzender.'
                    }
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
    `.replace(/\s+/g, ' ').trim();
  }
  