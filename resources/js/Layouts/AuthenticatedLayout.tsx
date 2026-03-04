import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link, usePage } from '@inertiajs/react';
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

export default function AuthenticatedLayout({ children, header }: PropsWithChildren<{ header?: ReactNode }>) {
  const user = usePage().props.auth.user as { name: string; email: string };

  return <div className="min-h-screen bg-slate-50">
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        <Link href={route('dashboard')} className="font-semibold">StudyFlow</Link>
        <div className="hidden gap-4 md:flex">{links.map(([name, label]) => <NavLink key={name} href={route(name)} active={route().current(name)}>{label}</NavLink>)}</div>
        <Dropdown>
          <Dropdown.Trigger><button className="rounded border px-3 py-1">{user.name}</button></Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
            <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
          </Dropdown.Content>
        </Dropdown>
      </div>
    </nav>
    {header && <header className='mx-auto max-w-7xl p-4'>{header}</header>}<main className="mx-auto max-w-7xl p-4">{children}</main>
  </div>;
}
