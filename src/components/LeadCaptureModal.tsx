// Lead capture with spam protection (reCAPTCHA + honeypot + rate limiting)
import { useState, useEffect, useCallback } from "react";
import { ArrowRight, Calendar, Building2, User, Mail, Phone, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const CALENDAR_URL = "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0mBphYB-r6A5K_S3Byh9nLwf8HbYtNdEn8w8CY7BuvVLCSocln83uhulfmLSnVExjhQeeaT9bA?gv=true";

interface LeadCaptureModalProps {
  children: React.ReactNode;
  buttonVariant?: "hero" | "heroOutline" | "default" | "outline";
}

// Load reCAPTCHA script
const loadRecaptchaScript = (siteKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && (window as any).grecaptcha) {
      resolve();
      return;
    }

    if (!siteKey) {
      console.warn("reCAPTCHA site key not available");
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load reCAPTCHA"));
    document.head.appendChild(script);
  });
};

const LeadCaptureModal = ({ children, buttonVariant = "hero" }: LeadCaptureModalProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<"form" | "schedule">("form");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const [recaptchaSiteKey, setRecaptchaSiteKey] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    companyDescription: "",
    // Honeypot field - should always be empty
    website: "",
  });

  // Fetch reCAPTCHA site key when modal opens
  useEffect(() => {
    if (isOpen && !recaptchaSiteKey) {
      supabase.functions.invoke("get-recaptcha-config")
        .then(({ data, error }) => {
          if (error) {
            console.error("Failed to fetch reCAPTCHA config:", error);
            return;
          }
          if (data?.siteKey) {
            setRecaptchaSiteKey(data.siteKey);
          }
        });
    }
  }, [isOpen, recaptchaSiteKey]);

  // Load reCAPTCHA script when site key is available
  useEffect(() => {
    if (isOpen && recaptchaSiteKey && !recaptchaReady) {
      loadRecaptchaScript(recaptchaSiteKey)
        .then(() => {
          setRecaptchaReady(true);
        })
        .catch((err) => {
          console.error("Failed to load reCAPTCHA:", err);
        });
    }
  }, [isOpen, recaptchaSiteKey, recaptchaReady]);

  const getRecaptchaToken = useCallback(async (): Promise<string | null> => {
    if (!recaptchaSiteKey || !recaptchaReady) {
      console.warn("reCAPTCHA not available");
      return null;
    }

    try {
      const grecaptcha = (window as any).grecaptcha;
      if (!grecaptcha) return null;

      const token = await grecaptcha.execute(recaptchaSiteKey, { action: "submit_lead" });
      return token;
    } catch (err) {
      console.error("Failed to get reCAPTCHA token:", err);
      return null;
    }
  }, [recaptchaReady, recaptchaSiteKey]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get reCAPTCHA token
      const recaptchaToken = await getRecaptchaToken();
      
      if (!recaptchaToken && recaptchaSiteKey) {
        toast({
          title: "Security verification failed",
          description: "Please refresh the page and try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Submit through the secure edge function
      const { data, error } = await supabase.functions.invoke("submit-lead", {
        body: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || null,
          companyName: formData.companyName.trim(),
          companyDescription: formData.companyDescription.trim(),
          recaptchaToken: recaptchaToken || "",
          honeypot: formData.website, // Honeypot field
        },
      });

      if (error) {
        console.error("Error submitting lead:", error);
        toast({
          title: "Something went wrong",
          description: "Please try again or contact us directly.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      if (data?.error) {
        console.error("Submission error:", data.error);
        toast({
          title: "Submission failed",
          description: data.error,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setStep("schedule");

      toast({
        title: "Information received!",
        description: "Now let's schedule your free consultation.",
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form when closing
      setTimeout(() => {
        setStep("form");
        setFormData({
          name: "",
          email: "",
          phone: "",
          companyName: "",
          companyDescription: "",
          website: "",
        });
      }, 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        {step === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl text-foreground">
                LET'S GET STARTED
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Tell us about your business so we can prepare for your free consultation.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {/* Honeypot field - hidden from users, bots will fill it */}
              <div 
                className="absolute -left-[9999px]" 
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }}
              >
                <label htmlFor="website">Website</label>
                <Input
                  id="website"
                  name="website"
                  type="text"
                  value={formData.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  <User className="inline w-4 h-4 mr-2" />
                  Your Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Smith"
                  required
                  className="h-12"
                  maxLength={100}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  <Mail className="inline w-4 h-4 mr-2" />
                  Email Address *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@mybusiness.com"
                  required
                  className="h-12"
                  maxLength={255}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  <Phone className="inline w-4 h-4 mr-2" />
                  Phone Number
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                  className="h-12"
                  maxLength={20}
                />
              </div>

              <div>
                <label htmlFor="companyName" className="block text-sm font-medium mb-2">
                  <Building2 className="inline w-4 h-4 mr-2" />
                  Business Name *
                </label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="My Awesome Business"
                  required
                  className="h-12"
                  maxLength={200}
                />
              </div>

              <div>
                <label htmlFor="companyDescription" className="block text-sm font-medium mb-2">
                  <MessageSquare className="inline w-4 h-4 mr-2" />
                  Tell us about your business *
                </label>
                <Textarea
                  id="companyDescription"
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleChange}
                  placeholder="What does your business do? What services do you offer?"
                  required
                  rows={3}
                  maxLength={2000}
                />
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    Continue to Schedule
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>

              {recaptchaSiteKey && (
                <p className="text-xs text-muted-foreground text-center">
                  Protected by reCAPTCHA.{" "}
                  <a 
                    href="https://policies.google.com/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Privacy
                  </a>
                  {" "}&{" "}
                  <a 
                    href="https://policies.google.com/terms" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Terms
                  </a>
                </p>
              )}
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl text-foreground">
                SCHEDULE YOUR CONSULTATION
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Thanks, {formData.name.split(" ")[0]}! Pick a time that works best for you.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-4">
              <div className="bg-secondary rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-1">Your Business</p>
                <p className="font-semibold">{formData.companyName}</p>
              </div>

              <div className="w-full h-[400px] bg-background rounded-xl overflow-hidden border">
                <iframe
                  src={CALENDAR_URL}
                  style={{ border: 0 }}
                  width="100%"
                  height="100%"
                  title="Schedule a consultation"
                />
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Free 15-minute consultation • No obligation
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LeadCaptureModal;
