import { supabase } from "@/integrations/supabase/client";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company_name: string;
  company_description: string;
  created_at: string;
}

export interface ScrapeResult {
  success: boolean;
  data?: {
    markdown?: string;
    links?: string[];
    metadata?: {
      title?: string;
      description?: string;
      sourceURL?: string;
    };
  };
  error?: string;
}

export interface ResearchResult {
  success: boolean;
  analysis?: string;
  error?: string;
}

export async function scrapeCompanyWebsite(url: string): Promise<ScrapeResult> {
  const { data, error } = await supabase.functions.invoke("scrape-company", {
    body: { url },
  });

  if (error) {
    console.error("Scrape error:", error);
    return { success: false, error: error.message };
  }

  return data;
}

export async function researchLead(
  lead: Lead,
  scrapedContent?: string
): Promise<ResearchResult> {
  const { data, error } = await supabase.functions.invoke("research-lead", {
    body: {
      leadData: {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company_name: lead.company_name,
        company_description: lead.company_description,
      },
      scrapedContent,
    },
  });

  if (error) {
    console.error("Research error:", error);
    return { success: false, error: error.message };
  }

  return data;
}

export function extractDomainFromEmail(email: string): string | null {
  const match = email.match(/@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (match) {
    // Skip common email providers
    const commonProviders = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "outlook.com",
      "live.com",
      "icloud.com",
      "aol.com",
      "mail.com",
    ];
    if (!commonProviders.includes(match[1].toLowerCase())) {
      return match[1];
    }
  }
  return null;
}
