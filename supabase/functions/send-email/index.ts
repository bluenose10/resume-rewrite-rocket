
import React from 'npm:react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { ConfirmationEmail } from './_templates/confirmation-email.tsx'
import { PasswordResetEmail } from './_templates/password-reset-email.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const payload = await req.text()
    const headers = Object.fromEntries(req.headers)
    
    console.log('Received email webhook payload:', payload)
    
    // If no hook secret is set, we'll process the request anyway for development
    let emailData: any
    
    if (hookSecret) {
      const wh = new Webhook(hookSecret)
      emailData = wh.verify(payload, headers)
    } else {
      emailData = JSON.parse(payload)
    }

    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type, site_url },
    } = emailData as {
      user: {
        email: string
        user_metadata?: {
          full_name?: string
        }
      }
      email_data: {
        token: string
        token_hash: string
        redirect_to: string
        email_action_type: string
        site_url: string
      }
    }

    console.log('Processing email for:', user.email, 'Type:', email_action_type)

    let html: string
    let subject: string
    const userName = user.user_metadata?.full_name || user.email.split('@')[0]

    if (email_action_type === 'signup') {
      html = await renderAsync(
        React.createElement(ConfirmationEmail, {
          userName,
          confirmationUrl: `${site_url}/auth/confirm?token_hash=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`,
        })
      )
      subject = 'Welcome to ResumeAI - Confirm your account'
    } else if (email_action_type === 'recovery') {
      html = await renderAsync(
        React.createElement(PasswordResetEmail, {
          userName,
          resetUrl: `${site_url}/auth/confirm?token_hash=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`,
        })
      )
      subject = 'Reset your ResumeAI password'
    } else {
      throw new Error(`Unsupported email action type: ${email_action_type}`)
    }

    const { data, error } = await resend.emails.send({
      from: 'ResumeAI <onboarding@resend.dev>',
      to: [user.email],
      subject,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    console.log('Email sent successfully:', data)

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in send-email function:', error)
    return new Response(
      JSON.stringify({
        error: {
          message: error.message,
        },
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
