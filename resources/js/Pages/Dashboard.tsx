import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { format, formatDistanceToNow } from 'date-fns';
import { BookOpen, CalendarCheck2, Clock3, Timer } from 'lucide-react';
import { useAuthUser } from '@/hooks/useAuth';

export default function Dashboard() {
    const user = useAuthUser();
    const now = new Date();
    const focusMinutes = user?.pomodoro_focus_minutes ?? 25;
    const breakMinutes = user?.pomodoro_break_minutes ?? 5;
    const goalMinutes = user?.daily_study_goal_minutes ?? 120;

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="mb-6 space-y-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">{format(now, 'EEEE, MMMM d · p')}</p>
                <h1 className="text-3xl font-bold">Welcome back{user?.name ? `, ${user.name}` : ''}.</h1>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                    Your next focus block starts in {formatDistanceToNow(new Date(now.getTime() + 15 * 60000))}.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Clock3 className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-wide">Daily goal</span>
                    </div>
                    <p className="text-2xl font-semibold">{goalMinutes} min</p>
                </article>
                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Timer className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-wide">Focus / break</span>
                    </div>
                    <p className="text-2xl font-semibold">{focusMinutes} / {breakMinutes} min</p>
                </article>
                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <CalendarCheck2 className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-wide">Today</span>
                    </div>
                    <p className="text-2xl font-semibold">Stay consistent</p>
                </article>
                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <BookOpen className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-wide">Next action</span>
                    </div>
                    <p className="text-2xl font-semibold">Open planner</p>
                </article>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Link
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                    href={route('planner.index')}
                >
                    <h2 className="font-semibold">Today agenda</h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Organize subjects and tasks for this session.</p>
                </Link>
                <Link
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                    href={route('timer.index')}
                >
                    <h2 className="font-semibold">Quick start timer</h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Start a {focusMinutes}-minute focus sprint instantly.</p>
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}
