import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export function Testimonials() {
  const t = useTranslations('Testimonials');

  const testimonials = [
    {
      quote: t('sophieQuote'),
      author: "Sophie",
      boutique: "Boutique L'Aura",
      location: "Paris, FR"
    },
    {
      quote: t('marcQuote'),
      author: "Marc",
      boutique: "The Modern E-tailer",
      location: "Lyon, FR"
    },
    {
      quote: t('elenaQuote'),
      author: "Elena",
      boutique: "Maison Elena",
      location: "Milan, IT"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/10">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-serif tracking-tight mb-4">{t('title')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.author} 
              className="bg-white p-8 border border-border/50 rounded-sm shadow-sm flex flex-col justify-between"
            >
              <blockquote className="text-lg italic text-foreground/90 mb-6">
                "{testimonial.quote}"
              </blockquote>
              <div>
                <div className="font-semibold text-primary">{testimonial.author}</div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.boutique} • {testimonial.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
