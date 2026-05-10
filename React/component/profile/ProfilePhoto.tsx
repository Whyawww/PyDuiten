import { useRef } from 'react';
import type { ChangeEvent } from 'react';
import { Camera, User as UserIcon } from 'lucide-react';
import { API_BASE_URL } from '../../src/utils/api';

interface ProfilePhotoProps {
    photoPreview: string | null;
    onPhotoSelected: (file: File, previewUrl: string) => void;
}

export const ProfilePhoto = ({ photoPreview, onPhotoSelected }: ProfilePhotoProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onPhotoSelected(file, reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const displayPhoto = photoPreview?.startsWith('/uploads')
        ? `${API_BASE_URL}${photoPreview}`
        : photoPreview;

    return (
        <div className="flex flex-col items-center md:w-1/3">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-surface dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-700/50 shadow-md transition-transform duration-300 group-hover:scale-105">
                    {displayPhoto ? (
                        <img src={displayPhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/5 dark:bg-primary/10 text-primary">
                            <UserIcon className="w-16 h-16 opacity-50 dark:opacity-70" />
                        </div>
                    )}
                </div>

                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                    <Camera className="w-8 h-8 text-white" />
                </div>

                <div className="absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full shadow-lg border-2 border-white">
                    <Camera className="w-4 h-4" />
                </div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
            <p className="mt-4 text-xs font-semibold text-gray-400 dark:text-gray-500 text-center">Format: JPG, PNG.<br />Maksimal 2MB (Opsional)</p>
        </div>
    );
};