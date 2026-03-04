import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useAuthUser } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Head, useForm } from '@inertiajs/react';
import { Bell, Clock3, MonitorCog, Save } from 'lucide-react';
import { useMemo, useState } from 'react';

type UserSettings = {
    timezone?: string;
    daily_study_goal_minutes?: number;
    pomodoro_focus_minutes?: number;
    pomodoro_break_minutes?: number;
    pomodoro_long_break_minutes?: number;
    pomodoro_long_break_interval?: number;
};

const timezones = ['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Berlin', 'Asia/Kolkata', 'Asia/Singapore', 'Australia/Sydney'];

export default function Settings() {
    const user = useAuthUser() as UserSettings | null;
    const { themePreference, toggleTheme, setThemePreference } = useTheme();
    const [tab, setTab] = useState<'study' | 'pomodoro' | 'appearance'>('study');

    const form = useForm({
        timezone: user?.timezone || 'UTC',
        daily_study_goal_minutes: user?.daily_study_goal_minutes || 90,
        pomodoro_focus_minutes: user?.pomodoro_focus_minutes || 25,
        pomodoro_break_minutes: user?.pomodoro_break_minutes || 5,
        pomodoro_long_break_minutes: user?.pomodoro_long_break_minutes || 15,
        pomodoro_long_break_interval: user?.pomodoro_long_break_interval || 4,
    });

    const cycleDuration = useMemo(
        () => form.data.pomodoro_focus_minutes * form.data.pomodoro_long_break_interval + form.data.pomodoro_break_minutes * (form.data.pomodoro_long_break_interval - 1) + form.data.pomodoro_long_break_minutes,
        [form.data],
    );

    return (
        <AuthenticatedLayout>
            <Head title="Settings" />
            <div className="space-y-6">
                <h1 className="text-2xl font-semibold">Settings</h1>

                <div className="flex flex-wrap gap-2">
                    {[
                        { id: 'study', label: 'Study goals', icon: Bell },
                        { id: 'pomodoro', label: 'Timer defaults', icon: Clock3 },
                        { id: 'appearance', label: 'Appearance', icon: MonitorCog },
                    ].map((item) => (
                        <button key={item.id} onClick={() => setTab(item.id as 'study' | 'pomodoro' | 'appearance')} className={`flex items-center gap-2 rounded-md px-3 py-2 ${tab === item.id ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}><item.icon className="h-4 w-4" />{item.label}</button>
                    ))}
                </div>

                <form onSubmit={(e) => { e.preventDefault(); form.patch(route('settings.update')); }} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    {tab === 'study' && (
                        <div className="grid gap-4 md:grid-cols-2">
                            <label className="space-y-1 text-sm">
                                <span className="text-slate-500">Timezone</span>
                                <select className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" value={form.data.timezone} onChange={(e) => form.setData('timezone', e.target.value)}>
                                    {timezones.map((timezone) => <option key={timezone} value={timezone}>{timezone}</option>)}
                                </select>
                            </label>
                            <label className="space-y-1 text-sm">
                                <span className="text-slate-500">Daily study goal (minutes)</span>
                                <input type="number" min={30} max={600} className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" value={form.data.daily_study_goal_minutes} onChange={(e) => form.setData('daily_study_goal_minutes', Number(e.target.value))} />
                            </label>
                        </div>
                    )}

                    {tab === 'pomodoro' && (
                        <div className="grid gap-4 md:grid-cols-2">
                            <label className="space-y-1 text-sm"><span className="text-slate-500">Focus minutes</span><input type="number" min={15} max={90} className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" value={form.data.pomodoro_focus_minutes} onChange={(e) => form.setData('pomodoro_focus_minutes', Number(e.target.value))} /></label>
                            <label className="space-y-1 text-sm"><span className="text-slate-500">Short break</span><input type="number" min={3} max={30} className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" value={form.data.pomodoro_break_minutes} onChange={(e) => form.setData('pomodoro_break_minutes', Number(e.target.value))} /></label>
                            <label className="space-y-1 text-sm"><span className="text-slate-500">Long break</span><input type="number" min={10} max={45} className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" value={form.data.pomodoro_long_break_minutes} onChange={(e) => form.setData('pomodoro_long_break_minutes', Number(e.target.value))} /></label>
                            <label className="space-y-1 text-sm"><span className="text-slate-500">Long break interval</span><input type="number" min={2} max={8} className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" value={form.data.pomodoro_long_break_interval} onChange={(e) => form.setData('pomodoro_long_break_interval', Number(e.target.value))} /></label>
                            <div className="md:col-span-2 rounded-lg bg-slate-100 p-3 text-sm dark:bg-slate-800">One full cycle duration: <span className="font-semibold">{cycleDuration} min</span></div>
                        </div>
                    )}

                    {tab === 'appearance' && (
                        <div className="space-y-3">
                            <p className="text-sm text-slate-500">Theme preference controls your experience across the app.</p>
                            <div className="flex gap-2">
                                <button type="button" className={`rounded-md px-3 py-2 ${themePreference === 'light' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`} onClick={() => setThemePreference('light')}>Light</button>
                                <button type="button" className={`rounded-md px-3 py-2 ${themePreference === 'dark' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`} onClick={() => setThemePreference('dark')}>Dark</button>
                                <button type="button" className={`rounded-md px-3 py-2 ${themePreference === 'system' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`} onClick={() => setThemePreference('system')}>System</button>
                                <button type="button" className="rounded-md border border-slate-300 px-3 py-2" onClick={toggleTheme}>Quick toggle</button>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-white"><Save className="h-4 w-4" /> Save settings</button>
                        <button type="button" className="rounded-md border border-slate-300 px-3 py-2" onClick={() => form.setData({ timezone: 'UTC', daily_study_goal_minutes: 90, pomodoro_focus_minutes: 25, pomodoro_break_minutes: 5, pomodoro_long_break_minutes: 15, pomodoro_long_break_interval: 4 })}>Reset defaults</button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
