import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
export default function Dashboard() { return <AuthenticatedLayout><Head title="Dashboard" /><div className="grid gap-4 md:grid-cols-2"><Link className="rounded bg-white p-6 shadow" href={route('planner.index')}>Today agenda</Link><Link className="rounded bg-white p-6 shadow" href={route('timer.index')}>Quick start timer</Link></div></AuthenticatedLayout>; }
