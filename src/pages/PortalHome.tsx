import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, FileText, ArrowRight, Globe, Palette, Rocket, Clock, DollarSign } from "lucide-react";
import logo from "@/assets/logo.png";

const PortalHome = () => {
  const navigate = useNavigate();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <a href="https://www.editmelo.com">
            <img src={logo} alt="Edit Me Lo" className="h-10" />
          </a>
          <a
            href="https://www.editmelo.com"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Visit Website
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-hero text-primary-foreground py-20 md:py-28">
        <div className="container max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-heading mb-6 animate-slide-up">
            LET'S BUILD YOUR WEBSITE
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-10 font-sans leading-relaxed animate-fade-in">
            Professional websites for business owners — built in 5–7 days, starting at $500. 
            Get online fast with a site that actually works for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button
              size="lg"
              onClick={() => navigate("/intake")}
              className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6 shadow-elevated"
            >
              <FileText className="mr-2 h-5 w-5" />
              Request a Quote
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setIsCalendarOpen(true)}
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-6"
            >
              <CalendarDays className="mr-2 h-5 w-5" />
              Schedule a Free Call
            </Button>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-heading text-center mb-4">
            WHAT YOU GET
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Everything you need to launch your online presence — no hassle, no fluff.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Globe,
                title: "Custom Website",
                description: "A fully responsive, professionally designed website tailored to your brand and business goals.",
              },
              {
                icon: Palette,
                title: "Your Brand, Your Way",
                description: "We match your existing branding — colors, fonts, logo — or help you define a look that fits.",
              },
              {
                icon: Rocket,
                title: "Launch-Ready",
                description: "Mobile-optimized, fast-loading, and built to convert visitors into customers from day one.",
              },
            ].map((item) => (
              <Card key={item.title} className="border-0 shadow-soft bg-card">
                <CardContent className="pt-8 pb-6 px-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-heading text-center mb-12">
            HOW IT WORKS
          </h2>
          <div className="space-y-8">
            {[
              {
                step: "01",
                icon: CalendarDays,
                title: "Book a Free Consultation",
                description: "We hop on a quick call to learn about your business and what you need.",
              },
              {
                step: "02",
                icon: FileText,
                title: "Fill Out Your Intake Form",
                description: "Share your brand details, content, and preferences so we can get building.",
              },
              {
                step: "03",
                icon: Clock,
                title: "We Build in 5–7 Days",
                description: "Sit back while we design and develop your website, fast.",
              },
              {
                step: "04",
                icon: Rocket,
                title: "Launch & Grow",
                description: "Your site goes live. Optional monthly plans keep it fresh and updated.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-hero flex items-center justify-center">
                  <span className="text-primary-foreground font-heading text-lg">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-heading text-xl mb-1">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Snapshot */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-heading mb-4">
            SIMPLE PRICING
          </h2>
          <p className="text-muted-foreground mb-10">
            No hidden fees. No surprises. Just a great website.
          </p>
          <Card className="border-0 shadow-elevated bg-card overflow-hidden">
            <div className="bg-gradient-hero p-6">
              <DollarSign className="h-10 w-10 text-primary-foreground mx-auto mb-2" />
              <p className="text-primary-foreground font-heading text-4xl">$500</p>
              <p className="text-primary-foreground/80 text-sm mt-1">One-time website build</p>
            </div>
            <CardContent className="p-8">
              <div className="grid sm:grid-cols-2 gap-4 text-left mb-8">
                {[
                  "Custom responsive design",
                  "5–7 day turnaround",
                  "Mobile-optimized",
                  "SEO-ready structure",
                  "Brand-matched styling",
                  "Launch support",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mb-6">
                Optional monthly management: $50/mo (basic upkeep) or $100/mo (active updates)
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => navigate("/intake")} size="lg" className="px-8">
                  <FileText className="mr-2 h-4 w-4" />
                  Request a Quote
                </Button>
                <Button onClick={() => setIsCalendarOpen(true)} size="lg" variant="outline" className="px-8">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Schedule a Call
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-dark text-primary-foreground py-10">
        <div className="container text-center">
          <img src={logo} alt="Edit Me Lo" className="h-8 mx-auto mb-4 brightness-0 invert" />
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} Edit Me Lo. All rights reserved.
          </p>
          <a
            href="https://www.editmelo.com"
            className="text-primary-foreground/60 text-xs hover:text-primary-foreground/80 transition-colors mt-2 inline-block"
          >
            www.editmelo.com
          </a>
        </div>
      </footer>

      {/* Calendar Modal */}
      {isCalendarOpen && (
        <div
          className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4"
          onClick={() => setIsCalendarOpen(false)}
        >
          <div
            className="bg-card rounded-lg shadow-elevated w-full max-w-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()
            }
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-heading text-lg">SCHEDULE YOUR FREE CONSULTATION</h3>
              <button
                onClick={() => setIsCalendarOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors text-2xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <iframe
              src="https://calendar.app.google/89RtcmHtGyVYv4H27"
              className="w-full h-[600px] border-0"
              title="Schedule a consultation"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PortalHome;
