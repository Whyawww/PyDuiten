import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { apiFetch, ApiError } from '../../utils/api';
import { ConfirmModal } from '../../../component/transaction/ConfirmModal';
import { ProfilePhoto } from '../../../component/profile/ProfilePhoto';
import { ProfileForm } from '../../../component/profile/ProfileForm';
import type { User } from '../../store/useAuthStore';

export const ProfilePage = () => {
    const { user, updateUser } = useAuthStore();

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        password: '',
    });

    const [photoPreview, setPhotoPreview] = useState<string | null>(user?.photo || null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePhotoSelected = (file: File, previewUrl: string) => {
        setSelectedFile(file);
        setPhotoPreview(previewUrl);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (!formData.name || !formData.email || !formData.phone) {
            setErrorMsg('Username, Email, dan No HP wajib diisi cuy!');
            return;
        }

        setIsLoading(true);

        try {
            const apiFormData = new FormData();
            apiFormData.append('name', formData.name);
            apiFormData.append('email', formData.email);
            apiFormData.append('phone', formData.phone);
            if (formData.password) apiFormData.append('password', formData.password);
            if (selectedFile) apiFormData.append('photo', selectedFile);

            const response = await apiFetch<{ status: string, data: User }>('/users/profile', {
                method: 'PATCH',
                body: apiFormData,
            });

            updateUser(response.data);

            setFormData(prev => ({ ...prev, password: '' }));
            setShowSuccess(true);
        } catch (error: unknown) {
            if (error instanceof ApiError) setErrorMsg(error.message);
            else setErrorMsg('Gagal nyimpen profil, coba lagi nanti cuy.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-8 animate-fade-in relative pb-32 md:pb-24 min-h-screen">
            <ConfirmModal
                isOpen={showSuccess}
                type="success"
                title="Profil Diperbarui!"
                message="Data profil lu berhasil disimpan dengan aman di database."
                confirmText="Oke, Mantap"
                onConfirm={() => setShowSuccess(false)}
            />

            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight">Profil Gua</h1>
                <p className="text-gray-500 font-medium mt-1">Atur data diri dan foto profil lu di sini.</p>
            </div>

            {errorMsg && (
                <div className="max-w-4xl bg-red-50 text-red-500 p-4 rounded-2xl mb-6 text-sm font-bold border border-red-100 animate-slide-in-right">
                    {errorMsg}
                </div>
            )}

            <form onSubmit={handleSave} className="max-w-4xl bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-10 animate-slide-up">
                <ProfilePhoto
                    photoPreview={photoPreview}
                    onPhotoSelected={handlePhotoSelected}
                />

                <ProfileForm
                    {...formData}
                    isLoading={isLoading}
                    onChange={handleChange}
                />
            </form>
        </div>
    );
};