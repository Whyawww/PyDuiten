import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // [NEW]
import { AuthLayout } from '../../../../component/layout/AuthLayout';
import { InputField } from '../../../../component/ui/InputField';
import { SocialButton } from '../../../../component/ui/SocialButton';
import { apiFetch, ApiError } from '../../../utils/api';
import { useAuthStore } from '../../../store/useAuthStore';
import { WelcomeOverlay } from '../../../../component/ui/WelcomeOverlay';
import { LanguageSwitcher } from '../../../../component/ui/LanguageSwitcher'; // [NEW] Pastiin path lu bener

export const Login = () => {
    const navigate = useNavigate();
    const loginStore = useAuthStore((state) => state.login);
    const { t } = useTranslation(); // [NEW]

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showWelcome, setShowWelcome] = useState(false);
    const [userName, setUserName] = useState('');

    const handleForgotPassword = (e: React.MouseEvent) => {
        e.preventDefault();
        setEmailError('');

        if (!email) {
            setEmailError(t('auth.err_email_empty')); // [FIX] Translate error
            return;
        }

        navigate('/auth/forgot-password', { state: { email } });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (!email || !password) {
            setErrorMsg(t('auth.err_empty')); // [FIX] Translate error
            return;
        }

        setIsLoading(true);

        try {
            const response = await apiFetch<{
                status: string;
                message: string;
                data: { accessToken: string; user: { id: string; email: string; name: string; } };
            }>('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            loginStore(response.data.user, response.data.accessToken);
            setUserName(response.data.user.name);
            setShowWelcome(true);

        } catch (error: unknown) {
            if (error instanceof ApiError) {
                setErrorMsg(error.message); // Biasanya pesan backend dibiarin
            } else if (error instanceof Error) {
                setErrorMsg(error.message);
            } else {
                setErrorMsg(t('auth.err_unknown')); // [FIX] Translate error
            }
        } finally {
            setIsLoading(false);
        }
    };

    const GoogleIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-6 h-6">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        </svg>
    );

    return (
        <div className="relative">
            {/* [NEW] Tombol Language Switcher melayang di pojok layar buat Login */}
            <div className="absolute top-6 right-6 z-50">
                <LanguageSwitcher />
            </div>

            {showWelcome && (
                <WelcomeOverlay
                    username={userName}
                    onDone={() => navigate('/dashboard')}
                />
            )}
            <AuthLayout title={t('auth.login_title')} subtitle={t('auth.login_subtitle')}>
                <form onSubmit={handleLogin} className="w-full">
                    <SocialButton icon={GoogleIcon} text={t('auth.btn_google')} type="button" />

                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-sm font-medium text-gray-400">{t('auth.or')}</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    {errorMsg && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-sm font-medium text-center">
                            {errorMsg}
                        </div>
                    )}

                    <InputField
                        label={t('auth.email_label')}
                        type="email"
                        placeholder={t('auth.email_placeholder')}
                        icon={<Mail className="w-5 h-5" />}
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailError) setEmailError('');
                        }}
                        error={emailError}
                    />

                    <InputField
                        label={t('auth.password_label')}
                        type="password"
                        placeholder={t('auth.password_placeholder')}
                        icon={<Lock className="w-5 h-5" />}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="flex justify-end mb-6">
                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="text-sm font-bold text-primary hover:text-secondary transition-colors"
                        >
                            {t('auth.forgot_password')}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`flex justify-center items-center gap-2 w-full text-white font-bold px-6 py-4 rounded-2xl shadow-md transition-all duration-300 mb-6 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:shadow-lg hover:-translate-y-1 active:scale-95'}`}
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('auth.btn_login')}
                    </button>

                    <p className="text-center text-gray-600 font-medium">
                        {t('auth.no_account')} <a href="/register" className="text-primary font-bold hover:underline">{t('auth.register_here')}</a>
                    </p>
                </form>
            </AuthLayout>
        </div>
    );
};