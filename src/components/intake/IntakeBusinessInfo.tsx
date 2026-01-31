import { IntakeFormData } from "@/pages/ClientIntake";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  formData: IntakeFormData;
  updateFormData: (updates: Partial<IntakeFormData>) => void;
}

const WEBSITE_GOALS = [
  "Generate leads / inquiries",
  "Book appointments or consultations",
  "Sell products online",
  "Provide information about the business",
  "Build brand awareness",
  "Showcase portfolio / work",
  "Other",
];

const DESIRED_ACTIONS = [
  "Call us",
  "Fill out a contact form",
  "Book an appointment",
  "Request a quote",
  "Make a purchase",
  "Sign up for newsletter",
  "Other",
];

const IntakeBusinessInfo = ({ formData, updateFormData }: Props) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-heading text-primary">Business Information</h2>
        <p className="text-muted-foreground">Tell us about your business so we can create a website that represents you well.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="business_name">Business Name *</Label>
          <Input
            id="business_name"
            value={formData.business_name}
            onChange={(e) => updateFormData({ business_name: e.target.value })}
            placeholder="e.g., Smith & Co. Consulting"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry *</Label>
          <Input
            id="industry"
            value={formData.industry}
            onChange={(e) => updateFormData({ industry: e.target.value })}
            placeholder="e.g., Business Consulting, Real Estate, Healthcare"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location / Service Area *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => updateFormData({ location: e.target.value })}
            placeholder="e.g., Indianapolis, IN or Nationwide"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="business_description">What does your business do? *</Label>
          <Textarea
            id="business_description"
            value={formData.business_description}
            onChange={(e) => updateFormData({ business_description: e.target.value })}
            placeholder="Describe your business in a few sentences. What products or services do you offer? Who do you serve?"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label>Primary Goal of the Website *</Label>
          <Select
            value={formData.website_goal}
            onValueChange={(value) => updateFormData({ website_goal: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select the main purpose of your website" />
            </SelectTrigger>
            <SelectContent>
              {WEBSITE_GOALS.map((goal) => (
                <SelectItem key={goal} value={goal}>
                  {goal}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Desired Main Action for Visitors *</Label>
          <Select
            value={formData.desired_action}
            onValueChange={(value) => updateFormData({ desired_action: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="What action should visitors take?" />
            </SelectTrigger>
            <SelectContent>
              {DESIRED_ACTIONS.map((action) => (
                <SelectItem key={action} value={action}>
                  {action}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default IntakeBusinessInfo;
