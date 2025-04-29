
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  name: string;
  email: string;
  type: "newsletter" | "partnership";
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, type }: EmailRequest = await req.json();

    let subject, html;
    
    if (type === "newsletter") {
      subject = "Confirm Your Subscription to Adapty AI Newsletter";
      html = `
        <h1>Thank you for subscribing, ${name}!</h1>
        <p>Please confirm your subscription to the Adapty AI newsletter by clicking the button below:</p>
        <a href="https://adapty.lovable.dev/confirm-subscription?email=${encodeURIComponent(email)}" style="display: inline-block; background-color: #00FFF7; color: black; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 16px;">Confirm Subscription</a>
        <p style="margin-top: 24px;">If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The Adapty AI Team</p>
      `;
    } else {
      subject = "Your Partnership Request with Adapty AI";
      html = `
        <h1>Thank you for your interest in partnering with us, ${name}!</h1>
        <p>We have received your partnership request and our team will review it shortly.</p>
        <p>We'll get back to you as soon as possible to discuss potential collaboration opportunities.</p>
        <p>Best regards,<br>The Adapty AI Team</p>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "Adapty AI <info.adaptyai@gmail.com>",
      to: [email],
      subject: subject,
      html: html,
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
    console.error("Error in send-confirmation-email function:", error);
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
