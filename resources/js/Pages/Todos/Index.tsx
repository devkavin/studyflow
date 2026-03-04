import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

type Todo = { id: number; title: string; status: 'todo' | 'doing' | 'done'; due_date?: string | null; subject_id?: number | null; topic_id?: number | null };
type Subject = { id: number; name: string; topics: { id: number; name: string }[] };

const statuses: Array<Todo['status']> = ['todo', 'doing', 'done'];

export default function Todos({ todos, subjects }: { todos: Todo[]; subjects: Subject[] }) {
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | Todo['status']>('all');

    const form = useForm({ title: '', status: 'todo' as Todo['status'], subject_id: '', topic_id: '', due_date: '' });

    const selectedSubject = useMemo(() => subjects.find((subject) => String(subject.id) === String(form.data.subject_id)), [subjects, form.data.subject_id]);

    const filtered = useMemo(() => todos.filter((todo) => {
        const matchesQuery = todo.title.toLowerCase().includes(query.toLowerCase());
        const matchesStatus = statusFilter === 'all' || todo.status === statusFilter;
        return matchesQuery && matchesStatus;
    }), [todos, query, statusFilter]);

    const progress = useMemo(() => {
        const done = todos.filter((todo) => todo.status === 'done').length;
        return todos.length ? Math.round((done / todos.length) * 100) : 0;
    }, [todos]);

    const byStatus = useMemo(() => statuses.reduce<Record<string, Todo[]>>((acc, status) => {
        acc[status] = filtered.filter((todo) => todo.status === status);
        return acc;
    }, {}), [filtered]);

    return (
        <AuthenticatedLayout>
            <Head title="Todos" />
            <div className="space-y-6">
                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h1 className="text-2xl font-semibold">Tasks board</h1>
                    <p className="text-sm text-slate-500">Completion: {progress}% of all tasks done.</p>
                    <div className="mt-3 h-2 rounded bg-slate-200 dark:bg-slate-800">
                        <div className="h-2 rounded bg-indigo-600" style={{ width: `${progress}%` }} />
                    </div>
                </section>

                <form onSubmit={(e) => { e.preventDefault(); form.post(route('todos.store')); }} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:grid-cols-6">
                    <input className="rounded-md border-slate-300 md:col-span-2 dark:border-slate-700 dark:bg-slate-950" placeholder="Add a task" value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} />
                    <select className="rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" value={form.data.status} onChange={(e) => form.setData('status', e.target.value as Todo['status'])}>
                        {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                    <select className="rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" value={form.data.subject_id} onChange={(e) => { form.setData('subject_id', e.target.value); form.setData('topic_id', ''); }}>
                        <option value="">Subject</option>
                        {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
                    </select>
                    <select className="rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" value={form.data.topic_id} onChange={(e) => form.setData('topic_id', e.target.value)}>
                        <option value="">Topic</option>
                        {(selectedSubject?.topics ?? []).map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}
                    </select>
                    <input type="date" className="rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" value={form.data.due_date} onChange={(e) => form.setData('due_date', e.target.value)} />
                    <button className="rounded-md bg-indigo-600 px-3 py-2 text-white md:col-span-6">Create task</button>
                </form>

                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-4 flex gap-2">
                        <input className="rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
                        <select className="rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | Todo['status'])}>
                            <option value="all">All statuses</option>
                            {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                        </select>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                        {statuses.map((status) => (
                            <div key={status} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                                <p className="mb-2 text-sm font-semibold uppercase text-slate-500">{status}</p>
                                <div className="space-y-2">
                                    {byStatus[status].map((todo) => (
                                        <div key={todo.id} className="rounded-md bg-slate-100 p-2 dark:bg-slate-800">
                                            <p className="font-medium">{todo.title}</p>
                                            <p className="text-xs text-slate-500">{todo.due_date ? `Due ${todo.due_date}` : 'No due date'}</p>
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
