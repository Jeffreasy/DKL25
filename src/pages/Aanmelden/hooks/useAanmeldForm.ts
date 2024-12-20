import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { aanmeldSchema, AanmeldFormData } from '../types/schema';
import { supabase } from '@/lib/supabaseClient';

export const useAanmeldForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<AanmeldFormData>({
    resolver: zodResolver(aanmeldSchema),
    mode: 'onChange'
  });

  const { watch } = form;
  const rolValue = watch('rol');
  const ondersteuningValue = watch('ondersteuning');

  const showTelefoon = rolValue === 'Begeleider' || rolValue === 'Vrijwilliger';
  const showBijzonderheden = ondersteuningValue === 'Ja' || ondersteuningValue === 'Anders';

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const onSubmit = async (formData: AanmeldFormData) => {
    setIsSubmitting(true);
    setShowError(false);
    
    try {
      const submissionData = {
        ...formData,
        telefoon: formData.telefoon || '',
        bijzonderheden: formData.bijzonderheden || '',
        status: 'pending' as const
      };

      const { error } = await supabase
        .from('inschrijvingen')
        .insert([submissionData]);

      if (error) throw error;
      setShowSuccess(true);
      form.reset();
    } catch (error) {
      console.error('Error:', error);
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    currentStep,
    setCurrentStep,
    isSubmitting,
    showSuccess,
    showError,
    showTelefoon,
    showBijzonderheden,
    nextStep,
    prevStep,
    onSubmit
  };
}; 