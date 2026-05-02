import { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Filter } from 'lucide-react';

export const Dashboard = () => {
    const [filter, setFilter] = useState('Bulan Ini');

    const summaryData = {
        saldo: 4500000,
        pemasukan: 8000000,
        pengeluaran: 3500000,
    };

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka);
    };

    return (
        <div className="p-6 md:p-8 animate-fade-in">
            {/* --- Header & Filter --- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight">Ringkasan Keuangan</h1>
                    <p className="text-gray-500 font-medium mt-1">Pantau terus duit lu biar nggak boncos.</p>
                </div>

                <div className="relative">
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 shadow-sm hover:border-primary focus-within:border-primary transition-colors">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-transparent text-sm font-semibold text-gray-700 outline-none cursor-pointer appearance-none pr-4"
                        >
                            <option value="Minggu Ini">Minggu Ini</option>
                            <option value="Bulan Ini">Bulan Ini</option>
                            <option value="3 Bulan">3 Bulan Terakhir</option>
                            <option value="Tahun Ini">Tahun Ini</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* --- Summary Cards --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-primary rounded-3xl p-6 text-white shadow-lg animate-slide-up" style={{ animationDelay: '0ms' }}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-white/80 font-medium text-sm">Total Saldo</p>
                            <h2 className="text-3xl font-black mt-1">{formatRupiah(summaryData.saldo)}</h2>
                        </div>
                        <div className="p-3 bg-white/20 rounded-2xl">
                            <Wallet className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-sm font-medium bg-white/10 inline-block px-3 py-1 rounded-full">
                        Status: Aman terkendali 🚀
                    </p>
                </div>

                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm animate-slide-up" style={{ animationDelay: '100ms' }}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-500 font-medium text-sm">Pemasukan</p>
                            <h2 className="text-2xl font-black text-gray-800 mt-1">{formatRupiah(summaryData.pemasukan)}</h2>
                        </div>
                        <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-sm font-medium text-green-600">
                        +20% dari bulan lalu
                    </p>
                </div>

                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-500 font-medium text-sm">Pengeluaran</p>
                            <h2 className="text-2xl font-black text-gray-800 mt-1">{formatRupiah(summaryData.pengeluaran)}</h2>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm lg:col-span-2 min-h-[300px] flex items-center justify-center animate-slide-up" style={{ animationDelay: '300ms' }}>
                    <p className="text-gray-400 font-medium text-center">
                        <span className="block mb-2">📊</span>
                        Area Grafik Arus Kas<br />(Akan diintegrasikan nanti)
                    </p>
                </div>

                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm min-h-[300px] flex flex-col animate-slide-up" style={{ animationDelay: '400ms' }}>
                    <h3 className="font-bold text-gray-800 mb-4">Transaksi Terakhir</h3>
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-gray-400 font-medium text-center text-sm">
                            Belum ada transaksi bulan ini.<br />Yuk mulai catat!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};