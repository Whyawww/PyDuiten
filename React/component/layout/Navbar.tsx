import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../../src/assets/icons.png';

export const Navbar = () => {
    const { t } = useTranslation();

    return (
        <nav className="sticky top-0 pt-4 pb-4 z-50 bg-surface/80 backdrop-blur-md border-b border-gray-200/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
                        <img src={logo} alt="logo" className="w-17 h-17" />
                    </div>

                    <div className="flex items-center gap-3 sm:gap-5">
                        <div className="w-px h-6 bg-gray-300 hidden sm:block mx-1"></div>

                        <a href="#fitur" className="hidden sm:block text-gray-600 hover:text-primary font-medium transition-colors">
                            {t('nav.features')}
                        </a>

                        <Link to="/login" className="text-gray-800 font-medium px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors">
                            {t('nav.login')}
                        </Link>

                        <Link to="/register" className="bg-primary text-white font-semibold px-6 py-2 rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                            {t('nav.register')}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};