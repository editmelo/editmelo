import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// In-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientIP =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";

    if (!checkRateLimit(clientIP)) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ success: false, error: "Too many attempts. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { password } = await req.json();

    if (!password || typeof password !== "string") {
      return new Response(
        JSON.stringify({ success: false, error: "Password is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const intakePassword = Deno.env.get("INTAKE_PASSWORD");
    if (!intakePassword) {
      console.error("INTAKE_PASSWORD secret not configured");
      return new Response(
        JSON.stringify({ success: false, error: "Password verification not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const isValid = password.toLowerCase().trim() === intakePassword.toLowerCase().trim();

    if (isValid) {
      console.log("Intake password verified successfully");
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      console.log(`Intake password verification failed from IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ success: false, error: "Incorrect password" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error verifying intake password:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Verification failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
