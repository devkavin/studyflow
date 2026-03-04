import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

type StatsMap = Record<string, string | number>;

export default function Stats({ stats }: { stats: StatsMap }) {
    return (
        <AuthenticatedLayout>
            <Head title="Stats" />
            <h1 className="mb-4 text-2xl font-semibold text-slate-900">Statistics</h1>
            <div className="grid gap-3 md:grid-cols-4">
                {['today_minutes', 'week_minutes', 'month_minutes', 'completion_rate'].map((key) => (
                    <div key={key} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="text-sm text-slate-500">{key}</p>
                        <p className="text-xl font-semibold text-slate-900">{stats[key]}</p>
                    </div>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}
