import { useForm } from 'react-hook-form';
import { useState } from 'react';

interface ContactFormData {
  naam: string;
  email: string;
  telefoon?: string;
  bericht: string;
  website?: string; // honeypot field
}

export const useContactForm = (onSuccess: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const form = useForm<ContactFormData>({
    defaultValues: {
      naam: '',
      email: '',
      telefoon: '',
      bericht: '',
      website: '' // honeypot
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    // Check honeypot
    if (data.website) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Implementeer hier je submit logica
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simuleer API call
      onSuccess();
    } catch (error) {
      setSubmitError('Er is iets misgegaan. Probeer het later opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    submitError,
    onSubmit: form.handleSubmit(onSubmit)
  };
}; 