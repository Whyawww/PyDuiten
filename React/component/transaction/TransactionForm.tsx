import { useState, useEffect } from 'react';
import { PlusCircle, MinusCircle, Check, X } from 'lucide-react';

export interface TransactionItem {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    note: string;
    date: string;
}

interface FormProps {
    onAdd: (data: TransactionItem) => void;
    editData?: TransactionItem | null;
    onUpdate?: (id: string, data: TransactionItem) => void;
    onCancelEdit?: () => void;
}

export const TransactionForm = ({ onAdd, editData, onUpdate, onCancelEdit }: FormProps) => {
    const [type, setType] = useState<'income' | 'expense'>(editData?.type || 'expense');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');

    useEffect(() => {
        if (editData) {
            const timer = setTimeout(() => {
                setType(editData.type);
                setAmount(String(editData.amount));
                setNote(editData.note);
            }, 10);

            window.scrollTo({ top: 0, behavior: 'smooth' });
            return () => clearTimeout(timer);
        } else {
            setType('expense');
            setAmount('');
            setNote('');
        }
    }, [editData]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, '');
        setAmount(rawValue);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !note) return;

        const transactionData: TransactionItem = {
            id: editData ? editData.id : Date.now().toString(),
            type,
            amount: Number(amount),
            note,
            date: editData ? editData.date : new Date().toISOString()
        };

        if (editData && onUpdate) {
            onUpdate(editData.id, transactionData);
        } else {
            onAdd(transactionData);
        }

        setAmount('');
        setNote('');
        setType('expense');
    };

    const handleCancel = () => {
        setAmount('');
        setNote('');
        setType('expense');
        if (onCancelEdit) onCancelEdit();
    };

    const displayAmount = amount ? new Intl.NumberFormat('id-ID').format(Number(amount)) : '';

    return (
        <div className={`bg-white rounded-3xl p-6 shadow-sm border mb-6 transition-all duration-300 ${editData ? 'border-blue-400 ring-4 ring-blue-50' : 'border-gray-100'}`}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                    {editData ? 'Edit Transaksi' : 'Catat Transaksi'}
                </h2>
                {editData && (
                    <button onClick={handleCancel} className="text-gray-400 hover:text-red-500 flex items-center gap-1 text-sm font-bold">
                        <X className="w-4 h-4" /> Batal
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex bg-surface p-1.5 rounded-2xl">
                    <button type="button" onClick={() => setType('expense')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${type === 'expense' ? 'bg-white text-red-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                        <MinusCircle className="w-4 h-4" /> Pengeluaran
                    </button>
                    <button type="button" onClick={() => setType('income')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${type === 'income' ? 'bg-white text-green-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                        <PlusCircle className="w-4 h-4" /> Pemasukan
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 ml-1">Nominal (Rp)</label>
                        <input type="text" inputMode="numeric" value={displayAmount} onChange={handleAmountChange} placeholder="Contoh: 50.000" className="bg-surface/50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 ml-1">Keterangan</label>
                        <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Contoh: Beli Kopi" className="bg-surface/50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                    </div>
                </div>

                <button type="submit" className={`w-full text-white font-bold py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-md transition-all flex items-center justify-center gap-2 ${editData ? 'bg-blue-500' : 'bg-primary'}`}>
                    <Check className="w-5 h-5" /> {editData ? 'Update Transaksi' : 'Simpan Transaksi'}
                </button>
            </form>
        </div>
    );
};