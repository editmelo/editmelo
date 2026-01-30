import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Lauren is Awesome! She does everything in a timely manner. Her work is excellent! Very Professional. I can not be happier with the work she did on our website!",
    author: "Shemekia Ball",
    company: "Caregivers of Indy",
  },
  {
    quote: "I described exactly how I wanted my website to Lauren and not only did she meet my expectations she went above them! I highly recommend Lauren to provide you with an impeccable level of service!",
    author: "Crystal Lewis",
    company: "La Cristal Lingerie",
  },
  {
    quote: "Lauren and her team were the epitome of professional. Their services exceeded my team's and my expectations. I highly recommend partnering with Edit Me Lo for your graphic design projects.",
    author: "Latonja Saffold",
    company: "E-Volve LLC",
  },
  {
    quote: "The team at Edit Me Lo is detailed and provides quality work. She loves what she does, and it shows. She delivered above and beyond what I expected.",
    author: "Latonja Saffold",
    company: "E-Volve LLC",
  },
  {
    quote: "Excellent customer service, communication, patience, and vision! I explained what I wanted and Edit Me Lo brought it to life! Highly recommend!!",
    author: "Client",
    company: "Business Owner",
  },
  {
    quote: "There are not enough words to describe Ms. Lauren. Her passion and dedication produce amazing ideas. She has completed my business logos, website, and multiple designs.",
    author: "Jason Mitchell",
    company: "Exalted Herbs",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 md:py-28 bg-background">
      <div className="container">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">
            Client Love
          </span>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mt-3 mb-6">
            WHAT OUR CLIENTS SAY
          </h2>
          <p className="text-muted-foreground text-lg">
            Don't just take our word for it—hear from business owners who trusted us with their online presence.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-secondary rounded-2xl p-8 relative group hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
            >
              {/* Quote icon */}
              <Quote className="w-10 h-10 text-accent/30 absolute top-6 right-6" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-accent text-accent"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground/80 mb-6 leading-relaxed relative z-10">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div>
                <p className="font-semibold text-foreground">
                  {testimonial.author}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
