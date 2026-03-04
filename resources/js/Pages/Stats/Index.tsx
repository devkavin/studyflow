import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useAuthUser } from '@/hooks/useAuth';
import { Head } from '@inertiajs/react';
import { useMemo } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type DayPoint = { day: string; minutes: number };
type StatsMap = {
    today_minutes: number;
    week_minutes: number;
    month_minutes: number;
    completion_rate: number;
    minutes_by_day: DayPoint[];
};

export default function Stats({ stats }: { stats: StatsMap }) {
    const user = useAuthUser();
    const goal = user?.daily_study_goal_minutes ?? 90;

    const derived = useMemo(() => {
        const total = stats.minutes_by_day.reduce((sum, day) => sum + Number(day.minutes), 0);
        const average = stats.minutes_by_day.length ? Math.round(total / stats.minutes_by_day.length) : 0;
        let streak = 0;
        for (const day of [...stats.minutes_by_day].reverse()) {
            if (Number(day.minutes) >= goal) {
                streak += 1;
                continue;
            }
            break;
        }

        return { average, streak, goalProgress: Math.min(100, Math.round((stats.today_minutes / goal) * 100)) };
    }, [stats, goal]);

    return (
        <AuthenticatedLayout>
            <Head title="Stats" />
            <div className="space-y-6">
                <h1 className="text-2xl font-semibold">Performance analytics</h1>

                <section className="grid gap-3 md:grid-cols-4">
                    {[
                        { label: 'Today', value: `${stats.today_minutes} min` },
                        { label: 'This week', value: `${stats.week_minutes} min` },
                        { label: 'Completion', value: `${Math.round(stats.completion_rate)}%` },
                        { label: 'Current streak', value: `${derived.streak} days` },
                    ].map((item) => (
                        <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <p className="text-xs text-slate-500">{item.label}</p>
                            <p className="text-2xl font-semibold">{item.value}</p>
                        </div>
                    ))}
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">30-day focus trend</h2>
                        <p className="text-sm text-slate-500">Avg/day: {derived.average} min</p>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer>
                            <AreaChart data={stats.minutes_by_day}>
                                <defs><linearGradient id="minutes" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} /></linearGradient></defs>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                                <YAxis />
                                <Tooltip />
                                <Area dataKey="minutes" stroke="#6366f1" fill="url(#minutes)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                <section className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <h2 className="mb-3 text-lg font-semibold">Goal tracking</h2>
                        <p className="text-sm text-slate-500">Daily target: {goal} min</p>
                        <div className="mt-3 h-2 rounded bg-slate-200 dark:bg-slate-800"><div className="h-2 rounded bg-indigo-600" style={{ width: `${derived.goalProgress}%` }} /></div>
                        <p className="mt-2 text-sm">{derived.goalProgress}% completed today</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <h2 className="mb-3 text-lg font-semibold">Minutes distribution</h2>
                        <div className="h-56">
                            <ResponsiveContainer>
                                <BarChart data={stats.minutes_by_day.slice(-7)}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="minutes" fill="#22c55e" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
