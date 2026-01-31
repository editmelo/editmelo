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

const IntakeServices = ({ formData, updateFormData }: Props) => {
  const addService = () => {
    updateFormData({
      services: [
        ...formData.services,
        { name: "", description: "", target_audience: "", outcome: "", price: "" },
      ],
    });
  };

  const removeService = (index: number) => {
    const updated = formData.services.filter((_, i) => i !== index);
    updateFormData({ services: updated });
  };

  const updateService = (index: number, field: string, value: string) => {
    const updated = formData.services.map((service, i) =>
      i === index ? { ...service, [field]: value } : service
    );
    updateFormData({ services: updated });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-heading text-primary">Services / Offerings</h2>
        <p className="text-muted-foreground">
          Tell us about the services or products you offer. This helps us create compelling service descriptions for your website.
        </p>
      </div>

      <div className="space-y-4">
        {formData.services.map((service, index) => (
          <Card key={index}>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Service {index + 1}
                </span>
                {formData.services.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeService(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`service-name-${index}`}>Service Name</Label>
                <Input
                  id={`service-name-${index}`}
                  value={service.name}
                  onChange={(e) => updateService(index, "name", e.target.value)}
                  placeholder="e.g., Website Design Package"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`service-desc-${index}`}>Description</Label>
                <Textarea
                  id={`service-desc-${index}`}
                  value={service.description}
                  onChange={(e) => updateService(index, "description", e.target.value)}
                  placeholder="Describe what this service includes..."
                  rows={2}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor={`service-audience-${index}`}>Who is this for?</Label>
                  <Input
                    id={`service-audience-${index}`}
                    value={service.target_audience}
                    onChange={(e) => updateService(index, "target_audience", e.target.value)}
                    placeholder="e.g., Small business owners"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`service-outcome-${index}`}>Outcome / Result</Label>
                  <Input
                    id={`service-outcome-${index}`}
                    value={service.outcome}
                    onChange={(e) => updateService(index, "outcome", e.target.value)}
                    placeholder="e.g., A professional website in 7 days"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`service-price-${index}`}>Starting Price (optional)</Label>
                <Input
                  id={`service-price-${index}`}
                  value={service.price}
                  onChange={(e) => updateService(index, "price", e.target.value)}
                  placeholder="e.g., Starting at $500"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addService}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Another Service
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        Don't have all the details? That's okay! Add what you know and Edit Me Lo can help refine the rest.
      </p>
    </div>
  );
};

export default IntakeServices;
