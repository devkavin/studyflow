import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useAuthUser } from '@/hooks/useAuth';

type UserSettings = {
    timezone?: string;
    daily_study_goal_minutes?: number;
    pomodoro_focus_minutes?: number;
    pomodoro_break_minutes?: number;
    pomodoro_long_break_minutes?: number;
    pomodoro_long_break_interval?: number;
};

export default function Settings() {
    const user = useAuthUser() as UserSettings | null;
    const form = useForm({
        timezone: user?.timezone || 'UTC',
        daily_study_goal_minutes: user?.daily_study_goal_minutes || 90,
        pomodoro_focus_minutes: user?.pomodoro_focus_minutes || 25,
        pomodoro_break_minutes: user?.pomodoro_break_minutes || 5,
        pomodoro_long_break_minutes: user?.pomodoro_long_break_minutes || 15,
        pomodoro_long_break_interval: user?.pomodoro_long_break_interval || 4,
    });

    return (
        <AuthenticatedLayout>
            <Head title="Settings" />
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.patch(route('settings.update'));
                }}
                className="max-w-lg space-y-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
                <input
                    className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    value={form.data.timezone}
                    onChange={(e) => form.setData('timezone', e.target.value)}
                />
                <input
                    type="number"
                    className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    value={form.data.daily_study_goal_minutes}
                    onChange={(e) => form.setData('daily_study_goal_minutes', Number(e.target.value))}
                />
                <button className="rounded bg-indigo-600 px-3 py-2 text-white">Save</button>
            </form>
        </AuthenticatedLayout>
    );
}
