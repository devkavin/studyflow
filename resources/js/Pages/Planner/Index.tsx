import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { CalendarDays, ClipboardCopy, Timer } from 'lucide-react';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';

type PlannerItem = { id: number; date: string; title: string; planned_minutes: number; is_done: boolean; };

const dayOptions = [
    { id: 'mon', label: 'Mon' },
    { id: 'tue', label: 'Tue' },
    { id: 'wed', label: 'Wed' },
    { id: 'thu', label: 'Thu' },
    { id: 'fri', label: 'Fri' },
    { id: 'sat', label: 'Sat' },
    { id: 'sun', label: 'Sun' },
] as const;

export default function Planner({ items }: { items: PlannerItem[] }) {
    const [search, setSearch] = useState('');
    const form = useForm<{ days: string[]; minutes_per_day: number }>({ days: ['mon', 'tue', 'wed', 'thu', 'fri'], minutes_per_day: 120 });

    const filtered = useMemo(() => items.filter((item) => item.title.toLowerCase().includes(search.toLowerCase())), [items, search]);

    const grouped = useMemo(() => filtered.reduce<Record<string, PlannerItem[]>>((acc, item) => {
        (acc[item.date] = acc[item.date] ?? []).push(item);
        return acc;
    }, {}), [filtered]);

    const summary = useMemo(() => {
        const totalMinutes = filtered.reduce((sum, item) => sum + item.planned_minutes, 0);
        const days = Object.entries(grouped).map(([day, dayItems]) => ({ day, minutes: dayItems.reduce((s, i) => s + i.planned_minutes, 0) }));
        const busiest = days.sort((a, b) => b.minutes - a.minutes)[0];
        return { totalMinutes, slots: filtered.length, busiest };
    }, [filtered, grouped]);

    return (
        <AuthenticatedLayout>
            <Head title="Planner" />
            <div className="space-y-6">
                <section className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"><CalendarDays className="mb-2 h-4 w-4 text-indigo-500" /><p className="text-xs text-slate-500">Planned time</p><p className="text-2xl font-semibold">{summary.totalMinutes} min</p></div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"><Timer className="mb-2 h-4 w-4 text-indigo-500" /><p className="text-xs text-slate-500">Study blocks</p><p className="text-2xl font-semibold">{summary.slots}</p></div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"><ClipboardCopy className="mb-2 h-4 w-4 text-indigo-500" /><p className="text-xs text-slate-500">Busiest day</p><p className="text-2xl font-semibold">{summary.busiest ? format(new Date(summary.busiest.day), 'EEE') : '-'}</p></div>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="mb-3 text-lg font-semibold">Auto-plan settings</h2>
                    <div className="mb-3 flex flex-wrap gap-2">
                        {dayOptions.map((day) => (
                            <button
                                key={day.id}
                                onClick={() => form.setData('days', form.data.days.includes(day.id) ? form.data.days.filter((d) => d !== day.id) : [...form.data.days, day.id])}
                                className={`rounded-md px-3 py-1.5 text-sm ${form.data.days.includes(day.id) ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}
                            >
                                {day.label}
                            </button>
                        ))}
                    </div>
                    <div className="mb-3 flex items-center gap-3">
                        <input type="range" min={30} max={360} step={15} value={form.data.minutes_per_day} onChange={(e) => form.setData('minutes_per_day', Number(e.target.value))} className="w-full" />
                        <span className="min-w-16 text-sm">{form.data.minutes_per_day}m/day</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => form.post(route('planner.autoplan'))} className="rounded-md bg-indigo-600 px-3 py-2 text-white">Generate 7-day plan</button>
                        <button
                            onClick={() => navigator.clipboard.writeText(filtered.map((item) => `${item.date}: ${item.title} (${item.planned_minutes}m)`).join('\n'))}
                            className="rounded-md border border-slate-300 px-3 py-2"
                        >
                            Copy as checklist
                        </button>
                    </div>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-lg font-semibold">Weekly agenda</h2>
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter by title" className="rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" />
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {Object.entries(grouped).map(([date, dayItems]) => (
                            <div key={date} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                                <p className="mb-2 text-sm font-semibold text-slate-500">{format(new Date(date), 'EEEE, MMM d')}</p>
                                <div className="space-y-2">
                                    {dayItems.map((item) => (
                                        <div key={item.id} className="rounded-md bg-slate-100 p-2 text-sm dark:bg-slate-800">
                                            <p className="font-medium">{item.title}</p>
                                            <p className="text-slate-500">{item.planned_minutes} min</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
