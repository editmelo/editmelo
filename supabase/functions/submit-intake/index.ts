import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface UploadedFile {
  name: string;
  url: string;
  type: string;
}

interface ColorEntry {
  label: string;
  value: string;
}

interface FontEntry {
  purpose: string;
  name: string;
}

interface IntakeData {
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  business_name: string;
  industry: string;
  location: string;
  business_description: string;
  website_goal: string;
  desired_action: string;
  brand_colors: ColorEntry[] | string | null;
  brand_fonts: FontEntry[] | string | null;
  brand_personality: string | null;
  inspiration_websites: string | null;
  logo_files: UploadedFile[];
  desired_pages: { name: string; purpose: string; notes: string }[];
  services: { name: string; description: string; target_audience: string; outcome: string; price: string }[];
  brand_assets: UploadedFile[];
  success_definition: string | null;
  current_challenges: string | null;
  competitors: string | null;
  avoid_or_include: string | null;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: IntakeData = await req.json();
    console.log("Received intake submission for:", data.business_name);

    // Validate required fields
    if (!data.contact_name || !data.contact_email || !data.business_name) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Server-side length validation
    if (data.contact_name.length > 100) {
      return new Response(
        JSON.stringify({ error: "Contact name is too long (max 100 characters)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (data.contact_email.length > 255) {
      return new Response(
        JSON.stringify({ error: "Email is too long (max 255 characters)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (data.contact_phone && data.contact_phone.length > 20) {
      return new Response(
        JSON.stringify({ error: "Phone number is too long (max 20 characters)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (data.business_name.length > 200) {
      return new Response(
        JSON.stringify({ error: "Business name is too long (max 200 characters)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (data.business_description && data.business_description.length > 2000) {
      return new Response(
        JSON.stringify({ error: "Business description is too long (max 2000 characters)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (data.industry && data.industry.length > 100) {
      return new Response(
        JSON.stringify({ error: "Industry is too long (max 100 characters)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (data.location && data.location.length > 200) {
      return new Response(
        JSON.stringify({ error: "Location is too long (max 200 characters)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.contact_email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase client with service role (bypasses RLS)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Format colors and fonts for storage
    // If they're arrays (new format), convert to string for backward compatibility
    let brandColorsStr: string | null = null;
    if (Array.isArray(data.brand_colors)) {
      brandColorsStr = data.brand_colors
        .filter((c: ColorEntry) => c.value)
        .map((c: ColorEntry) => `${c.label}: ${c.value}`)
        .join("; ");
    } else {
      brandColorsStr = data.brand_colors || null;
    }

    let brandFontsStr: string | null = null;
    if (Array.isArray(data.brand_fonts)) {
      brandFontsStr = data.brand_fonts
        .filter((f: FontEntry) => f.name)
        .map((f: FontEntry) => `${f.purpose}: ${f.name}`)
        .join("; ");
    } else {
      brandFontsStr = data.brand_fonts || null;
    }

    // Insert into client_intakes table
    const { data: insertedData, error: insertError } = await supabase
      .from("client_intakes")
      .insert({
        contact_name: data.contact_name,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone || null,
        business_name: data.business_name,
        industry: data.industry,
        location: data.location,
        business_description: data.business_description,
        website_goal: data.website_goal,
        desired_action: data.desired_action,
        brand_colors: brandColorsStr,
        brand_fonts: brandFontsStr,
        brand_personality: data.brand_personality || null,
        inspiration_websites: data.inspiration_websites || null,
        desired_pages: data.desired_pages,
        services: data.services,
        logo_files: data.logo_files,
        brand_assets: data.brand_assets,
        success_definition: data.success_definition || null,
        current_challenges: data.current_challenges || null,
        competitors: data.competitors || null,
        avoid_or_include: data.avoid_or_include || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting intake:", insertError);
      throw insertError;
    }

    console.log("Intake successfully inserted:", insertedData?.id);

    return new Response(
      JSON.stringify({ success: true, id: insertedData?.id }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in submit-intake function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
