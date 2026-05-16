import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import React from 'react';

export const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('pyduiten_lng', lng);
        setIsOpen(false);
    };

    const currentLang = i18n.language;

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
                {currentLang === 'id' ? <FlagID /> : <FlagEN />}
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase">
                    {currentLang}
                </span>
            </button>

            <div
                className={`absolute right-0 mt-2 w-32 origin-top-right rounded-xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-out z-50
                ${isOpen ? 'transform opacity-100 scale-100 translate-y-0' : 'transform opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
            >
                <div className="p-1">
                    <button
                        onClick={() => changeLanguage('id')}
                        className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors
                        ${currentLang === 'id' ? 'bg-primary/10 text-primary font-bold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                        <FlagID /> Indonesia
                    </button>
                    <button
                        onClick={() => changeLanguage('en')}
                        className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors
                        ${currentLang === 'en' ? 'bg-primary/10 text-primary font-bold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                        <FlagEN /> English
                    </button>
                </div>
            </div>
        </div>
    );
};

const FlagID = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" className="w-5 h-auto rounded-sm overflow-hidden shadow-sm">
        <rect width="3" height="2" fill="#fff" />
        <rect width="3" height="1" fill="#ce1126" />
    </svg>
);

const FlagEN = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="w-5 h-auto rounded-sm overflow-hidden shadow-sm">
        <clipPath id="s">
            <path d="M0,0 v30 h60 v-30 z" />
        </clipPath>
        <clipPath id="t">
            <path d="M30,15 h30 v15 z v-15 h-30 z h-30 v-15 z v15 h30 z" />
        </clipPath>
        <g clipPath="url(#s)">
            <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
            <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
            <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
            <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
        </g>
    </svg>
);