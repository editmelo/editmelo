import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Globe, X, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Lead,
  scrapeCompanyWebsite,
  researchLead,
  extractDomainFromEmail,
} from "@/lib/api/leadResearch";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";

interface LeadResearchPanelProps {
  lead: Lead;
  onClose: () => void;
}

type ResearchStep = "idle" | "scraping" | "researching" | "complete" | "error";

export const LeadResearchPanel = ({ lead, onClose }: LeadResearchPanelProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<ResearchStep>("idle");
  const [scrapedData, setScrapedData] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const companyDomain = extractDomainFromEmail(lead.email);

  const handleResearch = async () => {
    setStep("scraping");
    setError(null);
    setScrapedData(null);
    setAnalysis(null);

    let websiteContent: string | undefined;

    // Step 1: Try to scrape company website
    if (companyDomain) {
      try {
        const scrapeResult = await scrapeCompanyWebsite(companyDomain);
        if (scrapeResult.success && scrapeResult.data?.markdown) {
          websiteContent = scrapeResult.data.markdown;
          setScrapedData(websiteContent);
          toast({
            title: "Website scraped",
            description: `Successfully retrieved content from ${companyDomain}`,
          });
        } else {
          toast({
            title: "Scraping skipped",
            description: scrapeResult.error || "Could not access company website",
            variant: "default",
          });
        }
      } catch (err) {
        console.error("Scrape error:", err);
        toast({
          title: "Scraping failed",
          description: "Will proceed with available information",
          variant: "default",
        });
      }
    }

    // Step 2: AI Research
    setStep("researching");
    try {
      const researchResult = await researchLead(lead, websiteContent);
      if (researchResult.success && researchResult.analysis) {
        setAnalysis(researchResult.analysis);
        setStep("complete");
        toast({
          title: "Research complete",
          description: `Analysis ready for ${lead.company_name}`,
        });
      } else {
        throw new Error(researchResult.error || "Research failed");
      }
    } catch (err) {
      console.error("Research error:", err);
      const errorMsg = err instanceof Error ? err.message : "Research failed";
      setError(errorMsg);
      setStep("error");
      toast({
        title: "Research failed",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-heading flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Lead Research
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              AI-powered insights for {lead.company_name}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Lead Info Summary */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{lead.name}</Badge>
            <Badge variant="secondary">{lead.company_name}</Badge>
            {companyDomain && (
              <Badge variant="outline" className="gap-1">
                <Globe className="h-3 w-3" />
                {companyDomain}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {lead.company_description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {step === "idle" && (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              {companyDomain
                ? `We'll scrape ${companyDomain} and analyze the company for sales insights.`
                : "No company domain found. We'll analyze based on the provided description."}
            </p>
            <Button onClick={handleResearch} className="gap-2">
              <Search className="h-4 w-4" />
              Start Research
            </Button>
          </div>
        )}

        {(step === "scraping" || step === "researching") && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="font-medium">
              {step === "scraping" ? "Scraping company website..." : "Analyzing lead data..."}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {step === "scraping"
                ? "Extracting content from company website"
                : "Generating actionable insights with AI"}
            </p>
          </div>
        )}

        {step === "error" && (
          <div className="text-center py-6">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
            <p className="text-destructive font-medium">{error}</p>
            <Button onClick={handleResearch} variant="outline" className="mt-4">
              Try Again
            </Button>
          </div>
        )}

        {step === "complete" && analysis && (
          <div className="space-y-4">
            {scrapedData && (
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Globe className="h-3 w-3" />
                Research includes scraped website content from {companyDomain}
              </div>
            )}

            <ScrollArea className="h-[400px] pr-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </div>
            </ScrollArea>

            <div className="flex gap-2 pt-2 border-t">
              <Button onClick={handleResearch} variant="outline" size="sm" className="gap-1">
                <Search className="h-3 w-3" />
                Re-research
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
