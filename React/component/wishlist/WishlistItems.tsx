import { Trash2, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { WishlistItem } from '../../src/pages/WishList/page';

interface ItemsProps {
    items: WishlistItem[];
    onDelete: (id: string) => void;
    formatRp: (val: number) => string;
}

export const WishlistItems = ({ items, onDelete, formatRp }: ItemsProps) => {
    const { t } = useTranslation();

    if (items.length === 0) {
        return (
            <div className="text-center py-12 bg-white/50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 animate-fade-in" style={{ animationDelay: '300ms' }}>
                <Target className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium max-w-sm mx-auto leading-relaxed">
                    {t('wishlist.empty')}
                </p>
            </div>
        );
    }

    return (
        <section aria-label="Daftar Wishlist" className="space-y-4">
            {items.map((item, index) => (
                <article
                    key={item.id}
                    className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:border-primary/30 transition-all flex justify-between items-center animate-slide-up"
                    style={{ animationDelay: `${300 + (index * 100)}ms` }} // Animasi bertahap (Staggered)
                >
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-10 bg-primary/20 rounded-full group-hover:bg-primary transition-colors" />
                        <div>
                            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg leading-tight">{item.name}</h3>
                            <p className="text-sm font-semibold text-primary mt-0.5">{formatRp(item.budget)}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => onDelete(item.id)}
                        aria-label="Hapus wishlist"
                        className="p-3 text-gray-300 dark:text-gray-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all opacity-100 lg:opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </article>
            ))}
        </section>
    );
};