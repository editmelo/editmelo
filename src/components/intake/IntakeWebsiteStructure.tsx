import { IntakeFormData } from "@/pages/ClientIntake";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  formData: IntakeFormData;
  updateFormData: (updates: Partial<IntakeFormData>) => void;
}

const COMMON_PAGES = ["Home", "About", "Services", "Contact", "Portfolio", "Testimonials", "FAQ", "Pricing", "Blog"];

const IntakeWebsiteStructure = ({ formData, updateFormData }: Props) => {
  const addPage = (pageName?: string) => {
    updateFormData({
      desired_pages: [
        ...formData.desired_pages,
        { name: pageName || "", purpose: "", notes: "" },
      ],
    });
  };

  const removePage = (index: number) => {
    const updated = formData.desired_pages.filter((_, i) => i !== index);
    updateFormData({ desired_pages: updated });
  };

  const updatePage = (index: number, field: string, value: string) => {
    const updated = formData.desired_pages.map((page, i) =>
      i === index ? { ...page, [field]: value } : page
    );
    updateFormData({ desired_pages: updated });
  };

  const existingPageNames = formData.desired_pages.map((p) => p.name.toLowerCase());

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-heading text-primary">Website Structure</h2>
        <p className="text-muted-foreground">Tell us which pages you need and what each page should communicate.</p>
      </div>

      {/* Quick add common pages */}
      <div className="space-y-2">
        <Label>Quick Add Common Pages</Label>
        <div className="flex flex-wrap gap-2">
          {COMMON_PAGES.filter((p) => !existingPageNames.includes(p.toLowerCase())).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => addPage(page)}
              className="px-3 py-1 text-sm rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
            >
              + {page}
            </button>
          ))}
        </div>
      </div>

      {/* Page list */}
      <div className="space-y-4">
        {formData.desired_pages.map((page, index) => (
          <Card key={index}>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`page-name-${index}`}>Page Name *</Label>
                  <Input
                    id={`page-name-${index}`}
                    value={page.name}
                    onChange={(e) => updatePage(index, "name", e.target.value)}
                    placeholder="e.g., About Us"
                  />
                </div>
                {formData.desired_pages.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 text-destructive hover:text-destructive"
                    onClick={() => removePage(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`page-purpose-${index}`}>Purpose of this page</Label>
                <Input
                  id={`page-purpose-${index}`}
                  value={page.purpose}
                  onChange={(e) => updatePage(index, "purpose", e.target.value)}
                  placeholder="e.g., Introduce our team and company history"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`page-notes-${index}`}>Content notes or key messages</Label>
                <Textarea
                  id={`page-notes-${index}`}
                  value={page.notes}
                  onChange={(e) => updatePage(index, "notes", e.target.value)}
                  placeholder="Any bullet points, copy ideas, or key information this page should include..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={() => addPage()}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Another Page
      </Button>
    </div>
  );
};

export default IntakeWebsiteStructure;
