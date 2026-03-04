import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

type ActiveSession = {
    id: number;
    start_time: string;
} | null;

export default function Timer({ activeSession }: { activeSession: ActiveSession }) {
    const [session, setSession] = useState(activeSession);

    return (
        <AuthenticatedLayout>
            <Head title="Timer" />
            <h1 className="mb-4 text-2xl font-semibold text-slate-900 dark:text-slate-100">Focus Timer</h1>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
                <p>{session ? `Active since ${session.start_time}` : 'No active session'}</p>
                <div className="mt-3 flex gap-2">
                    <button
                        className="rounded bg-green-600 px-3 py-2 text-white"
                        onClick={async () => setSession((await axios.post(route('timer.start'), { mode: 'pomodoro' })).data)}
                    >
                        Start
                    </button>
                    <button
                        className="rounded bg-red-600 px-3 py-2 text-white"
                        onClick={async () =>
                            session && setSession((await axios.post(route('timer.stop'), { session_id: session.id })).data)
                        }
                    >
                        Stop
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
