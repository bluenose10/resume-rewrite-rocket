
import { supabase } from '@/integrations/supabase/client';

export const useEmailConfirmation = () => {
  const sendConfirmationEmail = async (email: string, fullName?: string) => {
    try {
      console.log('Sending confirmation email to:', email);
      
      // Call our edge function to send the confirmation email
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'confirmation',
          email: email,
          fullName: fullName || email.split('@')[0]
        }
      });

      if (error) {
        console.error('Error sending confirmation email:', error);
        throw error;
      }

      console.log('Confirmation email sent successfully:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
      return { success: false, error };
    }
  };

  return {
    sendConfirmationEmail
  };
};
