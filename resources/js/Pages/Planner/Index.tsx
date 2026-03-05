import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { endOfWeek, format, isWithinInterval, parseISO, startOfWeek } from 'date-fns';
import {
    CalendarDays,
    CheckCircle2,
    ClipboardCheck,
    ClipboardCopy,
    Filter,
    ListChecks,
    Search,
    Timer,
    TrendingUp,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type PlannerItem = { id: number; date: string; title: string; planned_minutes: number; is_done: boolean };

type DayFilter = 'all' | 'thisWeek';
type SortMode = 'dateAsc' | 'dateDesc' | 'durationDesc';

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
    const [dayFilter, setDayFilter] = useState<DayFilter>('all');
    const [sortMode, setSortMode] = useState<SortMode>('dateAsc');

    const form = useForm<{ days: string[]; minutes_per_day: number }>({ days: ['mon', 'tue', 'wed', 'thu', 'fri'], minutes_per_day: 120 });

    const filtered = useMemo(() => {
        const now = new Date();
        const range = { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };

        return items
            .filter((item) => item.title.toLowerCase().includes(search.toLowerCase()))
            .filter((item) => (dayFilter === 'all' ? true : isWithinInterval(parseISO(item.date), range)))
            .sort((a, b) => {
                if (sortMode === 'durationDesc') {
                    return b.planned_minutes - a.planned_minutes;
                }

                const comparison = parseISO(a.date).getTime() - parseISO(b.date).getTime();
                return sortMode === 'dateAsc' ? comparison : -comparison;
            });
    }, [dayFilter, items, search, sortMode]);

    const grouped = useMemo(
        () =>
            filtered.reduce<Record<string, PlannerItem[]>>((acc, item) => {
                (acc[item.date] = acc[item.date] ?? []).push(item);
                return acc;
            }, {}),
        [filtered],
    );

    const summary = useMemo(() => {
        const totalMinutes = filtered.reduce((sum, item) => sum + item.planned_minutes, 0);
        const completedCount = filtered.filter((item) => item.is_done).length;
        const completionRate = filtered.length ? Math.round((completedCount / filtered.length) * 100) : 0;
        const days = Object.entries(grouped).map(([day, dayItems]) => ({ day, minutes: dayItems.reduce((s, i) => s + i.planned_minutes, 0) }));
        const busiest = [...days].sort((a, b) => b.minutes - a.minutes)[0];

        return {
            totalMinutes,
            slots: filtered.length,
            completedCount,
            completionRate,
            busiest,
            chartData: days.map((d) => ({
                name: format(parseISO(d.day), 'EEE'),
                minutes: d.minutes,
            })),
        };
    }, [filtered, grouped]);

    const copyChecklist = async () => {
        const content = Object.entries(grouped)
            .map(([date, dayItems]) => {
                const header = `## ${format(parseISO(date), 'EEEE, MMM d')}`;
                const tasks = dayItems
                    .map((item) => `- [${item.is_done ? 'x' : ' '}] ${item.title} (${item.planned_minutes}m)`)
                    .join('\n');

                return `${header}\n${tasks}`;
            })
            .join('\n\n');

        try {
            await navigator.clipboard.writeText(content);
            toast.success('Checklist copied', { description: 'Copied as Markdown checklist with checkboxes.' });
        } catch {
            toast.error('Copy failed', { description: 'Clipboard access was blocked by your browser.' });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Planner" />
            <div className="space-y-6">
                <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"><CalendarDays className="mb-2 h-4 w-4 text-indigo-500" /><p className="text-xs text-slate-500">Planned time</p><p className="text-2xl font-semibold">{summary.totalMinutes} min</p></div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"><Timer className="mb-2 h-4 w-4 text-indigo-500" /><p className="text-xs text-slate-500">Study blocks</p><p className="text-2xl font-semibold">{summary.slots}</p></div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"><CheckCircle2 className="mb-2 h-4 w-4 text-emerald-500" /><p className="text-xs text-slate-500">Completion</p><p className="text-2xl font-semibold">{summary.completionRate}%</p><p className="text-xs text-slate-500">{summary.completedCount} completed</p></div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"><TrendingUp className="mb-2 h-4 w-4 text-indigo-500" /><p className="text-xs text-slate-500">Busiest day</p><p className="text-2xl font-semibold">{summary.busiest ? format(parseISO(summary.busiest.day), 'EEE') : '-'}</p></div>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="mb-3 text-lg font-semibold">Auto-plan settings</h2>
                    <div className="mb-3 flex flex-wrap gap-2">
                        {dayOptions.map((day) => (
                            <button
                                key={day.id}
                                onClick={() => form.setData('days', form.data.days.includes(day.id) ? form.data.days.filter((d) => d !== day.id) : [...form.data.days, day.id])}
                                className={`rounded-md px-3 py-1.5 text-sm transition ${form.data.days.includes(day.id) ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700'}`}
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
                        <button onClick={() => form.post(route('planner.autoplan'))} className="rounded-md bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-500">Generate 7-day plan</button>
                        <button onClick={copyChecklist} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"><ClipboardCheck className="h-4 w-4" />Copy as checklist</button>
                    </div>
                </section>

                <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                            <h2 className="text-lg font-semibold">Weekly agenda</h2>
                            <div className="flex flex-wrap items-center gap-2">
                                <label className="relative">
                                    <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter by title" className="rounded-md border-slate-300 py-2 pl-8 pr-3 text-sm dark:border-slate-700 dark:bg-slate-950" />
                                </label>
                                <label className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-2 py-2 dark:border-slate-700">
                                    <Filter className="h-4 w-4 text-slate-500" />
                                    <select value={dayFilter} onChange={(e) => setDayFilter(e.target.value as DayFilter)} className="border-none bg-transparent p-0 text-sm focus:ring-0 dark:bg-transparent">
                                        <option value="all">All dates</option>
                                        <option value="thisWeek">This week</option>
                                    </select>
                                </label>
                                <select value={sortMode} onChange={(e) => setSortMode(e.target.value as SortMode)} className="rounded-md border-slate-300 text-sm dark:border-slate-700 dark:bg-slate-950">
                                    <option value="dateAsc">Date (earliest)</option>
                                    <option value="dateDesc">Date (latest)</option>
                                    <option value="durationDesc">Longest blocks</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                            {Object.keys(grouped).length > 0 ? (
                                Object.entries(grouped).map(([date, dayItems]) => (
                                    <div key={date} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                                        <p className="mb-2 text-sm font-semibold text-slate-500">{format(parseISO(date), 'EEEE, MMM d')}</p>
                                        <div className="space-y-2">
                                            {dayItems.map((item) => (
                                                <div key={item.id} className="rounded-md bg-slate-100 p-2 text-sm dark:bg-slate-800">
                                                    <p className="font-medium">{item.title}</p>
                                                    <p className="text-slate-500">{item.planned_minutes} min</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700">
                                    No sessions match your filters. Try broadening your search.
                                </div>
                            )}
                        </div>
                    </div>

                    <aside className="space-y-4">
                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="mb-2 flex items-center gap-2"><ListChecks className="h-4 w-4 text-indigo-500" /><h3 className="font-semibold">Load by day</h3></div>
                            <div className="h-52">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={summary.chartData}>
                                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.25} />
                                        <XAxis dataKey="name" fontSize={12} />
                                        <YAxis fontSize={12} />
                                        <Tooltip formatter={(value) => [`${value ?? 0} min`, 'Planned']} />
                                        <Bar dataKey="minutes" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <h3 className="mb-2 flex items-center gap-2 font-semibold"><ClipboardCopy className="h-4 w-4 text-indigo-500" />Productivity tips</h3>
                            <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                                <li>• Keep blocks between 45–90 minutes for better focus.</li>
                                <li>• Leave buffer slots for catch-up and revision.</li>
                                <li>• Copy checklist to track your execution daily.</li>
                            </ul>
                        </div>
                    </aside>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
