import { useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Receipt, LogOut, Menu, ChevronLeft, UserCircle, Sun, Moon, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import faviconImg from '../../src/assets/favicon.png';
import { useAuthStore } from '../../src/store/useAuthStore';
import { ConfirmModal } from '../transaction/ConfirmModal';
import { useThemeStore } from '../../src/store/useThemeStore';

interface DashboardLayoutProps {
    children: ReactNode;
}

const menuItems = [
    { key: 'layout.menu_dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { key: 'layout.menu_transaction', icon: Receipt, path: '/transaction' },
    { key: 'layout.menu_wishlist', icon: Target, path: '/wishlist' },
    { key: 'layout.menu_profile', icon: UserCircle, path: '/profile' },
];

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);
    const { t } = useTranslation();

    const { theme, toggleTheme, initTheme } = useThemeStore();

    useEffect(() => {
        initTheme();
    }, [initTheme]);

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const open = useCallback(() => setIsSidebarOpen(true), []);
    const close = useCallback(() => setIsSidebarOpen(false), []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-surface dark:bg-gray-950 flex overflow-hidden">
            <ConfirmModal
                isOpen={isLogoutModalOpen}
                title={t('layout.logout_title')}
                message={t('layout.logout_msg')}
                onConfirm={handleLogout}
                onCancel={() => setIsLogoutModalOpen(false)}
                confirmText={t('layout.logout')}
            />

            <div
                onClick={close}
                className={`md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300
                    ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            />

            <button
                onClick={open}
                aria-label="Buka sidebar"
                className={`hidden md:flex fixed top-6 left-6 z-40 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-md
                    border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-primary transition-all duration-300
                    ${isSidebarOpen ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100'}`}
            >
                <Menu className="w-5 h-5" />
            </button>

            <aside
                className={`hidden md:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
                    fixed h-full w-64 z-50 transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="p-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <img src={faviconImg} alt="Logo" className="w-8 h-8 shrink-0" />
                        <span className="text-xl font-black text-gray-800 dark:text-white tracking-tighter whitespace-nowrap">
                            Py<span className="text-primary">Duiten</span>
                        </span>
                    </div>
                    <button onClick={close} className="p-1.5 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-white rounded-lg transition-colors shrink-0">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {menuItems.map(({ key, icon: Icon, path }) => {
                        const isActive = location.pathname === path;
                        const translatedName = t(key);
                        return (
                            <Link key={key} to={path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap group
                                    ${isActive ? 'bg-primary/10 dark:bg-primary/20 text-primary'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-white'}`}
                            >
                                <Icon className={`w-5 h-5 shrink-0 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                <span>{translatedName}</span>
                                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 space-y-2 border-t border-gray-100 dark:border-gray-800">
                    <button onClick={toggleTheme} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 transition-all duration-200 whitespace-nowrap group">
                        {theme === 'light' ? <Moon className="w-5 h-5 shrink-0 group-hover:-translate-y-0.5" /> : <Sun className="w-5 h-5 shrink-0 text-yellow-400 group-hover:rotate-90" />}
                        {theme === 'light' ? t('layout.theme_dark') : t('layout.theme_light')}
                    </button>
                    <button onClick={() => setIsLogoutModalOpen(true)} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 whitespace-nowrap group">
                        <LogOut className="w-5 h-5 shrink-0 group-hover:-translate-x-0.5" />
                        {t('layout.logout')}
                    </button>
                </div>
            </aside>

            <main className={`flex-1 relative pb-20 md:pb-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
                <div className={`${!isSidebarOpen ? 'md:pt-16' : ''}`}>
                    {children}
                </div>
            </main>

            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-30 px-6 py-3 flex justify-around items-center">
                {menuItems.map(({ key, icon: Icon, path }) => {
                    const isActive = location.pathname === path;
                    const translatedName = t(key);
                    return (
                        <Link key={key} to={path} className={`flex flex-col items-center gap-1 p-2 transition-colors duration-200 ${isActive ? 'text-primary' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}>
                            <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                            <span className="text-[10px] font-bold">{translatedName}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};