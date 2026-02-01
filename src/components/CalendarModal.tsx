import { Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CalendarModalProps {
  children: React.ReactNode;
}

const CALENDAR_URL = "https://calendar.app.google/89RtcmHtGyVYv4H27";

const CalendarModal = ({ children }: CalendarModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 bg-primary text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              <Calendar className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <DialogTitle className="font-heading text-xl text-primary-foreground">
                SCHEDULE YOUR CONSULTATION
              </DialogTitle>
              <p className="text-sm text-primary-foreground/70 mt-1">
                Pick a time that works best for you
              </p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="w-full h-[500px] bg-background">
          <iframe
            src={CALENDAR_URL}
            style={{ border: 0 }}
            width="100%"
            height="100%"
            title="Schedule a consultation"
          />
        </div>
        
        <div className="p-4 bg-secondary border-t">
          <p className="text-center text-sm text-muted-foreground">
            Free 15-minute consultation • No obligation
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarModal;
