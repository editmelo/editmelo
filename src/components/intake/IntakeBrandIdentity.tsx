import { IntakeFormData } from "@/pages/ClientIntake";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import FileUpload from "@/components/intake/FileUpload";

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

const COLOR_LABELS = [
  "Primary",
  "Secondary",
  "Accent 1",
  "Accent 2",
  "Accent 3",
  "Accent 4",
];

const FONT_PURPOSES = [
  "Headings",
  "Body Text",
  "Accent/Display",
];

const IntakeBrandIdentity = ({ formData, updateFormData }: Props) => {
  // Handle colors array
  const handleColorChange = (index: number, field: "label" | "value", newValue: string) => {
    const newColors = [...formData.brand_colors];
    newColors[index] = { ...newColors[index], [field]: newValue };
    updateFormData({ brand_colors: newColors });
  };

  const addColor = () => {
    if (formData.brand_colors.length < 6) {
      const usedLabels = formData.brand_colors.map(c => c.label);
      const nextLabel = COLOR_LABELS.find(l => !usedLabels.includes(l)) || `Color ${formData.brand_colors.length + 1}`;
      updateFormData({ 
        brand_colors: [...formData.brand_colors, { label: nextLabel, value: "" }] 
      });
    }
  };

  const removeColor = (index: number) => {
    const newColors = formData.brand_colors.filter((_, i) => i !== index);
    updateFormData({ brand_colors: newColors });
  };

  // Handle fonts array
  const handleFontChange = (index: number, field: "purpose" | "name", newValue: string) => {
    const newFonts = [...formData.brand_fonts];
    newFonts[index] = { ...newFonts[index], [field]: newValue };
    updateFormData({ brand_fonts: newFonts });
  };

  const addFont = () => {
    if (formData.brand_fonts.length < 3) {
      const usedPurposes = formData.brand_fonts.map(f => f.purpose);
      const nextPurpose = FONT_PURPOSES.find(p => !usedPurposes.includes(p)) || `Font ${formData.brand_fonts.length + 1}`;
      updateFormData({ 
        brand_fonts: [...formData.brand_fonts, { purpose: nextPurpose, name: "" }] 
      });
    }
  };

  const removeFont = (index: number) => {
    const newFonts = formData.brand_fonts.filter((_, i) => i !== index);
    updateFormData({ brand_fonts: newFonts });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-heading text-primary">Brand Identity</h2>
        <p className="text-muted-foreground">Share your existing brand assets and style preferences. All fields are optional if you don't have these yet.</p>
      </div>

      <div className="space-y-6">
        {/* Logo Upload */}
        <FileUpload
          label="Logo Files"
          description="Upload your logo files (PNG, SVG, AI, EPS, or PDF). Multiple versions are welcome."
          files={formData.logo_files}
          onFilesChange={(files) => updateFormData({ logo_files: files })}
          accept="image/*,.pdf,.ai,.eps,.svg"
          folder="logos"
          maxFiles={5}
        />

        {/* Brand Colors Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label>Brand Colors</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Add up to 6 colors with hex codes (e.g., #0A2540) or descriptions
              </p>
            </div>
            {formData.brand_colors.length < 6 && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addColor}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Color
              </Button>
            )}
          </div>
          
          <div className="space-y-2">
            {formData.brand_colors.map((color, index) => (
              <div key={index} className="flex items-center gap-2">
                <select
                  value={color.label}
                  onChange={(e) => handleColorChange(index, "label", e.target.value)}
                  className="w-32 h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  {COLOR_LABELS.map((label) => (
                    <option key={label} value={label}>{label}</option>
                  ))}
                </select>
                <Input
                  value={color.value}
                  onChange={(e) => handleColorChange(index, "value", e.target.value)}
                  placeholder="e.g., #0A2540 or Navy Blue"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeColor(index)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {formData.brand_colors.length === 0 && (
              <p className="text-sm text-muted-foreground italic py-2">
                No colors added yet. Click "Add Color" to get started.
              </p>
            )}
          </div>
        </div>

        {/* Brand Fonts Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label>Brand Fonts</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Add up to 3 fonts for different purposes
              </p>
            </div>
            {formData.brand_fonts.length < 3 && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addFont}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Font
              </Button>
            )}
          </div>
          
          <div className="space-y-2">
            {formData.brand_fonts.map((font, index) => (
              <div key={index} className="flex items-center gap-2">
                <select
                  value={font.purpose}
                  onChange={(e) => handleFontChange(index, "purpose", e.target.value)}
                  className="w-36 h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  {FONT_PURPOSES.map((purpose) => (
                    <option key={purpose} value={purpose}>{purpose}</option>
                  ))}
                </select>
                <Input
                  value={font.name}
                  onChange={(e) => handleFontChange(index, "name", e.target.value)}
                  placeholder="e.g., Montserrat, Open Sans"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFont(index)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {formData.brand_fonts.length === 0 && (
              <p className="text-sm text-muted-foreground italic py-2">
                No fonts added yet. Click "Add Font" to get started.
              </p>
            )}
          </div>
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
