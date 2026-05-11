import { Link } from 'react-router-dom';

export const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto transition-colors">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                        © {new Date().getFullYear()} PyDuiten. Semua hak dilindungi.
                    </p>
                    <div className="flex gap-6">
                        <Link to="/privacy" className="text-gray-400 hover:text-secondary transition-colors text-sm font-bold">Privasi</Link>
                        <Link to="/terms" className="text-gray-400 hover:text-secondary transition-colors text-sm font-bold">Syarat</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};