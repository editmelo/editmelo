import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const benefits = [
    "Mobile-friendly design",
    "Live in 5–7 days",
    "No hidden fees",
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-dark opacity-[0.03]" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">
              Professional websites starting at $500
            </span>
          </div>

          {/* Main headline */}
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl text-foreground mb-6 animate-slide-up leading-tight">
            YOUR BUSINESS DESERVES
            <span className="block text-gradient">A WEBSITE THAT WORKS</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in font-sans">
            Get a clean, mobile-friendly website built around your brand and services.
            No tech headaches. Just results.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10 animate-fade-in">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-2 text-foreground/80"
              >
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <span className="font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Button variant="hero" size="xl" asChild>
              <a href="#contact">
                Get Your Free Quote
                <ArrowRight className="ml-2" />
              </a>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <a href="#pricing">View Pricing</a>
            </Button>
          </div>

          {/* Social proof */}
          <p className="mt-10 text-sm text-muted-foreground animate-fade-in">
            Trusted by <span className="font-semibold text-foreground">50+</span> Indiana businesses
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
