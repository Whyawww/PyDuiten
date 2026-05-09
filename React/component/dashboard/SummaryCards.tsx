import { Wallet, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface SummaryProps {
    data: {
        saldo: number;
        pemasukan: number;
        pengeluaran: number;
    }
}

export const SummaryCards = ({ data }: SummaryProps) => {
    const { saldo, pemasukan, pengeluaran } = data;

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka);
    };

    const ratio = pemasukan === 0 ? (pengeluaran > 0 ? 1 : 0) : pengeluaran / pemasukan;
    const percentageExpense = (ratio * 100).toFixed(0);

    let status = {
        label: 'Aman Cuyyy',
        colorClass: 'bg-white/20 text-white',
        icon: <CheckCircle2 className="w-4 h-4 inline mr-1" />
    };

    if (ratio >= 0.8 || (pemasukan === 0 && pengeluaran > 0)) {
        status = {
            label: 'Buset! Boros bat kata gua mah',
            colorClass: 'bg-red-500/60 text-white shadow-inner',
            icon: <ShieldAlert className="w-4 h-4 inline mr-1" />
        };
    } else if (ratio >= 0.5) {
        status = {
            label: 'Jangan berlebihan cuy tiati aja dah',
            colorClass: 'bg-yellow-400/40 text-yellow-50',
            icon: <AlertCircle className="w-4 h-4 inline mr-1" />
        };
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-primary rounded-3xl p-6 text-white shadow-lg animate-slide-up" style={{ animationDelay: '0ms' }}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-white/80 font-medium text-sm">Total Saldo</p>
                        <h2 className="text-3xl font-black mt-1">{formatRupiah(saldo)}</h2>
                    </div>
                    <div className="p-3 bg-white/20 rounded-2xl">
                        <Wallet className="w-6 h-6" />
                    </div>
                </div>
                <div className={`text-sm font-medium inline-flex items-center px-3 py-1.5 rounded-full transition-all duration-300 ${status.colorClass}`}>
                    {status.icon}
                    {status.label}
                </div>
            </div>

            {/* Pemasukan */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-gray-500 font-medium text-sm">Pemasukan</p>
                        <h2 className="text-2xl font-black text-gray-800 mt-1">{formatRupiah(pemasukan)}</h2>
                    </div>
                    <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                </div>
                <p className="text-sm font-medium text-green-600">
                    {pemasukan > 0 ? 'Mantap, pertahankan cuy!' : 'Belum ada pemasukan nih cuy.'}
                </p>
            </div>

            {/* Pengeluaran */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm animate-slide-up" style={{ animationDelay: '200ms' }}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-gray-500 font-medium text-sm">Pengeluaran</p>
                        <h2 className="text-2xl font-black text-gray-800 mt-1">{formatRupiah(pengeluaran)}</h2>
                    </div>
                    <div className="p-3 bg-red-50 text-red-500 rounded-2xl">
                        <TrendingDown className="w-6 h-6" />
                    </div>
                </div>
                <p className="text-sm font-medium text-red-500">
                    {pengeluaran > 0
                        ? `Memakan ${percentageExpense}% dari pemasukan`
                        : 'Bagus, belum ada pengeluaran!'}
                </p>
            </div>
        </div>
    );
};