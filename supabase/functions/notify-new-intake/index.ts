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

    // Build pages list
    const pagesHtml = data.desired_pages
      .filter(p => p.name)
      .map(p => `
        <li style="margin-bottom: 8px;">
          <strong>${p.name}</strong>
          ${p.purpose ? `<br/><span style="color: #6b7280;">Purpose: ${p.purpose}</span>` : ""}
          ${p.notes ? `<br/><span style="color: #6b7280;">Notes: ${p.notes}</span>` : ""}
        </li>
      `).join("");

    // Build services list
    const servicesHtml = data.services
      .filter(s => s.name)
      .map(s => `
        <li style="margin-bottom: 8px;">
          <strong>${s.name}</strong>
          ${s.description ? `<br/><span style="color: #6b7280;">${s.description}</span>` : ""}
          ${s.target_audience ? `<br/><span style="color: #6b7280;">Audience: ${s.target_audience}</span>` : ""}
          ${s.outcome ? `<br/><span style="color: #6b7280;">Outcome: ${s.outcome}</span>` : ""}
          ${s.price ? `<br/><span style="color: #6b7280;">Price: ${s.price}</span>` : ""}
        </li>
      `).join("");

    // Build files list
    const logoFilesHtml = data.logo_files.length > 0 
      ? data.logo_files.map(f => `<li><a href="${f.url}" style="color: #2563eb;">${f.name}</a></li>`).join("")
      : "<li style='color: #6b7280;'>None uploaded</li>";

    const brandAssetsHtml = data.brand_assets.length > 0
      ? data.brand_assets.map(f => `<li><a href="${f.url}" style="color: #2563eb;">${f.name}</a></li>`).join("")
      : "<li style='color: #6b7280;'>None uploaded</li>";

    const emailResponse = await resend.emails.send({
      from: "Client Intake <onboarding@resend.dev>",
      to: [notificationEmail],
      subject: `📋 New Client Intake: ${data.business_name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a; border-bottom: 2px solid #f97316; padding-bottom: 10px;">New Client Intake Submitted!</h1>
          
          <!-- Contact Info -->
          <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #374151; margin-top: 0;">Contact Information</h2>
            <p style="margin: 8px 0;"><strong>Name:</strong> ${data.contact_name}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${data.contact_email}">${data.contact_email}</a></p>
            <p style="margin: 8px 0;"><strong>Phone:</strong> ${data.contact_phone || "Not provided"}</p>
          </div>
          
          <!-- Business Info -->
          <div style="background: #fff7ed; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #f97316;">
            <h2 style="color: #374151; margin-top: 0;">Business Information</h2>
            <p style="margin: 8px 0;"><strong>Business Name:</strong> ${data.business_name}</p>
            <p style="margin: 8px 0;"><strong>Industry:</strong> ${data.industry}</p>
            <p style="margin: 8px 0;"><strong>Location:</strong> ${data.location}</p>
            <p style="margin: 8px 0;"><strong>Description:</strong></p>
            <p style="margin: 8px 0; color: #4b5563;">${data.business_description}</p>
          </div>
          
          <!-- Website Goals -->
          <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #22c55e;">
            <h2 style="color: #374151; margin-top: 0;">Website Goals</h2>
            <p style="margin: 8px 0;"><strong>Primary Goal:</strong> ${data.website_goal}</p>
            <p style="margin: 8px 0;"><strong>Desired Action:</strong> ${data.desired_action}</p>
            ${data.success_definition ? `<p style="margin: 8px 0;"><strong>Success Definition:</strong> ${data.success_definition}</p>` : ""}
            ${data.current_challenges ? `<p style="margin: 8px 0;"><strong>Current Challenges:</strong> ${data.current_challenges}</p>` : ""}
            ${data.competitors ? `<p style="margin: 8px 0;"><strong>Competitors:</strong> ${data.competitors}</p>` : ""}
            ${data.avoid_or_include ? `<p style="margin: 8px 0;"><strong>Avoid/Include:</strong> ${data.avoid_or_include}</p>` : ""}
          </div>
          
          <!-- Brand Identity -->
          <div style="background: #faf5ff; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #a855f7;">
            <h2 style="color: #374151; margin-top: 0;">Brand Identity</h2>
            <p style="margin: 8px 0;"><strong>Colors:</strong> ${data.brand_colors || "Not specified"}</p>
            <p style="margin: 8px 0;"><strong>Fonts:</strong> ${data.brand_fonts || "Not specified"}</p>
            <p style="margin: 8px 0;"><strong>Personality:</strong> ${data.brand_personality || "Not specified"}</p>
            <p style="margin: 8px 0;"><strong>Inspiration Sites:</strong> ${data.inspiration_websites || "Not specified"}</p>
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
