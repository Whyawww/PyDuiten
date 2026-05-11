import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import { AuthLayout } from '../../../../component/layout/AuthLayout';
import { InputField } from '../../../../component/ui/InputField';
import { SocialButton } from '../../../../component/ui/SocialButton';
import { apiFetch, ApiError } from '../../../utils/api';
import { ConfirmModal } from '../../../../component/transaction/ConfirmModal';
import { LegalModal } from '../../../../component/ui/LegalModal';
import { PrivacyContent, TermsContent } from '../../../../component/ui/LegalContent';

export const Register = () => {
    const navigate = useNavigate();

    // State form
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // State UI
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modal, setModal] = useState<{ open: boolean, type: 'privacy' | 'terms' }>({ open: false, type: 'privacy' });

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (!name || !email || !password) {
            setErrorMsg('Tolong isi semua kolom ya bro!');
            return;
        }

        if (password.length < 6) {
            setErrorMsg('Password minimal 6 karakter cuy!');
            return;
        }

        setIsLoading(true);

        try {
            await apiFetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password }),
            });

            setShowSuccessModal(true);

        } catch (error: unknown) {
            if (error instanceof ApiError) {
                setErrorMsg(error.message);
            } else if (error instanceof Error) {
                setErrorMsg(error.message);
            } else {
                setErrorMsg('Terjadi kesalahan yang tidak diketahui.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccessConfirm = () => {
        setShowSuccessModal(false);
        navigate('/login');
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
        <AuthLayout title="Gabung PyDuiten Sekarang!" subtitle="Satu langkah lagi buat tobat finansial. Daftarin diri lu di bawah.">

            <LegalModal
                isOpen={modal.open}
                onClose={() => setModal({ ...modal, open: false })}
                title={modal.type === 'privacy' ? 'Kebijakan Privasi' : 'Syarat & Ketentuan'}
                content={modal.type === 'privacy' ? <PrivacyContent /> : <TermsContent />}
            />

            <ConfirmModal
                isOpen={showSuccessModal}
                type="success"
                title="Pendaftaran Berhasil!"
                message="Akun lu udah aktif dan siap dipakai buat nyatet keuangan. Gas login sekarang bro!"
                confirmText="Lanjut Login"
                onConfirm={handleSuccessConfirm}
            />

            <form onSubmit={handleRegister} className="w-full">
                <SocialButton icon={GoogleIcon} text="Daftar cepat dengan Google" type="button" />

                <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="text-sm font-medium text-gray-400">ATAU</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                {errorMsg && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-sm font-medium text-center">
                        {errorMsg}
                    </div>
                )}

                <InputField
                    label="Nama Lengkap"
                    type="text"
                    placeholder="Wahyu Aji Nusantara"
                    icon={<User className="w-5 h-5" />}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <InputField
                    label="Alamat Email"
                    type="email"
                    placeholder="contoh@gmail.com"
                    icon={<Mail className="w-5 h-5" />}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <InputField
                    label="Kata Sandi"
                    type="password"
                    placeholder="Minimal 8 karakter"
                    icon={<Lock className="w-5 h-5" />}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex justify-center items-center gap-2 w-full text-white font-bold px-6 py-4 rounded-2xl shadow-md transition-all duration-300 mt-4 mb-6 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:shadow-lg hover:-translate-y-1 active:scale-95'
                        }`}
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Buat Akun'}
                </button>

                <p className="text-[10px] text-gray-400 mt-4 text-center leading-relaxed">
                    Dengan buat akun, lu setuju sama
                    <button
                        type="button"
                        onClick={() => setModal({ open: true, type: 'terms' })}
                        className="text-primary font-bold hover:underline mx-1"
                    >
                        Syarat & Ketentuan
                    </button>
                    dan
                    <button
                        type="button"
                        onClick={() => setModal({ open: true, type: 'privacy' })}
                        className="text-primary font-bold hover:underline mx-1"
                    >
                        Kebijakan Privasi
                    </button> kita.
                </p>

                <p className="text-center text-gray-600 font-medium">
                    Udah punya akun? <a href="/login" className="text-primary font-bold hover:underline">Masuk di sini</a>
                </p>
            </form>
        </AuthLayout>
    );
};