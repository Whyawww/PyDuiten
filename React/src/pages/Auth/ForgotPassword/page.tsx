import { useState } from 'react';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { apiFetch, ApiError } from '../../../utils/api';
import { InputField } from '../../../../component/ui/InputField';
import { AuthLayout } from '../../../../component/layout/AuthLayout';

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

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
            else setError('Gagal kirim email, coba cek koneksi atau config SMTP lu bro.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Lupa Sandi?" subtitle="Tenang cuy, masukin email lu nanti kita kirim instruksinya.">
            <div className="animate-slide-up">
                {message ? (
                    <div className="bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 p-6 rounded-3xl border border-green-100 dark:border-green-500/20 text-center">
                        <p className="font-bold mb-4">{message}</p>
                        <a href="/login" className="text-sm font-black text-primary underline">Balik ke Login</a>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <InputField
                            label="Email Terdaftar"
                            type="email"
                            placeholder="email@gmail.com"
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
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Kirim Instruksi Reset'}
                        </button>

                        <a href="/login" className="flex items-center justify-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Balik ke Login
                        </a>
                    </form>
                )}
            </div>
        </AuthLayout>
    );
};