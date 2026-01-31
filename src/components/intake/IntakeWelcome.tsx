import { IntakeFormData } from "@/pages/ClientIntake";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Props {
  formData: IntakeFormData;
  updateFormData: (updates: Partial<IntakeFormData>) => void;
}

const IntakeWelcome = ({ formData, updateFormData }: Props) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4 pb-6 border-b border-border">
        <h2 className="text-2xl md:text-3xl font-heading text-primary">
          Welcome to Your Website Intake
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Thank you for choosing Edit Me Lo for your website project! This intake form helps us design a website that perfectly aligns with your brand and business goals.
        </p>
        <p className="text-sm text-muted-foreground">
          This should take about <strong>15–30 minutes</strong> to complete. Your responses will be used directly in building your website.
        </p>
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="font-heading text-lg">Let's start with your contact info</h3>
        
        <div className="space-y-2">
          <Label htmlFor="contact_name">Your Name *</Label>
          <Input
            id="contact_name"
            value={formData.contact_name}
            onChange={(e) => updateFormData({ contact_name: e.target.value })}
            placeholder="e.g., Lauren Smith"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_email">Email Address *</Label>
          <Input
            id="contact_email"
            type="email"
            value={formData.contact_email}
            onChange={(e) => updateFormData({ contact_email: e.target.value })}
            placeholder="e.g., lauren@company.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_phone">Phone Number (optional)</Label>
          <Input
            id="contact_phone"
            type="tel"
            value={formData.contact_phone}
            onChange={(e) => updateFormData({ contact_phone: e.target.value })}
            placeholder="e.g., (317) 555-0123"
          />
        </div>
      </div>
    </div>
  );
};

export default IntakeWelcome;
