import { useState } from 'react';
import { PlusCircle, Crosshair } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { InputField } from '../../component/ui/InputField';

interface FormProps {
    onAdd: (name: string, budget: number) => void;
    formatRp: (val: number) => string;
}

export const WishlistForm = ({ onAdd, formatRp }: FormProps) => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [budget, setBudget] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const budgetValue = Number(budget.replace(/[^0-9]/g, ''));
        if (!name || budgetValue <= 0) return;

        onAdd(name, budgetValue);
        setName('');
        setBudget('');
    };

    return (
        <section aria-label="Tambah Wishlist Baru" className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 shadow-sm animate-slide-up" style={{ animationDelay: '200ms' }}>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-end gap-4">
                <div className="w-full sm:flex-1">
                    <InputField
                        label={t('wishlist.label_name')}
                        type="text"
                        placeholder={t('wishlist.placeholder_name')}
                        icon={<Crosshair className="w-5 h-5" />}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="w-full sm:flex-1">
                    <InputField
                        label={t('wishlist.label_budget')}
                        type="text"
                        inputMode="numeric"
                        placeholder={t('wishlist.placeholder_budget')}
                        value={budget ? formatRp(Number(budget.replace(/[^0-9]/g, ''))).replace('Rp', '').trim() : ''}
                        onChange={(e) => setBudget(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    disabled={!name || !budget}
                    className="w-full sm:w-auto mb-4 bg-primary text-white font-bold py-3.5 px-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0 transition-all flex items-center justify-center gap-2"
                >
                    <PlusCircle className="w-5 h-5" /> {t('wishlist.btn_add')}
                </button>
            </form>
        </section>
    );
};