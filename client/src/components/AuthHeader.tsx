import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';

export function AuthHeader() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <span className="mr-6 hidden font-bold sm:inline-block">{t('common.login')}</span>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-1">
            <ThemeToggle />
            <Separator orientation="vertical" className="h-6" />
            <LanguageToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
