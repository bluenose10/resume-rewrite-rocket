
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import { ConfirmationEmail } from "./_templates/confirmation-email.tsx";
import * as React from "npm:react@18.3.1";

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
  console.log("=== Email Function Called ===");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Headers:", Object.fromEntries(req.headers.entries()));
  
  if (req.method === "OPTIONS") {
    console.log("CORS preflight request handled");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Parsing request body...");
    const requestBody = await req.json();
    console.log("Request body received:", JSON.stringify(requestBody, null, 2));
    
    // Check if RESEND_API_KEY is available
    const apiKey = Deno.env.get("RESEND_API_KEY");
    console.log("RESEND_API_KEY present:", !!apiKey);
    console.log("RESEND_API_KEY length:", apiKey ? apiKey.length : 0);
    
    if (!apiKey) {
      console.error("RESEND_API_KEY is missing from environment variables");
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Email service not configured. Please contact support.",
          code: "MISSING_API_KEY"
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Initialize Resend with the API key
    console.log("Initializing Resend...");
    const resend = new Resend(apiKey);
    console.log("Resend initialized successfully");

    // Handle confirmation email type
    if (requestBody.type === 'confirmation' && requestBody.email) {
      console.log("Processing confirmation email for:", requestBody.email);
      return await handleConfirmationEmail(requestBody, resend);
    }

    // Handle direct email requests (existing functionality)
    console.log("Processing direct email request");
    const { to, subject, html, from }: EmailRequest = requestBody;
    console.log("Email details - To:", to, "From:", from, "Subject:", subject);

    const emailResponse = await resend.emails.send({
      from: from || "onboarding@resend.dev",
      to: [to!],
      subject: subject!,
      html: html!,
    });

    console.log("Direct email sent successfully:", emailResponse);

    return new Response(JSON.stringify({
      success: true,
      data: emailResponse
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("=== ERROR in send-email function ===");
    console.error("Error type:", typeof error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Full error object:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Unknown error occurred",
        code: "FUNCTION_ERROR"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

const handleConfirmationEmail = async (payload: EmailRequest, resend: any): Promise<Response> => {
  try {
    console.log("=== CONFIRMATION EMAIL PROCESS START ===");
    console.log("Email:", payload.email);
    console.log("Full name:", payload.fullName);
    
    // Generate a proper confirmation URL using the actual app URL
    const appUrl = "https://cvai.site";
    const confirmationUrl = `${appUrl}/auth/confirm?confirmed=true`;
    console.log("Confirmation URL generated:", confirmationUrl);
    
    // Render the confirmation email
    console.log("Rendering email template...");
    const emailHtml = await renderAsync(
      React.createElement(ConfirmationEmail, {
        userName: payload.fullName || payload.email!.split('@')[0],
        confirmationUrl: confirmationUrl,
      })
    );
    console.log("Email template rendered successfully, HTML length:", emailHtml.length);

    // Prepare email data with verified sender
    const emailData = {
      from: "onboarding@resend.dev",
      to: [payload.email!],
      subject: "Welcome to ResumeAI - Confirm your account",
      html: emailHtml,
    };
    console.log("Email data prepared:", {
      from: emailData.from,
      to: emailData.to,
      subject: emailData.subject,
      htmlLength: emailData.html.length
    });

    // Send confirmation email
    console.log("Calling Resend API...");
    const emailResponse = await resend.emails.send(emailData);
    console.log("=== RESEND API RESPONSE ===");
    console.log("Response object:", JSON.stringify(emailResponse, null, 2));

    // Check if the response indicates an error
    if (emailResponse.error) {
      console.error("Resend API returned an error:", emailResponse.error);
      
      return new Response(
        JSON.stringify({ 
          success: false,
          error: emailResponse.error.message || "Email sending failed",
          code: "RESEND_ERROR"
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Email sent successfully with ID:", emailResponse.data?.id);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Confirmation email sent",
      emailId: emailResponse.data?.id,
      debug: {
        emailSent: true,
        resendResponse: emailResponse
      }
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("=== CONFIRMATION EMAIL ERROR ===");
    console.error("Error type:", typeof error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error status:", error.status);
    console.error("Error stack:", error.stack);
    console.error("Full error object:", JSON.stringify(error, null, 2));
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Unknown error in confirmation email",
        debug: {
          errorType: typeof error,
          errorName: error.name,
          errorCode: error.code,
          errorStatus: error.status
        }
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
