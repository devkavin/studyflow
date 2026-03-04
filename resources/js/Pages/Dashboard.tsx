import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="mb-5">
                <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
                <p className="text-sm text-slate-600">Jump back into your study workflow.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <Link className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm" href={route('planner.index')}>
                    Today agenda
                </Link>
                <Link className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm" href={route('timer.index')}>
                    Quick start timer
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}
