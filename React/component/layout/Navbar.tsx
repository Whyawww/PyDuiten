export const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-gray-200/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
                        <span className="text-primary font-black text-2xl tracking-tighter">
                            Py<span className="text-secondary">Duiten</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <a href="#" className="hidden sm:block text-gray-600 hover:text-primary font-medium transition-colors">
                            Fitur
                        </a>
                        <div className="w-px h-6 bg-gray-300 hidden sm:block"></div>
                        <button className="text-gray-800 font-medium px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors">
                            Masuk
                        </button>
                        <button className="bg-primary text-white font-semibold px-6 py-2 rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                            Daftar
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};