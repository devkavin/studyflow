import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

type PlannerItem = {
    id: number;
    date: string;
    title: string;
    planned_minutes: number;
};

export default function Planner({ items }: { items: PlannerItem[] }) {
    const form = useForm({ days: ['mon', 'tue', 'wed', 'thu', 'fri'], minutes_per_day: 120 });

    return (
        <AuthenticatedLayout>
            <Head title="Planner" />
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-slate-900">7-Day Planner</h1>
                <button
                    onClick={() => form.post(route('planner.autoplan'))}
                    className="rounded bg-indigo-600 px-3 py-2 text-white"
                >
                    Auto Plan
                </button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
                {items.map((item) => (
                    <div key={item.id} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                        {item.date}: {item.title} ({item.planned_minutes}m)
                    </div>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}
