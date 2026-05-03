import { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Filter } from 'lucide-react';
import type { TransactionItem } from './TransactionForm';

export const TransactionHistory = ({ transactions }: { transactions: TransactionItem[] }) => {
    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };

    const filteredTransactions = transactions.filter((trx) => {
        if (filterType === 'all') return true;
        return trx.type === filterType;
    });

    if (transactions.length === 0) {
        return (
            <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm animate-slide-up" style={{ animationDelay: '100ms' }}>
                <p className="text-gray-400 font-medium">Belum ada transaksi. Yuk mulai catat!</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-800">Riwayat Terakhir</h3>

                <div className="flex items-center gap-2 bg-surface/50 border border-gray-200 rounded-xl px-3 py-1.5">
                    <Filter className="w-3.5 h-3.5 text-gray-400" />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
                        className="bg-transparent text-xs font-bold text-gray-600 outline-none cursor-pointer"
                    >
                        <option value="all">Semua Transaksi</option>
                        <option value="income">Pemasukan Aja</option>
                        <option value="expense">Pengeluaran Aja</option>
                    </select>
                </div>
            </div>

            <div className="space-y-3">
                {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((trx) => (
                        <div key={trx.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className={`p-2.5 rounded-xl ${trx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                                    {trx.type === 'income' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">{trx.note}</p>
                                    <p className="text-xs text-gray-400">{new Date(trx.date).toLocaleDateString('id-ID')}</p>
                                </div>
                            </div>
                            <p className={`font-bold ${trx.type === 'income' ? 'text-green-600' : 'text-gray-800'}`}>
                                {trx.type === 'income' ? '+' : '-'}{formatRupiah(trx.amount)}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-4">
                        <p className="text-sm text-gray-400 font-medium">Ngga ada transaksi di kategori ini.</p>
                    </div>
                )}
            </div>
        </div>
    );
};