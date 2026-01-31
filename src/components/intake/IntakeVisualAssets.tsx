import { IntakeFormData } from "@/pages/ClientIntake";
import FileUpload from "@/components/intake/FileUpload";
import { ImageIcon, FileText } from "lucide-react";

interface Props {
  formData: IntakeFormData;
  updateFormData: (updates: Partial<IntakeFormData>) => void;
}

const IntakeVisualAssets = ({ formData, updateFormData }: Props) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-heading text-primary">Visual Assets</h2>
        <p className="text-muted-foreground">
          Upload any images, brand guides, or documents that will help us design your website. All uploads are optional.
        </p>
      </div>

      <div className="space-y-6">
        {/* Info cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              <span className="font-medium">Images</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Photos, team headshots, product images, or any visuals you'd like on your website.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-medium">Documents</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Brand guides, style guides, content docs, or any other reference materials.
            </p>
          </div>
        </div>

        {/* File upload */}
        <FileUpload
          label="Upload Your Assets"
          description="Drag and drop files here, or click to browse. Supports images, PDFs, and documents."
          files={formData.brand_assets}
          onFilesChange={(files) => updateFormData({ brand_assets: files })}
          folder="assets"
          maxFiles={20}
        />

        <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Tips for uploading:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>High-resolution images work best (at least 1000px wide)</li>
            <li>Include your brand guide or style guide if you have one</li>
            <li>Any written content or copy you'd like on the website</li>
            <li>Competitor screenshots or inspiration images are helpful too</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IntakeVisualAssets;
