import { useState } from 'react';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { apiFetch, ApiError } from '../../../utils/api';
import { InputField } from '../../../../component/ui/InputField';
import { AuthLayout } from '../../../../component/layout/AuthLayout';
import { LanguageSwitcher } from '../../../../component/ui/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { t } = useTranslation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await apiFetch<{ message: string }>('/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ email }),
            });
            setMessage(res.message);
        } catch (err: unknown) {
            if (err instanceof ApiError) setError(err.message);
            else setError(t('forgot_password.err_fallback'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative">
            <div className="absolute top-6 right-6 z-50">
                <LanguageSwitcher />
            </div>

            <AuthLayout title={t('forgot_password.title')} subtitle={t('forgot_password.subtitle')}>
                <div className="animate-slide-up">
                    {message ? (
                        <div className="bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 p-6 rounded-3xl border border-green-100 dark:border-green-500/20 text-center">
                            <p className="font-bold mb-4">{message}</p>
                            <a href="/login" className="text-sm font-black text-primary underline">
                                {t('forgot_password.back_to_login')}
                            </a>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <InputField
                                label={t('forgot_password.email_label')}
                                type="email"
                                placeholder={t('forgot_password.email_placeholder')}
                                icon={<Mail className="w-5 h-5" />}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            {error && <p className="text-red-500 text-xs font-bold ml-1">{error}</p>}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary text-white font-bold py-4 rounded-2xl hover:shadow-lg transition-all flex justify-center items-center gap-2"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('forgot_password.btn_submit')}
                            </button>

                            <a href="/login" className="flex items-center justify-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-colors">
                                <ArrowLeft className="w-4 h-4" /> {t('forgot_password.back_to_login')}
                            </a>
                        </form>
                    )}
                </div>
            </AuthLayout>
        </div>
    );
};