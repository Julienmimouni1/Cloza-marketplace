'use server';

import { Resend } from 'resend';
import { contactFormSchema, type ContactFormValues } from '../schemas';

export async function sendContactEmail(data: ContactFormValues) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.error('Resend API key is not configured.');
    return { success: false, error: "Le service d'email n'est pas configuré." };
  }
  const resend = new Resend(resendApiKey);
  
  // Validate data
  const result = contactFormSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    const { name, email, subject, message } = result.data;

    const { data: emailData, error } = await resend.emails.send({
      from: process.env.CONTACT_EMAIL_FROM || 'Cloza <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL_TO || 'julien@example.com',
      subject: `[Contact Cloza] ${subject}`,
      html: `
        <div>
          <h1>Nouveau message de contact</h1>
          <p><strong>De:</strong> ${name} (${email})</p>
          <p><strong>Sujet:</strong> ${subject}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error('Server Action Error:', error);
    return { success: false, error: "Une erreur est survenue lors de l'envoi." };
  }
}

