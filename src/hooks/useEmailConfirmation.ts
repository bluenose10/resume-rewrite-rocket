
import { supabase } from '@/integrations/supabase/client';

export const useEmailConfirmation = () => {
  const sendConfirmationEmail = async (email: string, fullName?: string, retryCount = 0): Promise<{success: boolean, error?: string, data?: any}> => {
    try {
      console.log('Sending confirmation email to:', email, 'Retry attempt:', retryCount);
      
      // Call our edge function to send the confirmation email
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'confirmation',
          email: email,
          fullName: fullName || email.split('@')[0]
        }
      });

      if (error) {
        console.error('Error calling send-email function:', error);
        
        // If it's a network error and we haven't retried too many times, try again
        if (retryCount < 2 && (error.message?.includes('network') || error.message?.includes('fetch'))) {
          console.log('Network error detected, retrying...');
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Wait 1s, 2s, 3s
          return sendConfirmationEmail(email, fullName, retryCount + 1);
        }
        
        return { success: false, error: error.message };
      }

      // Check if the response indicates success
      if (data && data.success) {
        console.log('Confirmation email sent successfully:', data);
        return { success: true, data };
      } else {
        console.error('Email sending failed:', data);
        return { success: false, error: data?.error || 'Unknown error' };
      }
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
      
      // If it's a network error and we haven't retried too many times, try again
      if (retryCount < 2 && error instanceof Error && (error.message?.includes('network') || error.message?.includes('fetch'))) {
        console.log('Network error detected, retrying...');
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return sendConfirmationEmail(email, fullName, retryCount + 1);
      }
      
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  return {
    sendConfirmationEmail
  };
};
