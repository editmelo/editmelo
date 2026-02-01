import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "resend";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple in-memory rate limiting (per IP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5; // Max submissions per window
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour window

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

interface LeadSubmissionRequest {
  name: string;
  email: string;
  phone: string | null;
  companyName: string;
  companyDescription: string;
  recaptchaToken: string;
  honeypot?: string; // Should be empty
}

async function verifyRecaptcha(token: string): Promise<{ success: boolean; score?: number }> {
  const secretKey = Deno.env.get("RECAPTCHA_SECRET_KEY");
  if (!secretKey) {
    console.error("RECAPTCHA_SECRET_KEY not configured");
    throw new Error("reCAPTCHA configuration error");
  }

  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `secret=${secretKey}&response=${token}`,
  });

  const data = await response.json();
  console.log("reCAPTCHA verification result:", { success: data.success, score: data.score, action: data.action });
  
  return { success: data.success, score: data.score };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     "unknown";
    
    console.log("Lead submission attempt from IP:", clientIP);

    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      console.warn("Rate limit exceeded for IP:", clientIP);
      return new Response(
        JSON.stringify({ error: "Too many submissions. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const body: LeadSubmissionRequest = await req.json();
    const { name, email, phone, companyName, companyDescription, recaptchaToken, honeypot } = body;

    // Honeypot check - if filled, it's likely a bot
    if (honeypot && honeypot.trim() !== "") {
      console.warn("Honeypot triggered - likely bot submission:", { ip: clientIP });
      // Return success to not reveal detection, but don't save
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Validate required fields
    if (!name || !email || !companyName || !companyDescription) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Server-side length validation (matches client-side maxLength constraints)
    if (name.trim().length > 100) {
      console.warn("Name exceeds max length:", { length: name.length, ip: clientIP });
      return new Response(
        JSON.stringify({ error: "Name is too long (max 100 characters)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (email.trim().length > 255) {
      console.warn("Email exceeds max length:", { length: email.length, ip: clientIP });
      return new Response(
        JSON.stringify({ error: "Email is too long (max 255 characters)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (companyName.trim().length > 200) {
      console.warn("Company name exceeds max length:", { length: companyName.length, ip: clientIP });
      return new Response(
        JSON.stringify({ error: "Company name is too long (max 200 characters)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (companyDescription.trim().length > 2000) {
      console.warn("Description exceeds max length:", { length: companyDescription.length, ip: clientIP });
      return new Response(
        JSON.stringify({ error: "Description is too long (max 2000 characters)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (phone && phone.trim().length > 20) {
      console.warn("Phone exceeds max length:", { length: phone.length, ip: clientIP });
      return new Response(
        JSON.stringify({ error: "Phone number is too long (max 20 characters)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.warn("Invalid email format for IP:", clientIP);
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Verify reCAPTCHA
    if (!recaptchaToken) {
      console.error("Missing reCAPTCHA token");
      return new Response(
        JSON.stringify({ error: "Security verification failed" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const recaptchaResult = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaResult.success) {
      console.warn("reCAPTCHA verification failed for IP:", clientIP);
      return new Response(
        JSON.stringify({ error: "Security verification failed. Please try again." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check reCAPTCHA score (v3 returns a score from 0.0 to 1.0)
    // Lower scores indicate more likely bot behavior
    if (recaptchaResult.score !== undefined && recaptchaResult.score < 0.3) {
      console.warn("Low reCAPTCHA score:", { score: recaptchaResult.score, ip: clientIP });
      return new Response(
        JSON.stringify({ error: "Security verification failed. Please try again." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert lead into database
    const { error: insertError } = await supabase.from("leads").insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      company_name: companyName.trim(),
      company_description: companyDescription.trim(),
    });

    if (insertError) {
      console.error("Error inserting lead:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to save your information. Please try again." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Lead saved successfully:", { name, companyName });

    // Send email notification (non-blocking, but don't use waitUntil for simplicity)
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      const resend = new Resend(resendKey);
      
      resend.emails.send({
        from: "Lead Notifications <onboarding@resend.dev>",
        to: ["lauren@editmelo.com"],
        subject: `🎉 New Lead: ${companyName}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #1a1a1a; border-bottom: 2px solid #f97316; padding-bottom: 10px;">New Lead Submitted!</h1>
            
            <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h2 style="color: #374151; margin-top: 0;">Contact Information</h2>
              <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p style="margin: 8px 0;"><strong>Phone:</strong> ${phone || "Not provided"}</p>
            </div>
            
            <div style="background: #fff7ed; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #f97316;">
              <h2 style="color: #374151; margin-top: 0;">Business Details</h2>
              <p style="margin: 8px 0;"><strong>Company:</strong> ${companyName}</p>
              <p style="margin: 8px 0;"><strong>Description:</strong></p>
              <p style="margin: 8px 0; color: #4b5563;">${companyDescription}</p>
            </div>
            
            <div style="background: #ecfdf5; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #047857; font-size: 14px;">
                ✅ <strong>Spam Protection:</strong> reCAPTCHA score: ${recaptchaResult.score?.toFixed(2) || 'N/A'}
              </p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              This lead was submitted via your website's lead capture form. Follow up promptly!
            </p>
          </div>
        `,
      }).then(() => {
        console.log("Email notification sent successfully");
      }).catch((err: Error) => {
        console.error("Failed to send email notification:", err);
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in submit-lead function:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
