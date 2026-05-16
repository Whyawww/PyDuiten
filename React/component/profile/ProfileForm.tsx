import { Mail, Phone, Lock, User as UserIcon, Save, Loader2 } from 'lucide-react';
import { InputField } from '../ui/InputField';
import { useTranslation } from 'react-i18next';

interface ProfileFormProps {
    name: string;
    email: string;
    phone: string;
    password?: string;
    isLoading: boolean;
    onChange: (field: string, value: string) => void;
}

export const ProfileForm = ({ name, email, phone, password, isLoading, onChange }: ProfileFormProps) => {
    const { t } = useTranslation();

    return (
        <div className="flex-1 space-y-2">
            <InputField
                label={t('profile.label_username')}
                type="text"
                value={name}
                onChange={(e) => onChange('name', e.target.value)}
                placeholder={t('profile.placeholder_name')}
                icon={<UserIcon className="w-5 h-5" />}
                disabled={isLoading}
            />

            <InputField
                label={t('profile.label_email')}
                type="email"
                value={email}
                onChange={(e) => onChange('email', e.target.value)}
                placeholder="contoh@gmail.com"
                icon={<Mail className="w-5 h-5" />}
                disabled={isLoading}
            />

            <InputField
                label={t('profile.label_phone')}
                type="tel"
                value={phone}
                onChange={(e) => onChange('phone', e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="081234567890"
                icon={<Phone className="w-5 h-5" />}
                disabled={isLoading}
            />

            <InputField
                label={t('profile.label_password')}
                type="password"
                value={password}
                onChange={(e) => onChange('password', e.target.value)}
                placeholder={t('profile.placeholder_password')}
                icon={<Lock className="w-5 h-5" />}
                disabled={isLoading}
            />

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full md:w-auto ml-auto flex items-center justify-center gap-2 text-white font-bold px-8 py-3.5 rounded-2xl transition-all duration-300 active:scale-95 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5'
                        }`}
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {isLoading ? t('profile.btn_saving') : t('profile.btn_save')}
                </button>
            </div>
        </div>
    );
};