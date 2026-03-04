import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
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

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
            <nav className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 p-4">
                    <Link href={route('dashboard')} className="text-lg font-semibold text-indigo-600">
                        StudyFlow
                    </Link>
                    <div className="flex flex-wrap gap-4">
                        {links.map(([name, label]) => (
                            <NavLink key={name} href={route(name)} active={route().current(name)}>
                                {label}
                            </NavLink>
                        ))}
                    </div>
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700">
                                {user?.name ?? 'Account'}
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
            </nav>
            {header && <header className="mx-auto max-w-7xl px-4 pt-6">{header}</header>}
            <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
        </div>
    );
}
