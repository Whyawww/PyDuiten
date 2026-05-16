import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { apiFetch, ApiError } from '../../../utils/api';
import { InputField } from '../../../../component/ui/InputField';
import { AuthLayout } from '../../../../component/layout/AuthLayout';
import { LanguageSwitcher } from '../../../../component/ui/LanguageSwitcher';
import { useTranslation } from 'react-i18next'; 

interface ResetResponse {
    status: string;
    message: string;
}

export const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError(t('reset_password.err_length'));
            return;
        }

        setIsLoading(true);
        try {
            await apiFetch<ResetResponse>('/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify({ token, newPassword: password }),
            });

            setIsSuccess(true);
            setTimeout(() => navigate('/login?reset=success'), 2000);
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(t('reset_password.err_fallback'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative">
            <div className="absolute top-6 right-6 z-50">
                <LanguageSwitcher />
            </div>

            <AuthLayout
                title={t('reset_password.title')}
                subtitle={t('reset_password.subtitle')}
            >
                <div className="animate-slide-up">
                    {isSuccess ? (
                        <div className="flex flex-col items-center text-center p-6 bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 rounded-3xl">
                            <div className="p-3 bg-green-500 rounded-full mb-4">
                                <ShieldCheck className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                {t('reset_password.success_title')}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                {t('reset_password.success_desc')}
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleReset} className="space-y-6">
                            <InputField
                                label={t('reset_password.label_password')}
                                type="password"
                                placeholder="••••••••"
                                icon={<Lock className="w-5 h-5" />}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (error) setError('');
                                }}
                                error={error}
                                required
                            />

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full text-white font-bold py-4 rounded-2xl shadow-md transition-all duration-300 flex justify-center items-center gap-2 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:shadow-lg hover:-translate-y-1 active:scale-95'
                                    }`}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    t('reset_password.btn_submit')
                                )}
                            </button>

                            <p className="text-center text-xs text-gray-400 dark:text-gray-500 font-medium flex items-center justify-center gap-2">
                                <AlertCircle className="w-3 h-3" /> {t('reset_password.note_once')}
                            </p>
                        </form>
                    )}
                </div>
            </AuthLayout>
        </div>
    );
};