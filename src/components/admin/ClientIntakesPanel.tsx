import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Building2, Calendar, Eye, Trash2, Mail, Phone, FileImage, File, ExternalLink, Check, Clock, PlayCircle, Download, FileText, FileSpreadsheet, Search, ArrowUpDown, ArrowUp, ArrowDown, X } from "lucide-react";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type IntakeStatus = "pending" | "in_progress" | "completed";

const STATUS_CONFIG: Record<IntakeStatus, { label: string; variant: "secondary" | "default" | "outline"; icon: React.ReactNode }> = {
  pending: { label: "Pending", variant: "secondary", icon: <Clock className="h-3 w-3" /> },
  in_progress: { label: "In Progress", variant: "default", icon: <PlayCircle className="h-3 w-3" /> },
  completed: { label: "Completed", variant: "outline", icon: <Check className="h-3 w-3" /> },
};

interface UploadedFile {
  name: string;
  url: string;
  type: string;
}

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
  logo_files: UploadedFile[];
  brand_assets: UploadedFile[];
  success_definition: string | null;
  current_challenges: string | null;
  competitors: string | null;
  avoid_or_include: string | null;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  status: string;
}

type SortField = "business_name" | "created_at" | "status";
type SortDirection = "asc" | "desc";

const ClientIntakesPanel = () => {
  const [intakes, setIntakes] = useState<ClientIntake[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [viewingIntake, setViewingIntake] = useState<ClientIntake | null>(null);
  const { toast } = useToast();

  // Filtering & Sorting state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<IntakeStatus | "all">("all");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Filtered and sorted intakes
  const filteredIntakes = useMemo(() => {
    let result = [...intakes];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (intake) =>
          intake.business_name.toLowerCase().includes(query) ||
          intake.contact_name.toLowerCase().includes(query) ||
          intake.contact_email.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((intake) => intake.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "business_name":
          comparison = a.business_name.localeCompare(b.business_name);
          break;
        case "created_at":
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case "status":
          const statusOrder: Record<string, number> = { pending: 0, in_progress: 1, completed: 2 };
          comparison = (statusOrder[a.status] ?? 0) - (statusOrder[b.status] ?? 0);
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [intakes, searchQuery, statusFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSortField("created_at");
    setSortDirection("desc");
  };

  const hasActiveFilters = searchQuery || statusFilter !== "all";

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
        logo_files: (intake.logo_files || []) as unknown as UploadedFile[],
        brand_assets: (intake.brand_assets || []) as unknown as UploadedFile[],
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

  const handleStatusChange = async (id: string, newStatus: IntakeStatus) => {
    setUpdatingStatusId(id);
    const { error } = await supabase
      .from("client_intakes")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    } else {
      setIntakes(intakes.map((i) => (i.id === id ? { ...i, status: newStatus } : i)));
      // Update viewingIntake if it's the one being updated
      if (viewingIntake?.id === id) {
        setViewingIntake({ ...viewingIntake, status: newStatus });
      }
      toast({
        title: "Status updated",
        description: `Intake marked as ${STATUS_CONFIG[newStatus].label.toLowerCase()}.`,
      });
    }
    setUpdatingStatusId(null);
  };

  const exportToCSV = () => {
    const headers = [
      "Business Name",
      "Contact Name",
      "Email",
      "Phone",
      "Industry",
      "Location",
      "Description",
      "Website Goal",
      "Desired Action",
      "Pages",
      "Services",
      "Brand Colors",
      "Brand Fonts",
      "Brand Personality",
      "Inspiration Websites",
      "Success Definition",
      "Current Challenges",
      "Competitors",
      "Avoid/Include",
      "Status",
      "Submitted Date",
    ];

    const rows = intakes.map((intake) => [
      intake.business_name,
      intake.contact_name,
      intake.contact_email,
      intake.contact_phone || "",
      intake.industry,
      intake.location,
      intake.business_description,
      intake.website_goal,
      intake.desired_action,
      intake.desired_pages.filter((p) => p.name).map((p) => p.name).join("; "),
      intake.services.filter((s) => s.name).map((s) => s.name).join("; "),
      intake.brand_colors || "",
      intake.brand_fonts || "",
      intake.brand_personality || "",
      intake.inspiration_websites || "",
      intake.success_definition || "",
      intake.current_challenges || "",
      intake.competitors || "",
      intake.avoid_or_include || "",
      STATUS_CONFIG[intake.status as IntakeStatus]?.label || intake.status,
      format(new Date(intake.created_at), "yyyy-MM-dd"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `client-intakes-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();

    toast({
      title: "CSV exported",
      description: `${intakes.length} intake(s) exported successfully.`,
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    
    doc.setFontSize(18);
    doc.text("Client Intakes Report", 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on ${format(new Date(), "MMMM d, yyyy")}`, 14, 30);

    const tableData = intakes.map((intake) => [
      intake.business_name,
      intake.contact_name,
      intake.contact_email,
      intake.industry,
      intake.location,
      STATUS_CONFIG[intake.status as IntakeStatus]?.label || intake.status,
      format(new Date(intake.created_at), "MMM d, yyyy"),
    ]);

    autoTable(doc, {
      startY: 36,
      head: [["Business", "Contact", "Email", "Industry", "Location", "Status", "Date"]],
      body: tableData,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save(`client-intakes-${format(new Date(), "yyyy-MM-dd")}.pdf`);

    toast({
      title: "PDF exported",
      description: `${intakes.length} intake(s) exported successfully.`,
    });
  };

  const exportSingleIntakeToPDF = (intake: ClientIntake) => {
    const doc = new jsPDF();
    let yPos = 20;
    const leftMargin = 14;
    const lineHeight = 7;

    // Title
    doc.setFontSize(20);
    doc.text(intake.business_name, leftMargin, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Submitted by ${intake.contact_name} on ${format(new Date(intake.created_at), "MMMM d, yyyy")}`, leftMargin, yPos);
    yPos += 15;

    const addSection = (title: string, fields: { label: string; value: string | null | undefined }[]) => {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(title, leftMargin, yPos);
      yPos += 8;

      doc.setFontSize(10);
      fields.forEach(({ label, value }) => {
        if (value) {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          doc.setTextColor(100);
          doc.text(`${label}:`, leftMargin, yPos);
          doc.setTextColor(0);
          const lines = doc.splitTextToSize(value, 170);
          doc.text(lines, leftMargin + 35, yPos);
          yPos += lineHeight * Math.max(1, lines.length);
        }
      });
      yPos += 5;
    };

    addSection("Contact Information", [
      { label: "Name", value: intake.contact_name },
      { label: "Email", value: intake.contact_email },
      { label: "Phone", value: intake.contact_phone },
    ]);

    addSection("Business Information", [
      { label: "Business", value: intake.business_name },
      { label: "Industry", value: intake.industry },
      { label: "Location", value: intake.location },
      { label: "Description", value: intake.business_description },
      { label: "Website Goal", value: intake.website_goal },
      { label: "Desired Action", value: intake.desired_action },
    ]);

    addSection("Brand Identity", [
      { label: "Colors", value: intake.brand_colors },
      { label: "Fonts", value: intake.brand_fonts },
      { label: "Personality", value: intake.brand_personality },
      { label: "Inspiration", value: intake.inspiration_websites },
    ]);

    const pages = intake.desired_pages.filter((p) => p.name).map((p) => p.name).join(", ");
    if (pages) {
      addSection("Website Pages", [{ label: "Pages", value: pages }]);
    }

    const services = intake.services.filter((s) => s.name).map((s) => `${s.name}${s.price ? ` (${s.price})` : ""}`).join(", ");
    if (services) {
      addSection("Services", [{ label: "Services", value: services }]);
    }

    addSection("Goals & Expectations", [
      { label: "Success", value: intake.success_definition },
      { label: "Challenges", value: intake.current_challenges },
      { label: "Competitors", value: intake.competitors },
      { label: "Avoid/Include", value: intake.avoid_or_include },
    ]);

    doc.save(`intake-${intake.business_name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${format(new Date(), "yyyy-MM-dd")}.pdf`);

    toast({
      title: "PDF exported",
      description: `Intake for ${intake.business_name} exported.`,
    });
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

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };

  return (
    <>
      {/* Filters and Export */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by business or contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as IntakeStatus | "all")}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(STATUS_CONFIG).map(([value, config]) => (
              <SelectItem key={value} value={value}>
                <div className="flex items-center gap-2">
                  {config.icon}
                  <span>{config.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}

        {/* Export Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={exportToCSV}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportToPDF}>
              <FileText className="h-4 w-4 mr-2" />
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground mb-2">
        Showing {filteredIntakes.length} of {intakes.length} intake{intakes.length !== 1 ? "s" : ""}
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>
                <button
                  className="flex items-center hover:text-foreground transition-colors"
                  onClick={() => handleSort("business_name")}
                >
                  Business
                  <SortIcon field="business_name" />
                </button>
              </TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>
                <button
                  className="flex items-center hover:text-foreground transition-colors"
                  onClick={() => handleSort("created_at")}
                >
                  Date
                  <SortIcon field="created_at" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center hover:text-foreground transition-colors"
                  onClick={() => handleSort("status")}
                >
                  Status
                  <SortIcon field="status" />
                </button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIntakes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No intakes match your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredIntakes.map((intake) => (
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
                  <Select
                    value={intake.status}
                    onValueChange={(value) => handleStatusChange(intake.id, value as IntakeStatus)}
                    disabled={updatingStatusId === intake.id}
                  >
                    <SelectTrigger className="w-[140px] h-8">
                      {updatingStatusId === intake.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            {STATUS_CONFIG[intake.status as IntakeStatus]?.icon}
                            <span>{STATUS_CONFIG[intake.status as IntakeStatus]?.label || intake.status}</span>
                          </div>
                        </SelectValue>
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_CONFIG).map(([value, config]) => (
                        <SelectItem key={value} value={value}>
                          <div className="flex items-center gap-2">
                            {config.icon}
                            <span>{config.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewingIntake(intake)}
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => exportSingleIntakeToPDF(intake)}
                      title="Export to PDF"
                    >
                      <Download className="h-4 w-4" />
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
            ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Intake Dialog */}
      <Dialog open={!!viewingIntake} onOpenChange={() => setViewingIntake(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {viewingIntake && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-2xl font-heading">{viewingIntake.business_name}</DialogTitle>
                    <DialogDescription>
                      Submitted by {viewingIntake.contact_name} on {format(new Date(viewingIntake.created_at), "MMMM d, yyyy")}
                    </DialogDescription>
                  </div>
                  <Select
                    value={viewingIntake.status}
                    onValueChange={(value) => handleStatusChange(viewingIntake.id, value as IntakeStatus)}
                    disabled={updatingStatusId === viewingIntake.id}
                  >
                    <SelectTrigger className="w-[140px] h-9">
                      {updatingStatusId === viewingIntake.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            {STATUS_CONFIG[viewingIntake.status as IntakeStatus]?.icon}
                            <span>{STATUS_CONFIG[viewingIntake.status as IntakeStatus]?.label || viewingIntake.status}</span>
                          </div>
                        </SelectValue>
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_CONFIG).map(([value, config]) => (
                        <SelectItem key={value} value={value}>
                          <div className="flex items-center gap-2">
                            {config.icon}
                            <span>{config.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                {(viewingIntake.brand_colors || viewingIntake.brand_fonts || viewingIntake.brand_personality || viewingIntake.inspiration_websites || viewingIntake.logo_files.length > 0) && (
                  <Section title="Brand Identity">
                    {viewingIntake.logo_files.length > 0 && (
                      <FileListDisplay files={viewingIntake.logo_files} label="Logo Files" />
                    )}
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

                {/* Visual Assets */}
                {viewingIntake.brand_assets.length > 0 && (
                  <Section title="Visual Assets">
                    <FileListDisplay files={viewingIntake.brand_assets} label="Uploaded Files" />
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

const FileListDisplay = ({ files, label }: { files: UploadedFile[]; label: string }) => {
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
              <img src={file.url} alt={file.name} className="h-8 w-8 rounded object-cover" />
            ) : file.type.includes("pdf") ? (
              <File className="h-4 w-4 text-destructive" />
            ) : (
              <FileImage className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-xs truncate max-w-[100px]">{file.name}</span>
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default ClientIntakesPanel;
