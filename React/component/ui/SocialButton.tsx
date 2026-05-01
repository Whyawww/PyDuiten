

interface SocialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon: ReactNode;
    text: string;
}

export const SocialButton = ({ icon, text, ...props }: SocialButtonProps) => {
    return (
        <button
            {...props}
            className="flex items-center justify-center gap-3 w-full bg-white border border-gray-200 text-gray-700 font-bold px-6 py-3.5 rounded-2xl hover:bg-gray-50 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300 active:scale-95 mb-4"
        >
            {icon}
            {text}
        </button>
    );
};
