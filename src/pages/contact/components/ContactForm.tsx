import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { contactSchema, type ContactFormData } from '@/types/contact';

const API_BASE_URL = import.meta.env.DEV ? '/api' : import.meta.env.VITE_EMAIL_SERVICE_URL;

export const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch(`${API_BASE_URL}/contact-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          email_verzonden: false,
          status: 'nieuw'
        })
      });

      if (!response.ok) {
        throw new Error('Er ging iets mis bij het versturen van je bericht');
      }

      toast.success('Je bericht is succesvol verzonden!');
      reset();
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error(error instanceof Error ? error.message : 'Er ging iets mis bij het versturen van je bericht');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="naam" className="block text-sm font-medium text-gray-700">
            Naam
          </label>
          <input
            type="text"
            id="naam"
            className={`mt-1 block w-full rounded-md shadow-sm
              ${errors.naam ? 'border-red-300' : 'border-gray-300'}
              focus:border-[#ff9328] focus:ring focus:ring-[#ff9328] focus:ring-opacity-50`}
            {...register('naam')}
          />
          {errors.naam && (
            <p className="mt-1 text-sm text-red-600">{errors.naam.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            E-mailadres
          </label>
          <input
            type="email"
            id="email"
            className={`mt-1 block w-full rounded-md shadow-sm
              ${errors.email ? 'border-red-300' : 'border-gray-300'}
              focus:border-[#ff9328] focus:ring focus:ring-[#ff9328] focus:ring-opacity-50`}
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="bericht" className="block text-sm font-medium text-gray-700">
            Je bericht
          </label>
          <textarea
            id="bericht"
            rows={4}
            className={`mt-1 block w-full rounded-md shadow-sm
              ${errors.bericht ? 'border-red-300' : 'border-gray-300'}
              focus:border-[#ff9328] focus:ring focus:ring-[#ff9328] focus:ring-opacity-50`}
            {...register('bericht')}
          />
          {errors.bericht && (
            <p className="mt-1 text-sm text-red-600">{errors.bericht.message}</p>
          )}
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              id="privacy_akkoord"
              className="focus:ring-[#ff9328] h-4 w-4 text-[#ff9328] border-gray-300 rounded"
              {...register('privacy_akkoord')}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="privacy_akkoord" className="font-medium text-gray-700">
              Ik ga akkoord met de privacy voorwaarden
            </label>
            {errors.privacy_akkoord && (
              <p className="mt-1 text-sm text-red-600">{errors.privacy_akkoord.message}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
            ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#ff9328] hover:bg-[#e67f1c]'}
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff9328]`}
        >
          {isSubmitting ? 'Bericht versturen...' : 'Verstuur bericht'}
        </button>
      </div>
    </form>
  );
}; 