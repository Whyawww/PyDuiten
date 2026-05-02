import { Link } from 'react-router-dom';
import { Download, Rocket } from 'lucide-react';
import { usePWA } from '../../src/hooks/usePWA';

export const CTASection = () => {
    const { isInstallable, installPWA } = usePWA();

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="bg-primary rounded-[2.5rem] p-10 md:p-16 text-center shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
                            Udah Siap Pegang Kendali?
                        </h2>
                        <p className="text-white/80 font-medium text-lg mb-10 max-w-2xl mx-auto">
                            Tinggalkan kebiasaan lama. Mulai catat keuangan lu sekarang dengan bantuan AI. Gratis, aman, dan tanpa iklan.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                            <Link to="register" className="flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 font-bold text-lg w-full sm:w-auto active:scale-95">
                                <Rocket className="w-5 h-5" />
                                Daftar Sekarang
                            </Link>

                            <button
                                onClick={installPWA}
                                disabled={!isInstallable}
                                className={`flex items-center justify-center gap-2 border-2 px-8 py-4 rounded-3xl transition-all duration-300 font-bold text-lg w-full sm:w-auto active:scale-95 ${isInstallable
                                        ? 'bg-primary text-white border-white/30 hover:bg-white/10 hover:-translate-y-1'
                                        : 'bg-white/10 text-white/50 border-white/10 cursor-not-allowed'
                                    }`}
                            >
                                <Download className="w-5 h-5" />
                                {isInstallable ? 'Install PyDuiten' : 'Aplikasi Terpasang'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};