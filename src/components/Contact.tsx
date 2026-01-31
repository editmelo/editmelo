import { useState } from "react";
import { Send, Calendar, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import CalendarModal from "@/components/CalendarModal";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });

    setFormData({ name: "", email: "", phone: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left side - Info */}
          <div>
            <span className="text-accent font-semibold text-base md:text-lg uppercase tracking-wider">
              Let's Talk
            </span>
            <h2 className="font-heading text-4xl md:text-5xl mt-3 mb-6">
              READY TO GET YOUR BUSINESS ONLINE?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              Fill out the form or schedule a free consultation call. No pressure, no pushy sales—just a friendly chat about how we can help your business grow.
            </p>

            {/* Quick actions */}
            <div className="space-y-4 mb-8">
              <CalendarModal>
                <button
                  type="button"
                  className="flex items-center gap-4 p-4 bg-primary-foreground/10 rounded-xl hover:bg-primary-foreground/15 transition-colors group w-full text-left cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">Schedule a Free Consultation</p>
                    <p className="text-sm text-primary-foreground/70">
                      Book a time that works for you
                    </p>
                  </div>
                </button>
              </CalendarModal>

              <a
                href="mailto:info@editmelo.com"
                className="flex items-center gap-4 p-4 bg-primary-foreground/10 rounded-xl hover:bg-primary-foreground/15 transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold">Email Us</p>
                  <p className="text-sm text-primary-foreground/70">
                    info@editmelo.com
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* Right side - Form */}
          <div>
            <form
              onSubmit={handleSubmit}
              className="bg-background text-foreground rounded-2xl p-8 shadow-elevated"
            >
              <h3 className="font-heading text-2xl text-foreground mb-6">
                GET YOUR FREE QUOTE
              </h3>

              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Your Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Smith"
                    required
                    className="h-12"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@mybusiness.com"
                    required
                    className="h-12"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                    className="h-12"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Tell us about your business *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="What does your business do? What are you looking for in a website?"
                    required
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="xl"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
