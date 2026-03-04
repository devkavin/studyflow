import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ThemeToggle from '@/Components/ThemeToggle';
import { useTheme } from '@/hooks/useTheme';
import { Link } from '@inertiajs/react';
import { useAuthUser } from '@/hooks/useAuth';
import { PropsWithChildren, ReactNode } from 'react';

const links = [
    ['dashboard', 'Dashboard'],
    ['curriculum.index', 'Curriculum'],
    ['planner.index', 'Planner'],
    ['timer.index', 'Timer'],
    ['todos.index', 'Todos'],
    ['stats.index', 'Stats'],
    ['settings.index', 'Settings'],
] as const;

export default function AuthenticatedLayout({
    children,
    header,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = useAuthUser();
    const { isDark, themePreference, toggleTheme, setThemePreference } = useTheme();

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <nav className="border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 p-4">
                    <Link href={route('dashboard')} className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                        StudyFlow
                    </Link>
                    <div className="flex flex-wrap gap-4">
                        {links.map(([name, label]) => (
                            <NavLink key={name} href={route(name)} active={route().current(name)}>
                                {label}
                            </NavLink>
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeToggle
                            isDark={isDark}
                            themePreference={themePreference}
                            onToggle={toggleTheme}
                            onSystem={() => setThemePreference('system')}
                        />
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                    {user?.name || user?.email || 'My account'}
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>
            </nav>
            {header && <header className="mx-auto max-w-7xl px-4 pt-6">{header}</header>}
            <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
        </div>
    );
}
