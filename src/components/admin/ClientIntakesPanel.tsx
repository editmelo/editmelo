import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Building2, Calendar, Eye, Trash2, Mail, Phone, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ClientIntake {
  id: string;
  created_at: string;
  business_name: string;
  industry: string;
  location: string;
  business_description: string;
  website_goal: string;
  desired_action: string;
  brand_colors: string | null;
  brand_fonts: string | null;
  brand_personality: string | null;
  inspiration_websites: string | null;
  desired_pages: { name: string; purpose: string; notes: string }[];
  services: { name: string; description: string; target_audience: string; outcome: string; price: string }[];
  success_definition: string | null;
  current_challenges: string | null;
  competitors: string | null;
  avoid_or_include: string | null;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  status: string;
}

const ClientIntakesPanel = () => {
  const [intakes, setIntakes] = useState<ClientIntake[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewingIntake, setViewingIntake] = useState<ClientIntake | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchIntakes();
  }, []);

  const fetchIntakes = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("client_intakes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching intakes:", error);
      toast({
        title: "Error",
        description: "Failed to load client intakes.",
        variant: "destructive",
      });
    } else {
      // Type assertion for JSONB fields
      const typedData = (data || []).map((intake) => ({
        ...intake,
        desired_pages: intake.desired_pages as ClientIntake["desired_pages"],
        services: intake.services as ClientIntake["services"],
      }));
      setIntakes(typedData);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from("client_intakes").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete intake.",
        variant: "destructive",
      });
    } else {
      setIntakes(intakes.filter((i) => i.id !== id));
      toast({
        title: "Intake deleted",
        description: "The client intake has been removed.",
      });
    }
    setDeletingId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (intakes.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No client intakes yet. They'll appear here when clients complete the intake form.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>Business</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {intakes.map((intake) => (
              <TableRow key={intake.id}>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium">{intake.contact_name}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <a href={`mailto:${intake.contact_email}`} className="hover:text-primary transition-colors">
                        {intake.contact_email}
                      </a>
                    </div>
                    {intake.contact_phone && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <a href={`tel:${intake.contact_phone}`} className="hover:text-primary transition-colors">
                          {intake.contact_phone}
                        </a>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{intake.business_name}</span>
                  </div>
                </TableCell>
                <TableCell>{intake.industry}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(intake.created_at), "MMM d, yyyy")}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={intake.status === "pending" ? "secondary" : "default"}>
                    {intake.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewingIntake(intake)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          disabled={deletingId === intake.id}
                        >
                          {deletingId === intake.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this intake?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the intake from {intake.business_name}. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(intake.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View Intake Dialog */}
      <Dialog open={!!viewingIntake} onOpenChange={() => setViewingIntake(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {viewingIntake && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-heading">{viewingIntake.business_name}</DialogTitle>
                <DialogDescription>
                  Submitted by {viewingIntake.contact_name} on {format(new Date(viewingIntake.created_at), "MMMM d, yyyy")}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Contact Info */}
                <Section title="Contact Information">
                  <Field label="Name" value={viewingIntake.contact_name} />
                  <Field label="Email" value={viewingIntake.contact_email} />
                  <Field label="Phone" value={viewingIntake.contact_phone} />
                </Section>

                {/* Business Info */}
                <Section title="Business Information">
                  <Field label="Business" value={viewingIntake.business_name} />
                  <Field label="Industry" value={viewingIntake.industry} />
                  <Field label="Location" value={viewingIntake.location} />
                  <Field label="Description" value={viewingIntake.business_description} />
                  <Field label="Website Goal" value={viewingIntake.website_goal} />
                  <Field label="Desired Action" value={viewingIntake.desired_action} />
                </Section>

                {/* Brand Identity */}
                {(viewingIntake.brand_colors || viewingIntake.brand_fonts || viewingIntake.brand_personality || viewingIntake.inspiration_websites) && (
                  <Section title="Brand Identity">
                    <Field label="Colors" value={viewingIntake.brand_colors} />
                    <Field label="Fonts" value={viewingIntake.brand_fonts} />
                    <Field label="Personality" value={viewingIntake.brand_personality} />
                    <Field label="Inspiration" value={viewingIntake.inspiration_websites} />
                  </Section>
                )}

                {/* Website Pages */}
                <Section title="Website Pages">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {viewingIntake.desired_pages.filter(p => p.name).map((page, i) => (
                      <Badge key={i} variant="secondary">{page.name}</Badge>
                    ))}
                  </div>
                  {viewingIntake.desired_pages.filter(p => p.purpose || p.notes).map((page, i) => (
                    <div key={i} className="pl-3 border-l-2 border-border mb-2">
                      <p className="font-medium">{page.name}</p>
                      {page.purpose && <p className="text-sm text-muted-foreground">Purpose: {page.purpose}</p>}
                      {page.notes && <p className="text-sm text-muted-foreground">Notes: {page.notes}</p>}
                    </div>
                  ))}
                </Section>

                {/* Services */}
                {viewingIntake.services.some(s => s.name) && (
                  <Section title="Services">
                    {viewingIntake.services.filter(s => s.name).map((service, i) => (
                      <div key={i} className="pl-3 border-l-2 border-border mb-3">
                        <p className="font-medium">{service.name}</p>
                        {service.description && <p className="text-sm text-muted-foreground">{service.description}</p>}
                        {service.target_audience && <p className="text-sm text-muted-foreground">For: {service.target_audience}</p>}
                        {service.outcome && <p className="text-sm text-muted-foreground">Outcome: {service.outcome}</p>}
                        {service.price && <p className="text-sm text-muted-foreground">Price: {service.price}</p>}
                      </div>
                    ))}
                  </Section>
                )}

                {/* Goals */}
                {(viewingIntake.success_definition || viewingIntake.current_challenges || viewingIntake.competitors || viewingIntake.avoid_or_include) && (
                  <Section title="Goals & Expectations">
                    <Field label="Success Definition" value={viewingIntake.success_definition} />
                    <Field label="Current Challenges" value={viewingIntake.current_challenges} />
                    <Field label="Competitors" value={viewingIntake.competitors} />
                    <Field label="Avoid/Include" value={viewingIntake.avoid_or_include} />
                  </Section>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <h3 className="font-heading text-lg border-b border-border pb-2">{title}</h3>
    <div className="space-y-1 text-sm">{children}</div>
  </div>
);

const Field = ({ label, value }: { label: string; value: string | null | undefined }) => {
  if (!value) return null;
  return (
    <div>
      <span className="font-medium text-muted-foreground">{label}:</span>{" "}
      <span className="text-foreground">{value}</span>
    </div>
  );
};

export default ClientIntakesPanel;
