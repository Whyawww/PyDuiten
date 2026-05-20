import { Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

export const WishlistHeader = () => {
    const { t } = useTranslation();

    return (
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="md:w-1/2 flex items-start gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-2xl shadow-sm mt-1">
                    <Target className="w-7 h-7" />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-800 dark:text-white tracking-tight">
                        {t('wishlist.title')}
                    </h1>
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium mt-1 leading-relaxed">
                        {t('wishlist.subtitle')}
                    </p>
                </div>
            </div>
            <div className="flex justify-start md:justify-end py-2 md:py-0">
                <LanguageSwitcher />
            </div>
        </header>
    );
};