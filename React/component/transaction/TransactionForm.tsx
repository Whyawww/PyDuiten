import { useEffect, useReducer, useCallback } from 'react';
import { PlusCircle, MinusCircle, Check, X, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface TransactionItem {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    note: string;
    date: string;
    category?: string;
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
    category: string;
}

const EXPENSE_CATEGORIES = [
    'Makanan & Minuman', 'Transportasi', 'Listrik', 'Air PDAM',
    'Pulsa & Kuota', 'Hiburan', 'Belanja', 'Kesehatan',
    'Pendidikan', 'Cicilan', 'Lainnya'
];

const INCOME_CATEGORIES = [
    'Gaji', 'Bonus', 'Hasil Usaha', 'Investasi',
    'Pemberian/Hadiah', 'Lainnya'
];

const INITIAL_FORM: FormState = {
    type: 'expense',
    amount: '',
    note: '',
    category: EXPENSE_CATEGORIES[0],
};

type FormAction =
    | { type: 'SET_TYPE'; payload: 'income' | 'expense' }
    | { type: 'SET_AMOUNT'; payload: string }
    | { type: 'SET_NOTE'; payload: string }
    | { type: 'SET_CATEGORY'; payload: string }
    | { type: 'POPULATE'; payload: FormState }
    | { type: 'RESET' };

const formReducer = (state: FormState, action: FormAction): FormState => {
    switch (action.type) {
        case 'SET_TYPE':
            return {
                ...state,
                type: action.payload,
                category: action.payload === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]
            };
        case 'SET_AMOUNT': return { ...state, amount: action.payload };
        case 'SET_NOTE': return { ...state, note: action.payload };
        case 'SET_CATEGORY': return { ...state, category: action.payload };
        case 'POPULATE': return action.payload;
        case 'RESET': return INITIAL_FORM;
        default: return state;
    }
};

export const TransactionForm = ({ onAdd, editData, onUpdate, onCancelEdit }: FormProps) => {
    const [form, dispatch] = useReducer(formReducer, INITIAL_FORM);
    const { t } = useTranslation();

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
                    category: editData.category || (editData.type === 'expense' ? 'Lainnya' : 'Lainnya'),
                },
            });
        }, 10);

        window.scrollTo({ top: 0, behavior: 'smooth' });
        return () => clearTimeout(timer);
    }, [editData]);

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
            category: form.category,
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

    const displayAmount = form.amount ? new Intl.NumberFormat('id-ID').format(Number(form.amount)) : '';
    const currentCategories = form.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border mb-6 transition-all duration-300 ${editData ? 'border-blue-400 ring-4 ring-blue-50 dark:ring-blue-900/20' : 'border-gray-100 dark:border-gray-700'}`}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    {editData ? t('transaction.form_edit') : t('transaction.form_add')}
                </h2>
                {editData && (
                    <button onClick={handleCancel} className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 flex items-center gap-1 text-sm font-bold">
                        <X className="w-4 h-4" /> {t('transaction.btn_cancel')}
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex bg-surface dark:bg-gray-900 p-1.5 rounded-2xl">
                    <button
                        type="button"
                        onClick={() => dispatch({ type: 'SET_TYPE', payload: 'expense' })}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${form.type === 'expense' ? 'bg-white dark:bg-gray-800 text-red-500 dark:text-red-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                    >
                        <MinusCircle className="w-4 h-4" /> {t('transaction.type_expense')}
                    </button>
                    <button
                        type="button"
                        onClick={() => dispatch({ type: 'SET_TYPE', payload: 'income' })}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${form.type === 'income' ? 'bg-white dark:bg-gray-800 text-green-500 dark:text-green-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                    >
                        <PlusCircle className="w-4 h-4" /> {t('transaction.type_income')}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-1">{t('transaction.label_amount')}</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={displayAmount}
                            onChange={handleAmountChange}
                            placeholder={t('transaction.placeholder_amount')}
                            className="bg-surface/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-1">{t('transaction.label_category')}</label>
                        <div className="relative flex items-center">
                            <Tag className="absolute left-4 text-gray-400 dark:text-gray-500 w-4 h-4" />
                            <select
                                value={form.category}
                                onChange={(e) => dispatch({ type: 'SET_CATEGORY', payload: e.target.value })}
                                className="w-full bg-surface/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none font-medium"
                            >
                                {currentCategories.map(cat => (
                                    <option key={cat} value={cat}>{t(`categories.${cat}`)}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-1">{t('transaction.label_note')}</label>
                    <input
                        type="text"
                        value={form.note}
                        onChange={(e) => dispatch({ type: 'SET_NOTE', payload: e.target.value })}
                        placeholder={t('transaction.placeholder_note')}
                        className="bg-surface/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                </div>

                <button
                    type="submit"
                    className={`w-full text-white font-bold py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-md transition-all flex items-center justify-center gap-2 ${editData ? 'bg-blue-500 dark:bg-blue-600' : 'bg-primary'}`}
                >
                    <Check className="w-5 h-5" /> {editData ? t('transaction.btn_update') : t('transaction.btn_save')}
                </button>
            </form>
        </div>
    );
};