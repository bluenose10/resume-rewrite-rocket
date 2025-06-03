
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
  type?: string;
  email?: string;
  fullName?: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("=== Email Function Called ===");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  
  if (req.method === "OPTIONS") {
    console.log("CORS preflight request handled");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Parsing request body...");
    const requestBody = await req.json();
    console.log("Request body received:", JSON.stringify(requestBody, null, 2));
    
    // Enhanced environment variable debugging
    console.log("=== ENVIRONMENT DEBUGGING ===");
    console.log("Available environment variables:");
    for (const [key, value] of Object.entries(Deno.env.toObject())) {
      if (key.includes('RESEND') || key.includes('API')) {
        console.log(`${key}: ${value ? '[SET]' : '[NOT SET]'}`);
      }
    }
    
    // Try multiple ways to get the API key
    const apiKey = Deno.env.get("RESEND_API_KEY") || 
                   Deno.env.get("resend_api_key") || 
                   Deno.env.get("RESEND_API_KEY_SECRET");
    
    console.log("RESEND_API_KEY present:", !!apiKey);
    console.log("API key length:", apiKey ? apiKey.length : 0);
    console.log("API key starts with 're_':", apiKey ? apiKey.startsWith('re_') : false);
    
    if (!apiKey) {
      console.error("RESEND_API_KEY is missing from environment variables");
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Email service not configured. RESEND_API_KEY is missing.",
          code: "MISSING_API_KEY",
          debug: {
            availableEnvVars: Object.keys(Deno.env.toObject()).filter(k => k.includes('RESEND') || k.includes('API'))
          }
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Handle test requests with enhanced debugging
    if (requestBody.type === 'test') {
      console.log("Processing test request");
      return new Response(JSON.stringify({
        success: true,
        message: "Function is working correctly",
        timestamp: new Date().toISOString(),
        debug: {
          apiKeyConfigured: !!apiKey,
          apiKeyLength: apiKey.length,
          environment: "edge-function"
        }
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    // Initialize Resend with the API key
    console.log("Initializing Resend...");
    const resend = new Resend(apiKey);

    // Handle confirmation email type
    if (requestBody.type === 'confirmation' && requestBody.email) {
      console.log("Processing confirmation email for:", requestBody.email);
      return await handleConfirmationEmail(requestBody, resend);
    }

    // Default response for unhandled request types
    return new Response(JSON.stringify({
      success: false,
      error: "Invalid request type or missing required fields",
      code: "INVALID_REQUEST"
    }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("=== ERROR in send-email function ===");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Full error object:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Unknown error occurred",
        code: "FUNCTION_ERROR",
        stack: error.stack
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
    
    // Generate a proper confirmation URL
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
    console.log("Email template rendered successfully");

    // Send confirmation email
    console.log("Calling Resend API...");
    const emailResponse = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [payload.email!],
      subject: "Welcome to ResumeAI - Confirm your account",
      html: emailHtml,
    });
    
    console.log("=== RESEND API RESPONSE ===");
    console.log("Response:", JSON.stringify(emailResponse, null, 2));

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
      emailId: emailResponse.data?.id
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("=== CONFIRMATION EMAIL ERROR ===");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Full error object:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Unknown error in confirmation email",
        code: "CONFIRMATION_ERROR",
        stack: error.stack
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
