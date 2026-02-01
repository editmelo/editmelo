import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

interface IntakeNotificationRequest {
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  business_name: string;
  industry: string;
  location: string;
  business_description: string;
  website_goal: string;
  desired_action: string;
  brand_colors: string | null;
  brand_fonts: string | null;
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

// HTML escape function to prevent injection attacks
function escapeHtml(unsafe: string | null | undefined): string {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Escape URL for use in href attributes
function escapeUrl(url: string): string {
  try {
    // Validate URL structure
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "#";
    }
    return encodeURI(url);
  } catch {
    return "#";
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: IntakeNotificationRequest = await req.json();

    if (!data.contact_name || !data.contact_email || !data.business_name) {
      console.error("Missing required fields:", { contact_name: data.contact_name, contact_email: data.contact_email, business_name: data.business_name });
      throw new Error("Missing required fields");
    }

    console.log("Sending intake notification email for:", { business_name: data.business_name, contact_name: data.contact_name });

    const notificationEmail = "lauren@editmelo.com";

    // Escape all user-provided content
    const safeContactName = escapeHtml(data.contact_name);
    const safeContactEmail = escapeHtml(data.contact_email);
    const safeContactPhone = escapeHtml(data.contact_phone) || "Not provided";
    const safeBusinessName = escapeHtml(data.business_name);
    const safeIndustry = escapeHtml(data.industry);
    const safeLocation = escapeHtml(data.location);
    const safeBusinessDescription = escapeHtml(data.business_description);
    const safeWebsiteGoal = escapeHtml(data.website_goal);
    const safeDesiredAction = escapeHtml(data.desired_action);
    const safeBrandColors = escapeHtml(data.brand_colors) || "Not specified";
    const safeBrandFonts = escapeHtml(data.brand_fonts) || "Not specified";
    const safeBrandPersonality = escapeHtml(data.brand_personality) || "Not specified";
    const safeInspirationWebsites = escapeHtml(data.inspiration_websites) || "Not specified";
    const safeSuccessDefinition = escapeHtml(data.success_definition);
    const safeCurrentChallenges = escapeHtml(data.current_challenges);
    const safeCompetitors = escapeHtml(data.competitors);
    const safeAvoidOrInclude = escapeHtml(data.avoid_or_include);

    // Build pages list with escaped content
    const pagesHtml = data.desired_pages
      .filter(p => p.name)
      .map(p => `
        <li style="margin-bottom: 8px;">
          <strong>${escapeHtml(p.name)}</strong>
          ${p.purpose ? `<br/><span style="color: #6b7280;">Purpose: ${escapeHtml(p.purpose)}</span>` : ""}
          ${p.notes ? `<br/><span style="color: #6b7280;">Notes: ${escapeHtml(p.notes)}</span>` : ""}
        </li>
      `).join("");

    // Build services list with escaped content
    const servicesHtml = data.services
      .filter(s => s.name)
      .map(s => `
        <li style="margin-bottom: 8px;">
          <strong>${escapeHtml(s.name)}</strong>
          ${s.description ? `<br/><span style="color: #6b7280;">${escapeHtml(s.description)}</span>` : ""}
          ${s.target_audience ? `<br/><span style="color: #6b7280;">Audience: ${escapeHtml(s.target_audience)}</span>` : ""}
          ${s.outcome ? `<br/><span style="color: #6b7280;">Outcome: ${escapeHtml(s.outcome)}</span>` : ""}
          ${s.price ? `<br/><span style="color: #6b7280;">Price: ${escapeHtml(s.price)}</span>` : ""}
        </li>
      `).join("");

    // Build files list with escaped content and validated URLs
    const logoFilesHtml = data.logo_files.length > 0 
      ? data.logo_files.map(f => `<li><a href="${escapeUrl(f.url)}" style="color: #2563eb;">${escapeHtml(f.name)}</a></li>`).join("")
      : "<li style='color: #6b7280;'>None uploaded</li>";

    const brandAssetsHtml = data.brand_assets.length > 0
      ? data.brand_assets.map(f => `<li><a href="${escapeUrl(f.url)}" style="color: #2563eb;">${escapeHtml(f.name)}</a></li>`).join("")
      : "<li style='color: #6b7280;'>None uploaded</li>";

    const emailResponse = await resend.emails.send({
      from: "Client Intake <onboarding@resend.dev>",
      to: [notificationEmail],
      subject: `📋 New Client Intake: ${safeBusinessName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a; border-bottom: 2px solid #f97316; padding-bottom: 10px;">New Client Intake Submitted!</h1>
          
          <!-- Contact Info -->
          <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #374151; margin-top: 0;">Contact Information</h2>
            <p style="margin: 8px 0;"><strong>Name:</strong> ${safeContactName}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${safeContactEmail}">${safeContactEmail}</a></p>
            <p style="margin: 8px 0;"><strong>Phone:</strong> ${safeContactPhone}</p>
          </div>
          
          <!-- Business Info -->
          <div style="background: #fff7ed; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #f97316;">
            <h2 style="color: #374151; margin-top: 0;">Business Information</h2>
            <p style="margin: 8px 0;"><strong>Business Name:</strong> ${safeBusinessName}</p>
            <p style="margin: 8px 0;"><strong>Industry:</strong> ${safeIndustry}</p>
            <p style="margin: 8px 0;"><strong>Location:</strong> ${safeLocation}</p>
            <p style="margin: 8px 0;"><strong>Description:</strong></p>
            <p style="margin: 8px 0; color: #4b5563;">${safeBusinessDescription}</p>
          </div>
          
          <!-- Website Goals -->
          <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #22c55e;">
            <h2 style="color: #374151; margin-top: 0;">Website Goals</h2>
            <p style="margin: 8px 0;"><strong>Primary Goal:</strong> ${safeWebsiteGoal}</p>
            <p style="margin: 8px 0;"><strong>Desired Action:</strong> ${safeDesiredAction}</p>
            ${safeSuccessDefinition ? `<p style="margin: 8px 0;"><strong>Success Definition:</strong> ${safeSuccessDefinition}</p>` : ""}
            ${safeCurrentChallenges ? `<p style="margin: 8px 0;"><strong>Current Challenges:</strong> ${safeCurrentChallenges}</p>` : ""}
            ${safeCompetitors ? `<p style="margin: 8px 0;"><strong>Competitors:</strong> ${safeCompetitors}</p>` : ""}
            ${safeAvoidOrInclude ? `<p style="margin: 8px 0;"><strong>Avoid/Include:</strong> ${safeAvoidOrInclude}</p>` : ""}
          </div>
          
          <!-- Brand Identity -->
          <div style="background: #faf5ff; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #a855f7;">
            <h2 style="color: #374151; margin-top: 0;">Brand Identity</h2>
            <p style="margin: 8px 0;"><strong>Colors:</strong> ${safeBrandColors}</p>
            <p style="margin: 8px 0;"><strong>Fonts:</strong> ${safeBrandFonts}</p>
            <p style="margin: 8px 0;"><strong>Personality:</strong> ${safeBrandPersonality}</p>
            <p style="margin: 8px 0;"><strong>Inspiration Sites:</strong> ${safeInspirationWebsites}</p>
            <p style="margin: 8px 0;"><strong>Logo Files:</strong></p>
            <ul style="margin: 8px 0; padding-left: 20px;">${logoFilesHtml}</ul>
          </div>
          
          <!-- Website Pages -->
          <div style="background: #eff6ff; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <h2 style="color: #374151; margin-top: 0;">Desired Pages</h2>
            <ul style="margin: 8px 0; padding-left: 20px;">${pagesHtml || "<li>None specified</li>"}</ul>
          </div>
          
          <!-- Services -->
          ${servicesHtml ? `
          <div style="background: #fef3c7; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h2 style="color: #374151; margin-top: 0;">Services/Products</h2>
            <ul style="margin: 8px 0; padding-left: 20px;">${servicesHtml}</ul>
          </div>
          ` : ""}
          
          <!-- Visual Assets -->
          <div style="background: #fce7f3; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #ec4899;">
            <h2 style="color: #374151; margin-top: 0;">Visual Assets</h2>
            <ul style="margin: 8px 0; padding-left: 20px;">${brandAssetsHtml}</ul>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            This intake was submitted via your Client Intake Portal. Log in to the admin dashboard for full details.
          </p>
        </div>
      `,
    });

    console.log("Intake notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in notify-new-intake function:", error);
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
