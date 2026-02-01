import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface LeadNotificationRequest {
  name: string;
  email: string;
  phone: string | null;
  companyName: string;
  companyDescription: string;
}

// HTML escape function to prevent injection attacks
function escapeHtml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, companyName, companyDescription }: LeadNotificationRequest = await req.json();

    // Validate required fields
    if (!name || !email || !companyName || !companyDescription) {
      console.error("Missing required fields:", { name, email, companyName, companyDescription });
      throw new Error("Missing required fields");
    }

    console.log("Sending notification email for new lead:", { name, companyName });

    const notificationEmail = "lauren@editmelo.com";

    // Escape all user-provided content
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || "Not provided");
    const safeCompanyName = escapeHtml(companyName);
    const safeCompanyDescription = escapeHtml(companyDescription);

    const emailResponse = await resend.emails.send({
      from: "Lead Notifications <onboarding@resend.dev>",
      to: [notificationEmail],
      subject: `🎉 New Lead: ${safeCompanyName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a; border-bottom: 2px solid #f97316; padding-bottom: 10px;">New Lead Submitted!</h1>
          
          <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #374151; margin-top: 0;">Contact Information</h2>
            <p style="margin: 8px 0;"><strong>Name:</strong> ${safeName}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
            <p style="margin: 8px 0;"><strong>Phone:</strong> ${safePhone}</p>
          </div>
          
          <div style="background: #fff7ed; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #f97316;">
            <h2 style="color: #374151; margin-top: 0;">Business Details</h2>
            <p style="margin: 8px 0;"><strong>Company:</strong> ${safeCompanyName}</p>
            <p style="margin: 8px 0;"><strong>Description:</strong></p>
            <p style="margin: 8px 0; color: #4b5563;">${safeCompanyDescription}</p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            This lead was submitted via your website's lead capture form. Follow up promptly!
          </p>
        </div>
      `,
    });

    console.log("Email notification sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in notify-new-lead function:", error);
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
