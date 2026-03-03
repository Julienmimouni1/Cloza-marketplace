'use client';

import { useRouter, usePathname } from '@/navigation';
import { useLocale } from 'next-intl';

interface LanguageSwitcherProps {
  initialLocale?: string;
}

export function LanguageSwitcher({ initialLocale }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const localeFromHook = useLocale();
  
  const locale = initialLocale || localeFromHook;

  const toggleLanguage = () => {
    const nextLocale = locale === 'fr' ? 'en' : 'fr';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 text-sm font-semibold hover:bg-muted rounded-full uppercase tracking-wider transition-colors"
      title={locale === 'fr' ? 'Switch to English' : 'Passer en français'}
    >
      {locale === 'fr' ? 'EN' : 'FR'}
    </button>
  );
}