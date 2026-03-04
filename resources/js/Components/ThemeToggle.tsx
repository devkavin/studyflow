import { Moon, Sun } from 'lucide-react';

type ThemeToggleProps = {
    isDark: boolean;
    themePreference: 'light' | 'dark' | 'system';
    onToggle: () => void;
    onSystem: () => void;
};

export default function ThemeToggle({ isDark, themePreference, onToggle, onSystem }: ThemeToggleProps) {
    return (
        <div className="inline-flex overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700">
            <button
                type="button"
                onClick={onToggle}
                className="inline-flex items-center gap-2 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                aria-label="Toggle theme"
            >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {isDark ? 'Light mode' : 'Dark mode'}
            </button>
            <button
                type="button"
                onClick={onSystem}
                className={`border-l border-slate-300 px-3 py-2 text-xs font-semibold uppercase tracking-wide transition dark:border-slate-700 ${
                    themePreference === 'system'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
                aria-label="Use system theme"
            >
                System
            </button>
        </div>
    );
}
