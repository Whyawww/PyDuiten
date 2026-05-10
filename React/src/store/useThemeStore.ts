import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
    theme: Theme;
    toggleTheme: () => void;
    initTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
    theme: (localStorage.getItem('theme') as Theme) || 'light',
    
    toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        
        return { theme: newTheme };
    }),

    initTheme: () => {
        const savedTheme = (localStorage.getItem('theme') as Theme) || 'light';
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
}));