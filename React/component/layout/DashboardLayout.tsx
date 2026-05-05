import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, LogOut, Menu, ChevronLeft } from 'lucide-react';
import faviconImg from '../../src/assets/favicon.png';

interface DashboardLayoutProps {
    children: ReactNode;
}

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Transaksi', icon: Receipt, path: '/transaction' },
];

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const open = useCallback(() => setIsSidebarOpen(true), []);
    const close = useCallback(() => setIsSidebarOpen(false), []);

    return (
        <div className="min-h-screen bg-surface flex overflow-hidden">

            <div
                onClick={close}
                className={`md:hidden fixed inset-0 bg-black/30 z-40 transition-opacity duration-300
                    ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            />

            <button
                onClick={open}
                aria-label="Buka sidebar"
                className={`hidden md:flex fixed top-6 left-6 z-40 bg-white p-3 rounded-xl shadow-md
                    border border-gray-100 text-gray-600 hover:text-primary transition-all duration-300
                    ${isSidebarOpen
                        ? 'opacity-0 scale-75 pointer-events-none'
                        : 'opacity-100 scale-100'
                    }`}
            >
                <Menu className="w-5 h-5" />
            </button>

            <aside
                className={`hidden md:flex flex-col bg-white border-r border-gray-200
                    fixed h-full w-64 z-50 transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="p-6 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <img src={faviconImg} alt="Logo" className="w-8 h-8 shrink-0" />
                        <span className="text-xl font-black text-gray-800 tracking-tighter whitespace-nowrap">
                            Py<span className="text-primary">Duiten</span>
                        </span>
                    </div>

                    <button
                        onClick={close}
                        aria-label="Tutup sidebar"
                        className="p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition-colors shrink-0"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {menuItems.map(({ name, icon: Icon, path }) => {
                        const isActive = location.pathname === path;
                        return (
                            <Link
                                key={name}
                                to={path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium
                                    transition-all duration-200 whitespace-nowrap group
                                    ${isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 shrink-0 transition-transform duration-200
                                    ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                                />
                                <span>{name}</span>

                                {isActive && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium
                        text-red-500 hover:bg-red-50 transition-all duration-200 whitespace-nowrap group">
                        <LogOut className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
                        Keluar
                    </button>
                </div>
            </aside>

            <main className={`flex-1 relative pb-20 md:pb-0 transition-all duration-300 ease-in-out
                ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}
            >
                <div className={`${!isSidebarOpen ? 'md:pt-16' : ''}`}>
                    {children}
                </div>
            </main>

            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 px-6 py-3 flex justify-around items-center">
                {menuItems.map(({ name, icon: Icon, path }) => {
                    const isActive = location.pathname === path;
                    return (
                        <Link
                            key={name}
                            to={path}
                            className={`flex flex-col items-center gap-1 p-2 transition-colors duration-200
                                ${isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                            <span className="text-[10px] font-bold">{name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};