import { Globe, Palette, Smartphone, Zap, HeadphonesIcon, BarChart3 } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Custom Website Design",
    description: "A website tailored to your brand, not a cookie-cutter template. Your business is unique, and your site should be too.",
  },
  {
    icon: Smartphone,
    title: "Mobile-Friendly",
    description: "Your site will look great on phones, tablets, and desktops. Because your customers are everywhere.",
  },
  {
    icon: Palette,
    title: "Brand-Focused Design",
    description: "Colors, fonts, and imagery that match your business identity. Consistent branding builds trust.",
  },
  {
    icon: Zap,
    title: "Fast Turnaround",
    description: "Your website goes live in just 5–7 days. No months of waiting, just results.",
  },
  {
    icon: HeadphonesIcon,
    title: "Contact & Booking Setup",
    description: "Make it easy for customers to reach you. Contact forms, booking links, and more.",
  },
  {
    icon: BarChart3,
    title: "Built to Convert",
    description: "Strategic layouts designed to turn visitors into paying customers.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 md:py-28 bg-secondary">
      <div className="container">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-accent font-semibold text-base md:text-lg uppercase tracking-wider">
            What You Get
          </span>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mt-3 mb-6">
            EVERYTHING YOUR BUSINESS NEEDS ONLINE
          </h2>
          <p className="text-muted-foreground text-lg">
            No fluff, no jargon—just a website that makes your business look professional and helps you get more customers.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group bg-background rounded-2xl p-8 shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-heading text-xl text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
