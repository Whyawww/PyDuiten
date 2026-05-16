import { ReactNode } from 'react';
import faviconImg from '../../src/assets/favicon.png';
import { useTranslation } from 'react-i18next';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen flex bg-surface animate-fade-in relative">
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 py-12 z-10">
                <div className="max-w-md w-full mx-auto animate-slide-up">
                    <div className="flex items-center gap-3 mb-10">
                        <img src={faviconImg} alt="PyDuiten Logo" className="w-10 h-10 drop-shadow-md" />
                        <span className="text-2xl font-black text-gray-800 tracking-tighter">
                            Py<span className="text-primary">Duiten</span>
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-black text-gray-800 mb-2">
                        {title}
                    </h1>
                    <p className="text-gray-500 font-medium mb-8">
                        {subtitle}
                    </p>

                    {children}
                </div>
            </div>

            <div className="hidden lg:flex w-1/2 bg-primary/10 relative items-center justify-center overflow-hidden">
                <div className="absolute w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl opacity-50 -top-20 -right-20"></div>
                <div className="absolute w-[400px] h-[400px] bg-secondary/20 rounded-full blur-3xl opacity-50 bottom-10 left-10"></div>

                <div className="relative z-10 text-center px-12">
                    <img src={faviconImg} alt="Mascot" className="w-50 h-48 mx-auto mb-8 drop-shadow-2xl animate-float" />
                    <h2 className="text-3xl font-black text-gray-800 mb-4">{t('auth.right_panel_title')}</h2>
                    <p className="text-lg text-gray-600 font-medium max-w-md mx-auto">
                        {t('auth.right_panel_desc')}
                    </p>
                </div>
            </div>
        </div>
    );
};