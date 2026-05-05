import { useEffect, useReducer, useCallback } from 'react';
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

interface FormState {
    type: 'income' | 'expense';
    amount: string;
    note: string;
}

const INITIAL_FORM: FormState = {
    type: 'expense',
    amount: '',
    note: '',
};

type FormAction =
    | { type: 'SET_TYPE'; payload: 'income' | 'expense' }
    | { type: 'SET_AMOUNT'; payload: string }
    | { type: 'SET_NOTE'; payload: string }
    | { type: 'POPULATE'; payload: FormState }
    | { type: 'RESET' };

const formReducer = (state: FormState, action: FormAction): FormState => {
    switch (action.type) {
        case 'SET_TYPE':   return { ...state, type: action.payload };
        case 'SET_AMOUNT': return { ...state, amount: action.payload };
        case 'SET_NOTE':   return { ...state, note: action.payload };
        case 'POPULATE':   return action.payload;
        case 'RESET':      return INITIAL_FORM;
        default:           return state;
    }
};

export const TransactionForm = ({ onAdd, editData, onUpdate, onCancelEdit }: FormProps) => {
    const [form, dispatch] = useReducer(formReducer, INITIAL_FORM);

    useEffect(() => {
        if (!editData) {
            dispatch({ type: 'RESET' });
            return;
        }

        const timer = setTimeout(() => {
            dispatch({
                type: 'POPULATE',
                payload: {
                    type: editData.type,
                    amount: String(editData.amount),
                    note: editData.note,
                },
            });
        }, 10);

        window.scrollTo({ top: 0, behavior: 'smooth' });
        return () => clearTimeout(timer);
    }, [editData]); // ✅ ESLint happy, dispatch stabil secara referensi

    const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, '');
        dispatch({ type: 'SET_AMOUNT', payload: raw });
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.amount || !form.note) return;

        const transactionData: TransactionItem = {
            id: editData?.id ?? Date.now().toString(),
            type: form.type,
            amount: Number(form.amount),
            note: form.note,
            date: editData?.date ?? new Date().toISOString(),
        };

        if (editData && onUpdate) {
            onUpdate(editData.id, transactionData);
        } else {
            onAdd(transactionData);
        }

        dispatch({ type: 'RESET' });
    };

    const handleCancel = useCallback(() => {
        dispatch({ type: 'RESET' });
        onCancelEdit?.();
    }, [onCancelEdit]);

    const displayAmount = form.amount
        ? new Intl.NumberFormat('id-ID').format(Number(form.amount))
        : '';

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
                    <button
                        type="button"
                        onClick={() => dispatch({ type: 'SET_TYPE', payload: 'expense' })}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${form.type === 'expense' ? 'bg-white text-red-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <MinusCircle className="w-4 h-4" /> Pengeluaran
                    </button>
                    <button
                        type="button"
                        onClick={() => dispatch({ type: 'SET_TYPE', payload: 'income' })}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${form.type === 'income' ? 'bg-white text-green-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
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
                            value={form.note}
                            onChange={(e) => dispatch({ type: 'SET_NOTE', payload: e.target.value })}
                            placeholder="Contoh: Beli Kopi"
                            className="bg-surface/50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className={`w-full text-white font-bold py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-md transition-all flex items-center justify-center gap-2 ${editData ? 'bg-blue-500' : 'bg-primary'}`}
                >
                    <Check className="w-5 h-5" /> {editData ? 'Update Transaksi' : 'Simpan Transaksi'}
                </button>
            </form>
        </div>
    );
};