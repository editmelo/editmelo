import { useState } from "react";
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

interface LeadCaptureModalProps {
  children: React.ReactNode;
  buttonVariant?: "hero" | "heroOutline" | "default" | "outline";
}

const LeadCaptureModal = ({ children, buttonVariant = "hero" }: LeadCaptureModalProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<"form" | "schedule">("form");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    companyDescription: "",
  });

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
      const { error } = await supabase.from("leads").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        company_name: formData.companyName,
        company_description: formData.companyDescription,
      });

      if (error) {
        console.error("Error saving lead:", error);
        toast({
          title: "Something went wrong",
          description: "Please try again or contact us directly.",
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

              <Button variant="hero" size="xl" className="w-full" asChild>
                <a
                  href="https://calendar.app.google/ZPDRhjEVzosBdRQQ6"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Calendar className="mr-2 w-5 h-5" />
                  Pick a Time
                </a>
              </Button>

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
