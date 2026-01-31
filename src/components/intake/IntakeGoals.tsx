import { IntakeFormData } from "@/pages/ClientIntake";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  formData: IntakeFormData;
  updateFormData: (updates: Partial<IntakeFormData>) => void;
}

const IntakeGoals = ({ formData, updateFormData }: Props) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-heading text-primary">Goals & Expectations</h2>
        <p className="text-muted-foreground">
          Help us understand what success looks like for you and any specific preferences for your website.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="success_definition">What does a successful website look like for you?</Label>
          <Textarea
            id="success_definition"
            value={formData.success_definition}
            onChange={(e) => updateFormData({ success_definition: e.target.value })}
            placeholder="e.g., A website that brings in at least 5 new leads per month, looks professional, and is easy for me to update..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="current_challenges">
            What's your biggest challenge with your current website (or not having one)?
          </Label>
          <Textarea
            id="current_challenges"
            value={formData.current_challenges}
            onChange={(e) => updateFormData({ current_challenges: e.target.value })}
            placeholder="e.g., Our current site looks outdated, doesn't work on mobile, and doesn't convert visitors into customers..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="competitors">Competitors you admire</Label>
          <Textarea
            id="competitors"
            value={formData.competitors}
            onChange={(e) => updateFormData({ competitors: e.target.value })}
            placeholder="List any competitors or similar businesses whose websites you admire and why..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="avoid_or_include">Anything you want to avoid or definitely include?</Label>
          <Textarea
            id="avoid_or_include"
            value={formData.avoid_or_include}
            onChange={(e) => updateFormData({ avoid_or_include: e.target.value })}
            placeholder="e.g., Must include: testimonials section, booking integration&#10;Avoid: stock photos, too much text, dark color schemes"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

export default IntakeGoals;
