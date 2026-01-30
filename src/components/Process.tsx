const steps = [
  {
    number: "01",
    title: "DISCOVERY CALL",
    description: "We chat about your business, goals, and vision. You tell me what you need—I listen.",
  },
  {
    number: "02",
    title: "DESIGN & BUILD",
    description: "I create your website, designed around your brand and services. You'll see mockups before we go live.",
  },
  {
    number: "03",
    title: "REVIEW & REFINE",
    description: "You review the design, request changes, and we fine-tune until it's perfect.",
  },
  {
    number: "04",
    title: "LAUNCH",
    description: "Your website goes live! I handle all the technical stuff so you can focus on your business.",
  },
];

const Process = () => {
  return (
    <section id="process" className="py-20 md:py-28 bg-secondary">
      <div className="container">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mt-3 mb-6">
            FROM IDEA TO LAUNCH IN 4 SIMPLE STEPS
          </h2>
          <p className="text-muted-foreground text-lg">
            No complicated process. No endless meetings. Just clear steps to get your business online.
          </p>
        </div>

        {/* Process steps */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-hero hidden sm:block" />

            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative flex items-start gap-6 mb-12 last:mb-0 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Number bubble */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center shadow-elevated">
                    <span className="font-heading text-xl text-primary-foreground">
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div
                  className={`flex-1 bg-background rounded-2xl p-6 md:p-8 shadow-soft ${
                    index % 2 === 0 ? "md:mr-auto md:ml-0" : "md:ml-auto md:mr-0"
                  } md:max-w-md`}
                >
                  <h3 className="font-heading text-xl md:text-2xl text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
