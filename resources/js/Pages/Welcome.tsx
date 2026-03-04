import ThemeToggle from '@/Components/ThemeToggle';
import { useTheme } from '@/hooks/useTheme';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';

export default function Welcome({
    auth,
}: {
    auth?: { user?: { name: string } | null };
}) {
    const { isDark, themePreference, toggleTheme, setThemePreference } = useTheme();
    const now = format(new Date(), 'EEEE, MMMM d · p');

    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
                <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
                    <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400">StudyFlow</p>
                    <ThemeToggle
                        isDark={isDark}
                        themePreference={themePreference}
                        onToggle={toggleTheme}
                        onSystem={() => setThemePreference('system')}
                    />
                </header>

                <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-8 md:flex-row md:items-center md:justify-between">
                    <section className="max-w-xl space-y-5">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{now}</p>
                        <h1 className="text-4xl font-bold leading-tight md:text-5xl">A focused dashboard for daily study.</h1>
                        <p className="text-lg text-slate-600 dark:text-slate-300">
                            Plan sessions, track progress, and stay consistent with a clean workflow built for students.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {auth?.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
                                >
                                    Open dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('register')}
                                        className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
                                    >
                                        Create account
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
                                    >
                                        Sign in
                                    </Link>
                                </>
                            )}
                        </div>
                    </section>

                    <section className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <h2 className="text-lg font-semibold">What you get</h2>
                        <ul className="mt-3 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                            <li>• A clear planner for today and upcoming tasks.</li>
                            <li>• Built-in focus timer with Pomodoro defaults.</li>
                            <li>• Quick stats to measure momentum.</li>
                        </ul>
                    </section>
                </main>
            </div>
        </>
    );
}
