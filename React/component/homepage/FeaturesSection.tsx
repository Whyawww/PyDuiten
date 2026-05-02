import { BrainCircuit, LineChart, Smartphone } from 'lucide-react';

export const FeaturesSection = () => {
    const features = [
        {
            icon: <BrainCircuit className="w-8 h-8 text-primary" />,
            title: 'AI Financial Advisor',
            description: 'Dapet roasting pedas atau pujian manis langsung dari Gemini AI berdasarkan habit jajan lu tiap bulan.'
        },
        {
            icon: <LineChart className="w-8 h-8 text-secondary" />,
            title: 'Dashboard Real-time',
            description: 'Pantau arus kas masuk dan keluar dengan visualisasi data yang clean, gampang dibaca, dan ngga bikin pusing.'
        },
        {
            icon: <Smartphone className="w-8 h-8 text-yellow-600" />,
            title: 'Ringan & Hemat Kuota',
            description: 'Akses secepat kilat. Bisa di-install langsung ke HP lu tanpa perlu download berpuluh-puluh MB dari App Store.'
        }
    ];

    return (
        <section id="fitur" className="py-20 bg-white">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-black text-gray-800 mb-4 tracking-tight">
                        Kenapa Harus Pindah Kesini?
                    </h2>
                    <p className="text-gray-600 font-medium max-w-2xl mx-auto">
                        Bukan sekadar pencatat uang biasa. Kita bawa teknologi AI buat bantu lu sadar diri soal keuangan.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="p-8 rounded-3xl bg-surface/50 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};