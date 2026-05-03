import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, LogOut } from 'lucide-react';
import faviconImg from '../../src/assets/favicon.png';

interface DashboardLayoutProps {
    children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
        { name: 'Transaksi', icon: <Receipt className="w-5 h-5" />, path: '/transaction' },
    ];

    return (
        <div className="min-h-screen bg-surface flex">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full z-20">
                <div className="p-6 flex items-center gap-3 border-b border-gray-100">
                    <img src={faviconImg} alt="Logo" className="w-8 h-8" />
                    <span className="text-xl font-black text-gray-800 tracking-tighter">
                        Py<span className="text-primary">Duiten</span>
                    </span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                                    }`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut className="w-5 h-5" />
                        Keluar
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 relative pb-20 md:pb-0">
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 px-6 py-3 flex justify-around items-center">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex flex-col items-center gap-1 p-2 ${isActive ? 'text-primary' : 'text-gray-400'
                                }`}
                        >
                            {item.icon}
                            <span className="text-[10px] font-bold">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};