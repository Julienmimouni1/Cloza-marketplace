import { Link } from "@/navigation";
import { ArrowRight, Instagram, Linkedin, Twitter } from "lucide-react";
import { useTranslations } from "next-intl";
import { ContactModal } from "@/features/contact/components/ContactModal";

export function Footer() {
  const t = useTranslations('Footer');

  const footerLinks = {
    policies: [
      { label: t('policyTerms'), href: "/legal/terms" },
      { label: t('privacy'), href: "/legal/privacy" },
      { label: t('policyRefund'), href: "/legal/refund" },
      { label: t('policyShipping'), href: "/legal/shipping" },
    ]
  };

  return (
    <footer className="bg-cloza-black text-white py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 space-y-6">
            <Link href="/" className="text-2xl font-serif font-bold tracking-tighter text-cloza-gold">
              CLOZA
            </Link>
            <p className="text-zinc-400 max-w-xs text-sm leading-relaxed">
              {t('description')}
            </p>
            <div className="pt-4">
              <h4 className="text-xs uppercase tracking-widest text-cloza-gold mb-4">{t('newsletter')}</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder={t('newsletterPlaceholder')}
                  className="bg-transparent border-b border-zinc-700 py-2 focus:outline-none focus:border-cloza-gold transition-colors flex-1 text-sm"
                />
                <button className="ml-4 p-2 hover:text-cloza-gold transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Policies Column */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1">
            <h4 className="text-sm font-semibold mb-6">{t('legal')}</h4>
            <ul className="space-y-4">
              {footerLinks.policies.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-zinc-400 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Assistance Column */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1">
            <h4 className="text-sm font-semibold mb-6">{t('assistance')}</h4>
            <ul className="space-y-4">
              <li>
                <ContactModal>
                  <button className="text-zinc-400 hover:text-white transition-colors text-sm text-left">
                    {t('contactUs')}
                  </button>
                </ContactModal>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-xs">
            © {new Date().getFullYear()} CLOZA. {t('rights')}
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-zinc-500 hover:text-white transition-colors">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-zinc-500 hover:text-white transition-colors">
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-zinc-500 hover:text-white transition-colors">
              <Twitter className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}