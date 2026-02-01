import { IntakeFormData } from "@/pages/ClientIntake";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Building2, Palette, Layout, Briefcase, Target, ImageIcon, FileImage, File } from "lucide-react";

interface Props {
  formData: IntakeFormData;
}

const Section = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-lg flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="text-sm space-y-2">{children}</CardContent>
  </Card>
);

const Field = ({ label, value }: { label: string; value: string | undefined }) => {
  if (!value) return null;
  return (
    <div>
      <span className="font-medium text-muted-foreground">{label}:</span>{" "}
      <span className="text-foreground">{value}</span>
    </div>
  );
};

const FileList = ({ files, label }: { files: { name: string; url: string; type: string }[]; label: string }) => {
  if (!files || files.length === 0) return null;
  
  const isImage = (type: string) => type.startsWith("image/");
  
  return (
    <div className="space-y-2">
      <span className="font-medium text-muted-foreground">{label}:</span>
      <div className="flex flex-wrap gap-2">
        {files.map((file, i) => (
          <a
            key={i}
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-2 py-1 rounded bg-muted/50 border border-border hover:border-primary transition-colors"
          >
            {isImage(file.type) ? (
              <img src={file.url} alt={file.name} className="h-6 w-6 rounded object-cover" />
            ) : file.type.includes("pdf") ? (
              <File className="h-4 w-4 text-destructive" />
            ) : (
              <FileImage className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-xs truncate max-w-[120px]">{file.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

// Helper to format colors array as string for display
const formatColors = (colors: { label: string; value: string }[]): string | undefined => {
  const filtered = colors.filter(c => c.value);
  if (filtered.length === 0) return undefined;
  return filtered.map(c => `${c.label}: ${c.value}`).join(", ");
};

// Helper to format fonts array as string for display
const formatFonts = (fonts: { purpose: string; name: string }[]): string | undefined => {
  const filtered = fonts.filter(f => f.name);
  if (filtered.length === 0) return undefined;
  return filtered.map(f => `${f.purpose}: ${f.name}`).join(", ");
};

const IntakeReview = ({ formData }: Props) => {
  const colorsDisplay = formatColors(formData.brand_colors);
  const fontsDisplay = formatFonts(formData.brand_fonts);
  const hasBrandIdentity = colorsDisplay || fontsDisplay || formData.brand_personality || formData.inspiration_websites || formData.logo_files.length > 0;

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4 text-center">
        <h2 className="text-2xl font-heading text-primary">Review Your Intake</h2>
        <p className="text-muted-foreground">
          Please review your information below. When you're ready, click "Submit Intake" to send it to Edit Me Lo.
        </p>
      </div>

      <div className="space-y-4">
        {/* Contact Info */}
        <Section icon={User} title="Contact Information">
          <Field label="Name" value={formData.contact_name} />
          <Field label="Email" value={formData.contact_email} />
          <Field label="Phone" value={formData.contact_phone} />
        </Section>

        {/* Business Info */}
        <Section icon={Building2} title="Business Information">
          <Field label="Business" value={formData.business_name} />
          <Field label="Industry" value={formData.industry} />
          <Field label="Location" value={formData.location} />
          <Field label="Description" value={formData.business_description} />
          <Field label="Website Goal" value={formData.website_goal} />
          <Field label="Desired Action" value={formData.desired_action} />
        </Section>

        {/* Brand Identity */}
        {hasBrandIdentity && (
          <Section icon={Palette} title="Brand Identity">
            <FileList files={formData.logo_files} label="Logo Files" />
            <Field label="Colors" value={colorsDisplay} />
            <Field label="Fonts" value={fontsDisplay} />
            <Field label="Personality" value={formData.brand_personality} />
            <Field label="Inspiration" value={formData.inspiration_websites} />
          </Section>
        )}

        {/* Website Structure */}
        <Section icon={Layout} title="Website Pages">
          <div className="flex flex-wrap gap-2">
            {formData.desired_pages.filter(p => p.name).map((page, i) => (
              <Badge key={i} variant="secondary">{page.name}</Badge>
            ))}
          </div>
          {formData.desired_pages.filter(p => p.purpose).length > 0 && (
            <div className="mt-3 space-y-2">
              {formData.desired_pages.filter(p => p.purpose || p.notes).map((page, i) => (
                <div key={i} className="pl-3 border-l-2 border-border">
                  <p className="font-medium">{page.name}</p>
                  {page.purpose && <p className="text-muted-foreground text-xs">Purpose: {page.purpose}</p>}
                  {page.notes && <p className="text-muted-foreground text-xs">Notes: {page.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Services */}
        {formData.services.some(s => s.name) && (
          <Section icon={Briefcase} title="Services">
            {formData.services.filter(s => s.name).map((service, i) => (
              <div key={i} className="pl-3 border-l-2 border-border">
                <p className="font-medium">{service.name}</p>
                {service.description && <p className="text-muted-foreground text-xs">{service.description}</p>}
                {service.target_audience && <p className="text-muted-foreground text-xs">For: {service.target_audience}</p>}
                {service.outcome && <p className="text-muted-foreground text-xs">Outcome: {service.outcome}</p>}
                {service.price && <p className="text-muted-foreground text-xs">Price: {service.price}</p>}
              </div>
            ))}
          </Section>
        )}

        {/* Visual Assets */}
        {formData.brand_assets.length > 0 && (
          <Section icon={ImageIcon} title="Visual Assets">
            <FileList files={formData.brand_assets} label="Uploaded Files" />
          </Section>
        )}

        {/* Goals */}
        {(formData.success_definition || formData.current_challenges || formData.competitors || formData.avoid_or_include) && (
          <Section icon={Target} title="Goals & Expectations">
            <Field label="Success Definition" value={formData.success_definition} />
            <Field label="Current Challenges" value={formData.current_challenges} />
            <Field label="Competitors" value={formData.competitors} />
            <Field label="Avoid/Include" value={formData.avoid_or_include} />
          </Section>
        )}
      </div>

      <div className="bg-muted/50 rounded-lg p-4 text-center text-sm text-muted-foreground">
        <p>
          By submitting this form, your information will be sent directly to Edit Me Lo. 
          The website build process will begin based on your agreed timeline.
        </p>
      </div>
    </div>
  );
};

export default IntakeReview;
