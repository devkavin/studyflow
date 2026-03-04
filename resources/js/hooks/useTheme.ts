import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type ThemePreference = Theme | 'system';

const STORAGE_KEY = 'studyflow-theme';

function getSystemTheme(): Theme {
    if (typeof window === 'undefined') {
        return 'light';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function useTheme() {
    const [systemTheme, setSystemTheme] = useState<Theme>(() => getSystemTheme());
    const [themePreference, setThemePreference] = useState<ThemePreference>(() => {
        if (typeof window === 'undefined') {
            return 'system';
        }

        const storedTheme = window.localStorage.getItem(STORAGE_KEY);

        if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
            return storedTheme;
        }

        return 'system';
    });

    const theme = themePreference === 'system' ? systemTheme : themePreference;

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const onChange = (event: MediaQueryListEvent) => {
            setSystemTheme(event.matches ? 'dark' : 'light');
        };

        mediaQuery.addEventListener('change', onChange);

        return () => mediaQuery.removeEventListener('change', onChange);
    }, []);

    useEffect(() => {
        applyTheme(theme);
        window.localStorage.setItem(STORAGE_KEY, themePreference);
    }, [theme, themePreference]);

    return {
        isDark: theme === 'dark',
        theme,
        themePreference,
        toggleTheme: () =>
            setThemePreference((current) => {
                if (current === 'system') {
                    return theme === 'dark' ? 'light' : 'dark';
                }

                return current === 'dark' ? 'light' : 'dark';
            }),
        setThemePreference,
    };
}
