import { IntakeFormData } from "@/pages/ClientIntake";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  formData: IntakeFormData;
  updateFormData: (updates: Partial<IntakeFormData>) => void;
}

const PERSONALITY_EXAMPLES = [
  "Bold & Confident",
  "Clean & Minimal",
  "Luxury & Elegant",
  "Friendly & Approachable",
  "Modern & Tech-Forward",
  "Classic & Professional",
  "Creative & Playful",
  "Warm & Inviting",
];

const IntakeBrandIdentity = ({ formData, updateFormData }: Props) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-heading text-primary">Brand Identity</h2>
        <p className="text-muted-foreground">Share your existing brand assets and style preferences. All fields are optional if you don't have these yet.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="brand_colors">Brand Colors</Label>
          <Input
            id="brand_colors"
            value={formData.brand_colors}
            onChange={(e) => updateFormData({ brand_colors: e.target.value })}
            placeholder="e.g., Navy blue (#0A2540), Light gray (#F5F5F5)"
          />
          <p className="text-xs text-muted-foreground">
            List your brand colors with hex codes if known, or describe them (e.g., "dark blue and gold")
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand_fonts">Brand Fonts</Label>
          <Input
            id="brand_fonts"
            value={formData.brand_fonts}
            onChange={(e) => updateFormData({ brand_fonts: e.target.value })}
            placeholder="e.g., Montserrat for headings, Open Sans for body"
          />
          <p className="text-xs text-muted-foreground">
            List any specific fonts you use or would like to use
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand_personality">Brand Personality</Label>
          <Textarea
            id="brand_personality"
            value={formData.brand_personality}
            onChange={(e) => updateFormData({ brand_personality: e.target.value })}
            placeholder="Describe the personality and feel you want your website to convey..."
            rows={3}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {PERSONALITY_EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => {
                  const current = formData.brand_personality;
                  const newValue = current ? `${current}, ${example}` : example;
                  updateFormData({ brand_personality: newValue });
                }}
                className="px-3 py-1 text-xs rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="inspiration_websites">Websites You Like</Label>
          <Textarea
            id="inspiration_websites"
            value={formData.inspiration_websites}
            onChange={(e) => updateFormData({ inspiration_websites: e.target.value })}
            placeholder="List website URLs you admire and what you like about them...&#10;&#10;Example:&#10;www.example.com - I love the clean layout and bold typography&#10;www.another.com - The color scheme is exactly what I'm looking for"
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            Include URLs and notes about what specifically you like about each site
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntakeBrandIdentity;
