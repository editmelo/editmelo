import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import LeadCaptureModal from "@/components/LeadCaptureModal";

const Pricing = () => {
  const websiteFeatures = [
    "Clean, mobile-friendly design",
    "Designed around your brand + services",
    "Contact/booking setup",
    "Live in about 5–7 days",
    "Basic SEO optimization",
    "Social media integration",
  ];

  const managementPlans = [
    {
      name: "Basic Upkeep",
      price: 50,
      features: [
        "Monthly security updates",
        "Basic content changes",
        "Email support",
        "Site backups",
      ],
    },
    {
      name: "Active Updates",
      price: 100,
      popular: true,
      features: [
        "Everything in Basic",
        "Active content changes",
        "New page additions",
        "Priority support",
        "Performance monitoring",
        "Monthly strategy call",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20 md:py-28 bg-background">
      <div className="container">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-accent font-semibold text-base md:text-lg uppercase tracking-wider">
            Simple Pricing
          </span>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mt-3 mb-6">
            TRANSPARENT. AFFORDABLE. NO SURPRISES.
          </h2>
          <p className="text-muted-foreground text-lg">
            One flat fee for your website. Optional monthly support if you need it.
          </p>
        </div>

        {/* Main pricing card */}
        <div className="max-w-xl mx-auto mb-16">
          <div className="bg-gradient-hero rounded-3xl p-1">
            <div className="bg-background rounded-[22px] p-8 md:p-10">
              <div className="text-center mb-8">
                <h3 className="font-heading text-2xl text-foreground mb-2">
                  WEBSITE BUILD
                </h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-sm text-muted-foreground">Starting at</span>
                  <span className="font-heading text-6xl text-gradient">$500</span>
                </div>
                <p className="text-muted-foreground mt-2">One-time payment</p>
              </div>

              <ul className="space-y-4 mb-8">
                {websiteFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-accent" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <LeadCaptureModal>
                <Button variant="hero" size="xl" className="w-full">
                  Get Started Today
                </Button>
              </LeadCaptureModal>
            </div>
          </div>
        </div>

        {/* Monthly management */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="font-heading text-2xl md:text-3xl text-foreground mb-2">
              OPTIONAL MONTHLY MANAGEMENT
            </h3>
            <p className="text-muted-foreground">
              After launch, keep your site fresh with ongoing support
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {managementPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                  plan.popular
                    ? "bg-primary text-primary-foreground shadow-elevated"
                    : "bg-secondary text-foreground shadow-soft"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
                      <Star className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                <h4 className="font-heading text-xl mb-4">{plan.name}</h4>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-heading text-4xl">${plan.price}</span>
                  <span className={plan.popular ? "text-primary-foreground/70" : "text-muted-foreground"}>
                    /month
                  </span>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check
                        className={`w-5 h-5 flex-shrink-0 ${
                          plan.popular ? "text-accent" : "text-accent"
                        }`}
                      />
                      <span className={plan.popular ? "text-primary-foreground/90" : ""}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
