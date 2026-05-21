import { useState, useCallback, useRef } from 'react';
import { Trash2, Target, Pencil, Check, X, ChevronUp, ChevronDown, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import type { WishlistItem } from '../../src/pages/WishList/page';

interface ItemsProps {
    items: WishlistItem[];
    currentBalance: number;
    onDelete: (id: string) => void;
    onEdit: (id: string, name: string, budget: number) => void;
    onReorder: (id: string, direction: 'up' | 'down') => void;
    onToggleAchieved: (id: string) => void;
    formatRp: (val: number) => string;
}

interface EditRowProps {
    item: WishlistItem;
    formatRp: (val: number) => string;
    onSave: (id: string, name: string, budget: number) => void;
    onCancel: () => void;
}

const EditRow = ({ item, formatRp, onSave, onCancel }: EditRowProps) => {
    const { t } = useTranslation();
    const [name, setName] = useState(item.name);
    const [budgetRaw, setBudgetRaw] = useState(String(item.budget));

    const displayBudget = budgetRaw
        ? formatRp(Number(budgetRaw.replace(/[^0-9]/g, '')))
            .replace('Rp', '')
            .trim()
        : '';

    const handleSave = () => {
        const budget = Number(budgetRaw.replace(/[^0-9]/g, ''));
        if (!name.trim() || budget <= 0) return;
        onSave(item.id, name.trim(), budget);
    };

    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
            <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') onCancel(); }}
                className="flex-1 bg-surface dark:bg-gray-900 border border-primary/40 rounded-xl
                    px-4 py-2.5 text-sm font-semibold text-gray-800 dark:text-gray-200
                    focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                placeholder={item.name}
            />
            <input
                value={displayBudget}
                inputMode="numeric"
                onChange={(e) => setBudgetRaw(e.target.value.replace(/[^0-9]/g, ''))}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') onCancel(); }}
                className="flex-1 bg-surface dark:bg-gray-900 border border-primary/40 rounded-xl
                    px-4 py-2.5 text-sm font-semibold text-gray-800 dark:text-gray-200
                    focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                placeholder="Budget"
            />
            <div className="flex gap-2">
                <button
                    onClick={handleSave}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5
                        bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold
                        hover:bg-primary/90 active:scale-95 transition-all"
                >
                    <Check className="w-4 h-4" />
                    {t('wishlist.btn_save_edit')}
                </button>
                <button
                    onClick={onCancel}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5
                        bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300
                        px-4 py-2.5 rounded-xl text-sm font-bold
                        hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95 transition-all"
                >
                    <X className="w-4 h-4" />
                    {t('wishlist.btn_cancel')}
                </button>
            </div>
        </div>
    );
};

export const WishlistItems = ({
    items,
    currentBalance,
    onDelete,
    onEdit,
    onReorder,
    onToggleAchieved,
    formatRp,
}: ItemsProps) => {
    const { t } = useTranslation();
    const [editingId, setEditingId] = useState<string | null>(null);
    const confettiFiredRef = useRef<Set<string>>(new Set());

    const fireConfetti = useCallback(() => {
        confetti({ particleCount: 80, spread: 70, origin: { x: 0.3, y: 0.6 }, colors: ['#e07a5f', '#81b29a', '#f2cc8f'] });
        confetti({ particleCount: 80, spread: 70, origin: { x: 0.7, y: 0.6 }, colors: ['#e07a5f', '#81b29a', '#f2cc8f'] });
    }, []);

    const handleToggleAchieved = useCallback((item: WishlistItem) => {
        const willAchieve = !item.isAchieved;
        onToggleAchieved(item.id);
        if (willAchieve && !confettiFiredRef.current.has(item.id)) {
            confettiFiredRef.current.add(item.id);
            fireConfetti();
        }
    }, [onToggleAchieved, fireConfetti]);

    const handleSaveEdit = useCallback((id: string, name: string, budget: number) => {
        onEdit(id, name, budget);
        setEditingId(null);
    }, [onEdit]);

    const sorted = [...items].sort((a, b) => a.priority - b.priority);

    if (items.length === 0) {
        return (
            <div className="text-center py-12 bg-white/50 dark:bg-gray-800/50 rounded-3xl
                border border-dashed border-gray-300 dark:border-gray-700 animate-fade-in">
                <Target className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium max-w-sm mx-auto leading-relaxed">
                    {t('wishlist.empty')}
                </p>
            </div>
        );
    }

    return (
        <section aria-label="Daftar Wishlist" className="space-y-3">
            {sorted.map((item, index) => {
                const isEditing = editingId === item.id;
                const canAfford = currentBalance >= item.budget;

                return (
                    <article
                        key={item.id}
                        className={`group bg-white dark:bg-gray-800 border rounded-2xl p-4 shadow-sm
                            transition-all duration-300 animate-slide-up
                            ${item.isAchieved
                                ? 'border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-900/10'
                                : 'border-gray-100 dark:border-gray-700 hover:border-primary/30'
                            }`}
                        style={{ animationDelay: `${index * 60}ms` }}
                    >
                        {isEditing ? (
                            <EditRow
                                item={item}
                                formatRp={formatRp}
                                onSave={handleSaveEdit}
                                onCancel={() => setEditingId(null)}
                            />
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col gap-0.5 shrink-0 opacity-0 group-hover:opacity-100
                                    focus-within:opacity-100 transition-opacity duration-200">
                                    <button
                                        onClick={() => onReorder(item.id, 'up')}
                                        disabled={index === 0}
                                        aria-label={t('wishlist.btn_move_up')}
                                        className="p-1 rounded-lg text-gray-300 dark:text-gray-600
                                            hover:text-primary hover:bg-primary/10
                                            disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => onReorder(item.id, 'down')}
                                        disabled={index === sorted.length - 1}
                                        aria-label={t('wishlist.btn_move_down')}
                                        className="p-1 rounded-lg text-gray-300 dark:text-gray-600
                                            hover:text-primary hover:bg-primary/10
                                            disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronDown className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <div className={`w-1.5 h-12 rounded-full shrink-0 transition-colors duration-300
                                    ${item.isAchieved ? 'bg-green-400' : 'bg-primary/20 group-hover:bg-primary'}`}
                                />

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className={`font-bold text-base leading-tight transition-colors
                                            ${item.isAchieved
                                                ? 'text-green-600 dark:text-green-400 line-through decoration-green-400/60'
                                                : 'text-gray-800 dark:text-gray-200'
                                            }`}>
                                            {item.name}
                                        </h3>
                                        {item.isAchieved && (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold
                                                bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400
                                                px-2 py-0.5 rounded-full">
                                                <Trophy className="w-3 h-3" />
                                                {t('wishlist.achieved_label')}
                                            </span>
                                        )}
                                        {!item.isAchieved && canAfford && (
                                            <span className="text-[10px] font-bold bg-primary/10 text-primary
                                                px-2 py-0.5 rounded-full">
                                                Saldo cukup!
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-sm font-semibold mt-0.5 transition-colors
                                        ${item.isAchieved ? 'text-green-500/70' : 'text-primary'}`}>
                                        {formatRp(item.budget)}
                                    </p>
                                </div>

                                {/* Action buttons */}
                                <div className="flex items-center gap-1 shrink-0 opacity-100 lg:opacity-0
                                    group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
                                    <button
                                        onClick={() => handleToggleAchieved(item)}
                                        aria-label={item.isAchieved ? t('wishlist.unmark_achieved') : t('wishlist.mark_achieved')}
                                        className={`p-2.5 rounded-xl transition-all
                                            ${item.isAchieved
                                                ? 'text-green-500 bg-green-50 dark:bg-green-900/20 hover:bg-green-100'
                                                : 'text-gray-300 dark:text-gray-600 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10'
                                            }`}
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>

                                    {!item.isAchieved && (
                                        <button
                                            onClick={() => setEditingId(item.id)}
                                            aria-label={t('wishlist.btn_edit')}
                                            className="p-2.5 text-gray-300 dark:text-gray-600 hover:text-blue-500
                                                hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                    )}

                                    <button
                                        onClick={() => onDelete(item.id)}
                                        aria-label="Hapus wishlist"
                                        className="p-2.5 text-gray-300 dark:text-gray-600 hover:text-red-500
                                            hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </article>
                );
            })}
        </section>
    );
};