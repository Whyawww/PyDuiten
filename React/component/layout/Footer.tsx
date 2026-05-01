export const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 font-medium text-sm">
                        © {new Date().getFullYear()} PyDuiten. Semua hak dilindungi.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-400 hover:text-secondary transition-colors">Privasi</a>
                        <a href="#" className="text-gray-400 hover:text-secondary transition-colors">Syarat</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};