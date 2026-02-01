import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, ArrowLeft, ArrowRight, Lock, Eye, EyeOff } from "lucide-react";
import logo from "@/assets/logo.png";

// Password verification is handled server-side via edge function

// Step components
import IntakeWelcome from "@/components/intake/IntakeWelcome";
import IntakeBusinessInfo from "@/components/intake/IntakeBusinessInfo";
import IntakeBrandIdentity from "@/components/intake/IntakeBrandIdentity";
import IntakeWebsiteStructure from "@/components/intake/IntakeWebsiteStructure";
import IntakeServices from "@/components/intake/IntakeServices";
import IntakeVisualAssets from "@/components/intake/IntakeVisualAssets";
import IntakeGoals from "@/components/intake/IntakeGoals";
import IntakeReview from "@/components/intake/IntakeReview";

export interface UploadedFile {
  name: string;
  url: string;
  type: string;
}

export interface ColorEntry {
  label: string;
  value: string;
}

export interface FontEntry {
  purpose: string;
  name: string;
}

export interface IntakeFormData {
  // Contact info
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  
  // Business Information
  business_name: string;
  industry: string;
  location: string;
  business_description: string;
  website_goal: string;
  desired_action: string;
  
  // Brand Identity
  brand_colors: ColorEntry[];
  brand_fonts: FontEntry[];
  brand_personality: string;
  inspiration_websites: string;
  logo_files: UploadedFile[];
  
  // Website Structure
  desired_pages: { name: string; purpose: string; notes: string }[];
  
  // Services
  services: { name: string; description: string; target_audience: string; outcome: string; price: string }[];
  
  // Visual Assets
  brand_assets: UploadedFile[];
  
  // Goals & Expectations
  success_definition: string;
  current_challenges: string;
  competitors: string;
  avoid_or_include: string;
}

const INITIAL_FORM_DATA: IntakeFormData = {
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  business_name: "",
  industry: "",
  location: "",
  business_description: "",
  website_goal: "",
  desired_action: "",
  brand_colors: [],
  brand_fonts: [],
  brand_personality: "",
  inspiration_websites: "",
  logo_files: [],
  desired_pages: [{ name: "Home", purpose: "", notes: "" }],
  services: [{ name: "", description: "", target_audience: "", outcome: "", price: "" }],
  brand_assets: [],
  success_definition: "",
  current_challenges: "",
  competitors: "",
  avoid_or_include: "",
};

const STEPS = [
  { id: "welcome", label: "Welcome" },
  { id: "business", label: "Business Info" },
  { id: "brand", label: "Brand Identity" },
  { id: "structure", label: "Website Pages" },
  { id: "services", label: "Services" },
  { id: "assets", label: "Visual Assets" },
  { id: "goals", label: "Goals" },
  { id: "review", label: "Review" },
];

const ClientIntake = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<IntakeFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setPasswordError("");

    try {
      const { data, error } = await supabase.functions.invoke("verify-intake-password", {
        body: { password },
      });

      if (error) {
        console.error("Password verification error:", error);
        setPasswordError("Unable to verify password. Please try again.");
        return;
      }

      if (data?.success) {
        setIsAuthenticated(true);
        setPasswordError("");
      } else {
        setPasswordError(data?.error || "Incorrect password. Please try again.");
      }
    } catch (err) {
      console.error("Password verification failed:", err);
      setPasswordError("Unable to verify password. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const updateFormData = (updates: Partial<IntakeFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Submit via edge function (bypasses RLS)
      const { data, error } = await supabase.functions.invoke("submit-intake", {
        body: {
          contact_name: formData.contact_name,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone || null,
          business_name: formData.business_name,
          industry: formData.industry,
          location: formData.location,
          business_description: formData.business_description,
          website_goal: formData.website_goal,
          desired_action: formData.desired_action,
          brand_colors: formData.brand_colors,
          brand_fonts: formData.brand_fonts,
          brand_personality: formData.brand_personality || null,
          inspiration_websites: formData.inspiration_websites || null,
          desired_pages: formData.desired_pages,
          services: formData.services,
          logo_files: formData.logo_files,
          brand_assets: formData.brand_assets,
          success_definition: formData.success_definition || null,
          current_challenges: formData.current_challenges || null,
          competitors: formData.competitors || null,
          avoid_or_include: formData.avoid_or_include || null,
        },
      });

      if (error) throw error;

      // Send notification email (non-blocking)
      supabase.functions.invoke("notify-new-intake", {
        body: {
          ...formData,
          // Convert arrays to strings for email
          brand_colors: formData.brand_colors
            .filter((c) => c.value)
            .map((c) => `${c.label}: ${c.value}`)
            .join("; "),
          brand_fonts: formData.brand_fonts
            .filter((f) => f.name)
            .map((f) => `${f.purpose}: ${f.name}`)
            .join("; "),
        },
      }).then(({ error: emailError }) => {
        if (emailError) {
          console.error("Failed to send notification email:", emailError);
        } else {
          console.log("Intake notification email sent");
        }
      });

      setIsComplete(true);
      toast({
        title: "Intake submitted!",
        description: "Thank you! Edit Me Lo will review your information and be in touch soon.",
      });
    } catch (error) {
      console.error("Error submitting intake:", error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your intake. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <img src={logo} alt="Edit Me Lo" className="h-12 mx-auto" />
            </div>
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-heading">Client Intake Portal</CardTitle>
            <CardDescription className="text-base">
              Enter the password provided by Edit Me Lo to access your intake form.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                    }}
                    className={`pr-10 ${passwordError ? "border-destructive" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-sm text-destructive">{passwordError}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isVerifying}>
                {isVerifying ? "Verifying..." : "Access Intake Form"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
        <Card className="max-w-lg w-full text-center">
          <CardHeader>
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-primary" />
            </div>
            <CardTitle className="text-2xl font-heading">You're All Set!</CardTitle>
            <CardDescription className="text-base">
              Thank you for completing your website intake form. Edit Me Lo will review your submission and begin working on your website based on the agreed timeline.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Any follow-up communication will come directly from Edit Me Lo. If you have questions in the meantime, feel free to reach out.
            </p>
            <Button onClick={() => window.location.href = "/"} variant="outline">
              Return to Website
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderStep = () => {
    switch (STEPS[currentStep].id) {
      case "welcome":
        return <IntakeWelcome formData={formData} updateFormData={updateFormData} />;
      case "business":
        return <IntakeBusinessInfo formData={formData} updateFormData={updateFormData} />;
      case "brand":
        return <IntakeBrandIdentity formData={formData} updateFormData={updateFormData} />;
      case "structure":
        return <IntakeWebsiteStructure formData={formData} updateFormData={updateFormData} />;
      case "services":
        return <IntakeServices formData={formData} updateFormData={updateFormData} />;
      case "assets":
        return <IntakeVisualAssets formData={formData} updateFormData={updateFormData} />;
      case "goals":
        return <IntakeGoals formData={formData} updateFormData={updateFormData} />;
      case "review":
        return <IntakeReview formData={formData} />;
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (STEPS[currentStep].id) {
      case "welcome":
        return formData.contact_name && formData.contact_email;
      case "business":
        return formData.business_name && formData.industry && formData.location && formData.business_description && formData.website_goal && formData.desired_action;
      case "brand":
        return true; // Optional section
      case "structure":
        return formData.desired_pages.length > 0 && formData.desired_pages[0].name;
      case "services":
        return true; // Optional section
      case "assets":
        return true; // Optional section
      case "goals":
        return true; // Optional section
      case "review":
        return true;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <a href="/">
            <img src={logo} alt="Edit Me Lo" className="h-10" />
          </a>
          <span className="text-sm text-muted-foreground font-medium">
            Client Intake Portal
          </span>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-background border-b border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].label}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-8 max-w-3xl">
        <Card>
          <CardContent className="pt-6">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentStep === STEPS.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !canProceed()}
              className="bg-primary"
            >
              {isSubmitting ? "Submitting..." : "Submit Intake"}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default ClientIntake;
