
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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();

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
    
    // Generate a proper confirmation URL using the actual app URL
    const appUrl = "https://cvai.site";
    const confirmationUrl = `${appUrl}/auth/confirm?confirmed=true`;
    
    // Render the confirmation email
    const emailHtml = await renderAsync(
      React.createElement(ConfirmationEmail, {
        userName: payload.fullName || payload.email!.split('@')[0],
        confirmationUrl: confirmationUrl,
      })
    );

    // Send confirmation email - FIX: Use array format for 'to' field
    const emailResponse = await resend.emails.send({
      from: "ResumeAI <onboarding@resend.dev>",
      to: [payload.email!], // This was the issue - needs to be an array
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
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
