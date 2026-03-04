import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useAuthUser } from '@/hooks/useAuth';
import { Head, Link } from '@inertiajs/react';
import { addMinutes, format, formatDistanceToNow } from 'date-fns';
import { BarChart3, BookOpen, CalendarCheck2, CheckCircle2, Clock3, Flame, ListTodo, Timer } from 'lucide-react';
import { useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';

type DashboardMetrics = {
    today_focus_minutes: number;
    week_focus_minutes: number;
    today_planned_minutes: number;
    today_completed_items: number;
    today_total_items: number;
    focus_trend: Array<{ date: string; minutes: number }>;
    upcoming_items: Array<{
        id: number;
        title: string;
        status: 'todo' | 'doing' | 'done';
        due_date: string;
        type: 'Todo' | 'Curriculum';
        context?: string;
    }>;
};

const statusLabels = {
    todo: 'To do',
    doing: 'In progress',
    done: 'Completed',
} as const;

export default function Dashboard({ dashboard }: { dashboard: DashboardMetrics }) {
    const user = useAuthUser();
    const now = new Date();
    const focusMinutes = user?.pomodoro_focus_minutes ?? 25;
    const breakMinutes = user?.pomodoro_break_minutes ?? 5;
    const goalMinutes = user?.daily_study_goal_minutes ?? 120;

    const [focusStartTime, setFocusStartTime] = useState<Date | null>(new Date(now.getTime() + 15 * 60000));
    const [focusDuration, setFocusDuration] = useState(focusMinutes);

    const maxTrendMinutes = useMemo(() => Math.max(...dashboard.focus_trend.map((point) => point.minutes), 1), [dashboard.focus_trend]);
    const completionRate = dashboard.today_total_items ? Math.round((dashboard.today_completed_items / dashboard.today_total_items) * 100) : 0;
    const goalProgress = Math.min(100, Math.round((dashboard.today_focus_minutes / goalMinutes) * 100));

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="space-y-6">
                <div className="space-y-2">
                    <p className="text-sm text-slate-500 dark:text-slate-400">{format(now, 'EEEE, MMMM d · p')}</p>
                    <h1 className="text-3xl font-bold">Welcome back{user?.name ? `, ${user.name}` : ''}.</h1>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Your productivity command center for focus, planning, and execution.</p>
                </div>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-slate-400"><Clock3 className="h-4 w-4" /><span className="text-xs uppercase tracking-wide">Today focus</span></div>
                        <p className="text-2xl font-semibold">{dashboard.today_focus_minutes} min</p>
                        <p className="mt-1 text-xs text-slate-500">Goal progress: {goalProgress}% of {goalMinutes} min</p>
                    </article>
                    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-slate-400"><Flame className="h-4 w-4" /><span className="text-xs uppercase tracking-wide">This week</span></div>
                        <p className="text-2xl font-semibold">{dashboard.week_focus_minutes} min</p>
                        <p className="mt-1 text-xs text-slate-500">Sustained output across the week.</p>
                    </article>
                    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-slate-400"><CalendarCheck2 className="h-4 w-4" /><span className="text-xs uppercase tracking-wide">Today's plan</span></div>
                        <p className="text-2xl font-semibold">{dashboard.today_planned_minutes} min</p>
                        <p className="mt-1 text-xs text-slate-500">{dashboard.today_total_items} scheduled block(s).</p>
                    </article>
                    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-slate-400"><CheckCircle2 className="h-4 w-4" /><span className="text-xs uppercase tracking-wide">Completion</span></div>
                        <p className="text-2xl font-semibold">{completionRate}%</p>
                        <p className="mt-1 text-xs text-slate-500">{dashboard.today_completed_items}/{dashboard.today_total_items} completed today.</p>
                    </article>
                </section>

                <section className="grid gap-4 xl:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">
                        <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">7-day focus trend</h2><BarChart3 className="h-4 w-4 text-slate-500" /></div>
                        <div className="grid grid-cols-7 gap-2">
                            {dashboard.focus_trend.map((point) => (
                                <div key={point.date} className="flex flex-col items-center gap-2">
                                    <div className="flex h-36 w-full items-end rounded-md bg-slate-100 px-2 py-2 dark:bg-slate-800">
                                        <div className="w-full rounded bg-indigo-500" style={{ height: `${Math.max(8, (point.minutes / maxTrendMinutes) * 100)}%` }} />
                                    </div>
                                    <p className="text-xs font-medium">{point.minutes}m</p>
                                    <p className="text-xs text-slate-500">{format(new Date(point.date), 'EEE')}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <h2 className="text-lg font-semibold">Focus planner helper</h2>
                        <p className="mt-1 text-sm text-slate-500">Use date-time scheduling to quickly align your next deep-work block.</p>
                        <div className="mt-4 space-y-3">
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">Start date and time</label>
                            <DatePicker
                                selected={focusStartTime}
                                onChange={(date: Date | null) => setFocusStartTime(date)}
                                showTimeSelect
                                timeIntervals={15}
                                dateFormat="MMM d, yyyy h:mm aa"
                                className="w-full rounded-md border-slate-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                            />
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">Planned duration (minutes)</label>
                            <input type="number" min={15} step={5} value={focusDuration} onChange={(e) => setFocusDuration(Number(e.target.value) || 15)} className="w-full rounded-md border-slate-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950" />
                            <div className="rounded-md bg-slate-100 p-3 text-sm dark:bg-slate-800">
                                <p>Start: <span className="font-medium">{focusStartTime ? format(focusStartTime, 'PPpp') : 'Not selected'}</span></p>
                                <p>End: <span className="font-medium">{focusStartTime ? format(addMinutes(focusStartTime, focusDuration), 'PPpp') : 'Not selected'}</span></p>
                                <p className="mt-1 text-xs text-slate-500">Next block starts {focusStartTime ? formatDistanceToNow(focusStartTime, { addSuffix: true }) : 'after selecting a time'}.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Upcoming deadlines</h2>
                            <ListTodo className="h-4 w-4 text-slate-500" />
                        </div>
                        <div className="space-y-2">
                            {dashboard.upcoming_items.length === 0 && <p className="text-sm text-slate-500">No upcoming deadlines. Great job staying ahead.</p>}
                            {dashboard.upcoming_items.map((item) => (
                                <div key={`${item.type}-${item.id}`} className="rounded-md border border-slate-200 p-3 text-sm dark:border-slate-700">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="font-medium">{item.title}</p>
                                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-800">{statusLabels[item.status]}</span>
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500">{item.type}{item.context ? ` · ${item.context}` : ''} · Due {format(new Date(item.due_date), 'MMM d')}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-semibold">Quick actions</h2><BookOpen className="h-4 w-4 text-slate-500" /></div>
                        <div className="grid gap-2 sm:grid-cols-2">
                            <Link className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800" href={route('planner.index')}>Open planner</Link>
                            <Link className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800" href={route('todos.index')}>Manage task board</Link>
                            <Link className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800" href={route('curriculum.index')}>Review curriculum</Link>
                            <Link className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800" href={route('timer.index')}>Start focus timer ({focusMinutes}/{breakMinutes})</Link>
                        </div>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
