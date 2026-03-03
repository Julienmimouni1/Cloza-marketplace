import { useTranslations } from 'next-intl';
import { ContactForm } from '@/features/contact/components/ContactForm';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations('Contact');

  return (
    <div className="container px-4 md:px-6 py-12 md:py-24 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-slate-900">{t('title')}</h1>
        <p className="text-slate-500 text-lg">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Info Side */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-slate-50 p-8 rounded-lg space-y-6">
            <h3 className="font-serif font-semibold text-xl mb-4">Informations</h3>
            
            <div className="flex items-start space-x-4">
              <Mail className="w-5 h-5 text-cloza-gold mt-1" />
              <div>
                <p className="font-medium text-slate-900">{t('info.email')}</p>
                <a href="mailto:contact.cloza@gmail.com" className="text-slate-500 hover:text-cloza-gold transition-colors">
                  contact.cloza@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Phone className="w-5 h-5 text-cloza-gold mt-1" />
              <div>
                <p className="font-medium text-slate-900">{t('info.phone')}</p>
                <p className="text-slate-500">+33 1 23 45 67 89</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <MapPin className="w-5 h-5 text-cloza-gold mt-1" />
              <div>
                <p className="font-medium text-slate-900">Bureau</p>
                <p className="text-slate-500">
                  Paris, France
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 md:p-8 rounded-lg border border-slate-200 shadow-sm">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
