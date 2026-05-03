import { useState } from 'react';
import { PlusCircle, MinusCircle, Check } from 'lucide-react';

export interface TransactionItem {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    note: string;
    date: string;
}

export const TransactionForm = ({ onAdd }: { onAdd: (data: TransactionItem) => void }) => {
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, '');
        setAmount(rawValue);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !note) return;

        onAdd({
            id: Date.now().toString(),
            type,
            amount: Number(amount),
            note,
            date: new Date().toISOString()
        });

        setAmount('');
        setNote('');
    };

    const displayAmount = amount ? new Intl.NumberFormat('id-ID').format(Number(amount)) : '';

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6 animate-slide-up">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Catat Transaksi</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex bg-surface p-1.5 rounded-2xl">
                    <button
                        type="button"
                        onClick={() => setType('expense')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${type === 'expense' ? 'bg-white text-red-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <MinusCircle className="w-4 h-4" /> Pengeluaran
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('income')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${type === 'income' ? 'bg-white text-green-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <PlusCircle className="w-4 h-4" /> Pemasukan
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 ml-1">Nominal (Rp)</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={displayAmount}
                            onChange={handleAmountChange}
                            placeholder="Contoh: 50.000"
                            className="bg-surface/50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 ml-1">Keterangan</label>
                        <input
                            type="text"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Contoh: Beli Kopi"
                            className="bg-surface/50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        />
                    </div>
                </div>

                <button type="submit" className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-md transition-all flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" /> Simpan Transaksi
                </button>
            </form>
        </div>
    );
};