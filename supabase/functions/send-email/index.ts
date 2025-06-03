
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import { ConfirmationEmail } from "./_templates/confirmation-email.tsx";
import * as React from "npm:react@18.3.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to?: string;
  subject?: string;
  html?: string;
  from?: string;
  type?: string;
  email?: string;
  fullName?: string;
}

interface AuthWebhookPayload {
  type: string;
  table: string;
  record?: any;
  schema: string;
  old_record?: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();

    // Check if this is a webhook from Supabase Auth
    if (requestBody.type && requestBody.table === 'users') {
      return await handleAuthWebhook(requestBody);
    }

    // Handle confirmation email type
    if (requestBody.type === 'confirmation' && requestBody.email) {
      return await handleConfirmationEmail(requestBody);
    }

    // Handle direct email requests (existing functionality)
    const { to, subject, html, from }: EmailRequest = requestBody;

    const emailResponse = await resend.emails.send({
      from: from || "ResumeAI <onboarding@resend.dev>",
      to: [to!],
      subject: subject!,
      html: html!,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

const handleConfirmationEmail = async (payload: EmailRequest): Promise<Response> => {
  try {
    console.log("Sending confirmation email to:", payload.email);
    
    // Generate a simple confirmation URL (this would normally come from Supabase)
    const baseUrl = "https://your-app.lovableproject.com";
    const confirmationUrl = `${baseUrl}/auth/confirm?confirmed=true`;
    
    // Render the confirmation email
    const emailHtml = await renderAsync(
      React.createElement(ConfirmationEmail, {
        userName: payload.fullName || payload.email!.split('@')[0],
        confirmationUrl: confirmationUrl,
      })
    );

    // Send confirmation email
    const emailResponse = await resend.emails.send({
      from: "ResumeAI <onboarding@resend.dev>",
      to: [payload.email!],
      subject: "Welcome to ResumeAI - Confirm your account",
      html: emailHtml,
    });

    console.log("Confirmation email sent:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Confirmation email sent",
      emailId: emailResponse.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error sending confirmation email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

const handleAuthWebhook = async (payload: AuthWebhookPayload): Promise<Response> => {
  try {
    console.log("Auth webhook received:", payload);

    // Handle user creation (sign up)
    if (payload.type === 'INSERT' && payload.record) {
      const user = payload.record;
      
      // Check if email is not confirmed yet
      if (!user.email_confirmed_at && user.email) {
        console.log("Sending confirmation email to:", user.email);
        
        // Generate confirmation URL
        const baseUrl = Deno.env.get("SUPABASE_URL") || "https://uqoxukprtmpnpsnxngog.supabase.co";
        const confirmationUrl = `${baseUrl}/auth/v1/verify?token=${user.confirmation_token}&type=signup&redirect_to=${encodeURIComponent('https://your-app.lovableproject.com/')}`;
        
        // Render the confirmation email
        const emailHtml = await renderAsync(
          React.createElement(ConfirmationEmail, {
            userName: user.raw_user_meta_data?.full_name || user.email.split('@')[0],
            confirmationUrl: confirmationUrl,
          })
        );

        // Send confirmation email
        const emailResponse = await resend.emails.send({
          from: "ResumeAI <onboarding@resend.dev>",
          to: [user.email],
          subject: "Welcome to ResumeAI - Confirm your account",
          html: emailHtml,
        });

        console.log("Confirmation email sent:", emailResponse);

        return new Response(JSON.stringify({ 
          success: true, 
          message: "Confirmation email sent",
          emailId: emailResponse.id 
        }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });
      }
    }

    // Return success for other webhook types
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Webhook processed" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error handling auth webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
