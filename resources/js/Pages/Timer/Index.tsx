import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useAuthUser } from '@/hooks/useAuth';
import axios from 'axios';
import { Head } from '@inertiajs/react';
import { formatDistanceStrict } from 'date-fns';
import { Play, Square, TimerReset } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useStopwatch, useTimer } from 'react-timer-hook';

type Subject = { id: number; name: string; topics: { id: number; name: string }[] };
type Session = { id: number; start_time: string; end_time?: string | null; duration_seconds?: number; mode: 'pomodoro' | 'custom' };

export default function Timer({ activeSession, recentSessions, subjects }: { activeSession: Session | null; recentSessions: Session[]; subjects: Subject[] }) {
    const user = useAuthUser();
    const [session, setSession] = useState(activeSession);
    const [mode, setMode] = useState<'pomodoro' | 'custom'>('pomodoro');
    const [subjectId, setSubjectId] = useState<number | null>(null);
    const [topicId, setTopicId] = useState<number | null>(null);
    const [notes, setNotes] = useState('');
    const [customMinutes, setCustomMinutes] = useState(45);

    const selectedSubject = useMemo(() => subjects.find((subject) => subject.id === subjectId), [subjects, subjectId]);
    const focusMinutes = user?.pomodoro_focus_minutes ?? 25;

    const timerExpiry = useMemo(() => {
        const expiry = new Date();
        expiry.setSeconds(expiry.getSeconds() + (mode === 'pomodoro' ? focusMinutes * 60 : customMinutes * 60));
        return expiry;
    }, [mode, focusMinutes, customMinutes]);

    const pomodoroTimer = useTimer({ expiryTimestamp: timerExpiry, autoStart: false });
    const elapsed = useStopwatch({ autoStart: Boolean(session), offsetTimestamp: session ? new Date(session.start_time) : undefined });

    useEffect(() => {
        if (session) {
            elapsed.start();
        } else {
            elapsed.pause();
            elapsed.reset(undefined, false);
        }
    }, [session]);

    const startSession = async () => {
        const response = await axios.post(route('timer.start'), {
            mode,
            subject_id: subjectId,
            topic_id: topicId,
            notes: notes || undefined,
        });

        setSession(response.data);
        pomodoroTimer.restart(timerExpiry);
    };

    const stopSession = async () => {
        if (!session) return;
        const response = await axios.post(route('timer.stop'), { session_id: session.id });
        setSession(null);
        pomodoroTimer.pause();
        return response.data;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Timer" />
            <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
                <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h1 className="text-2xl font-semibold">Focus timer</h1>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <button onClick={() => setMode('pomodoro')} className={`rounded-md px-3 py-2 ${mode === 'pomodoro' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}>Pomodoro ({focusMinutes}m)</button>
                        <button onClick={() => setMode('custom')} className={`rounded-md px-3 py-2 ${mode === 'custom' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}>Custom duration</button>
                    </div>

                    {mode === 'custom' && (
                        <div className="space-y-2">
                            <p className="text-sm text-slate-500">Custom focus length</p>
                            <input type="range" min={10} max={120} step={5} value={customMinutes} onChange={(e) => setCustomMinutes(Number(e.target.value))} className="w-full" />
                            <p className="text-sm font-medium">{customMinutes} minutes</p>
                        </div>
                    )}

                    <div className="grid gap-3 sm:grid-cols-2">
                        <select className="rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" value={subjectId ?? ''} onChange={(e) => setSubjectId(e.target.value ? Number(e.target.value) : null)}>
                            <option value="">No subject</option>
                            {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
                        </select>
                        <select className="rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" value={topicId ?? ''} onChange={(e) => setTopicId(e.target.value ? Number(e.target.value) : null)}>
                            <option value="">No topic</option>
                            {(selectedSubject?.topics ?? []).map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}
                        </select>
                    </div>
                    <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" placeholder="Session intention / notes" />

                    <div className="rounded-xl bg-slate-100 p-5 text-center dark:bg-slate-800">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Current countdown</p>
                        <p className="text-5xl font-semibold tabular-nums">{String(pomodoroTimer.minutes).padStart(2, '0')}:{String(pomodoroTimer.seconds).padStart(2, '0')}</p>
                        <p className="mt-2 text-sm text-slate-500">Elapsed: {String(elapsed.hours).padStart(2, '0')}:{String(elapsed.minutes).padStart(2, '0')}:{String(elapsed.seconds).padStart(2, '0')}</p>
                    </div>

                    <div className="flex gap-2">
                        <button disabled={Boolean(session)} className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-white disabled:opacity-50" onClick={startSession}><Play className="h-4 w-4" /> Start</button>
                        <button disabled={!session} className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-white disabled:opacity-50" onClick={stopSession}><Square className="h-4 w-4" /> Stop</button>
                        <button className="flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2" onClick={() => pomodoroTimer.restart(timerExpiry)}><TimerReset className="h-4 w-4" /> Reset</button>
                    </div>
                </section>

                <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="text-lg font-semibold">Recent sessions</h2>
                    <div className="space-y-2">
                        {recentSessions.map((item) => (
                            <div key={item.id} className="rounded-md border border-slate-200 p-3 text-sm dark:border-slate-700">
                                <p className="font-medium">{item.mode.toUpperCase()}</p>
                                <p className="text-slate-500">{formatDistanceStrict(new Date(item.start_time), new Date(item.end_time ?? item.start_time))}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
