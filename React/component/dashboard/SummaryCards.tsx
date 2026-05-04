import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

interface SummaryProps {
    data: {
        saldo: number;
        pemasukan: number;
        pengeluaran: number;
    }
}

export const SummaryCards = ({ data }: SummaryProps) => {
    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-primary rounded-3xl p-6 text-white shadow-lg animate-slide-up" style={{ animationDelay: '0ms' }}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-white/80 font-medium text-sm">Total Saldo</p>
                        <h2 className="text-3xl font-black mt-1">{formatRupiah(data.saldo)}</h2>
                    </div>
                    <div className="p-3 bg-white/20 rounded-2xl">
                        <Wallet className="w-6 h-6" />
                    </div>
                </div>
                <p className="text-sm font-medium bg-white/10 inline-block px-3 py-1 rounded-full">
                    Status: Aman terkendali
                </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-gray-500 font-medium text-sm">Pemasukan</p>
                        <h2 className="text-2xl font-black text-gray-800 mt-1">{formatRupiah(data.pemasukan)}</h2>
                    </div>
                    <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                </div>
                <p className="text-sm font-medium text-green-600">
                    +20% dari bulan lalu
                </p>
            </div>

            {/* Pengeluaran Card */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm animate-slide-up" style={{ animationDelay: '200ms' }}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-gray-500 font-medium text-sm">Pengeluaran</p>
                        <h2 className="text-2xl font-black text-gray-800 mt-1">{formatRupiah(data.pengeluaran)}</h2>
                    </div>
                    <div className="p-3 bg-red-50 text-red-500 rounded-2xl">
                        <TrendingDown className="w-6 h-6" />
                    </div>
                </div>
                <p className="text-sm font-medium text-red-500">
                    -5% dari bulan lalu
                </p>
            </div>
        </div>
    );
};