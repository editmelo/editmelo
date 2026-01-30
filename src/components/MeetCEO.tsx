import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import ceoPhoto from "@/assets/ceo-photo.jpg";

const MeetCEO = () => {
  const highlights = [
    "Graduated from Miami University (Ohio)",
    "Former star student athlete",
    "10+ years leading Indiana's top branding & design projects",
    "Passionate about data-driven strategy & pixel-perfect execution",
    "Guides a multidisciplinary team across design, web, video & marketing",
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-secondary">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Photo */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-elevated">
              <img
                src={ceoPhoto}
                alt="Lauren Dickerson, CEO of Edit Me Lo"
                className="w-full h-full object-cover object-top"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-hero rounded-2xl -z-10" />
          </div>

          {/* Content */}
          <div>
            <span className="text-accent font-semibold text-base md:text-lg uppercase tracking-wider">
              Meet Our CEO
            </span>
            <h2 className="font-heading text-4xl md:text-5xl text-primary mt-3 mb-6">
              LAUREN DICKERSON
            </h2>

            <ul className="space-y-4 mb-8">
              {highlights.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span className="text-foreground/80 text-lg">{item}</span>
                </li>
              ))}
            </ul>

            <Button variant="hero" size="xl" asChild>
              <a
                href="https://calendar.app.google/ZPDRhjEVzosBdRQQ6"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Calendar className="mr-2 w-5 h-5" />
                Schedule a Call with Lauren
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetCEO;
