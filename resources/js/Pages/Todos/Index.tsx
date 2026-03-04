import DatePickerInput from '@/Components/DatePickerInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

type Todo = {
    id: number;
    title: string;
    status: 'todo' | 'doing' | 'done';
    due_date?: string | null;
    subject_id?: number | null;
    topic_id?: number | null;
};

type Subject = { id: number; name: string; topics: { id: number; name: string }[] };

const statuses: Array<Todo['status']> = ['todo', 'doing', 'done'];

const statusLabels: Record<Todo['status'], string> = {
    todo: 'To do',
    doing: 'In progress',
    done: 'Completed',
};

export default function Todos({ todos, subjects }: { todos: Todo[]; subjects: Subject[] }) {
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | Todo['status']>('all');

    const form = useForm({
        title: '',
        status: 'todo' as Todo['status'],
        subject_id: '',
        topic_id: '',
        due_date: '',
    });

    const selectedSubject = useMemo(
        () => subjects.find((subject) => String(subject.id) === String(form.data.subject_id)),
        [subjects, form.data.subject_id],
    );

    const filtered = useMemo(
        () =>
            todos.filter((todo) => {
                const matchesQuery = todo.title.toLowerCase().includes(query.toLowerCase());
                const matchesStatus = statusFilter === 'all' || todo.status === statusFilter;
                return matchesQuery && matchesStatus;
            }),
        [todos, query, statusFilter],
    );

    const progress = useMemo(() => {
        const done = todos.filter((todo) => todo.status === 'done').length;
        return todos.length ? Math.round((done / todos.length) * 100) : 0;
    }, [todos]);

    const byStatus = useMemo(
        () =>
            statuses.reduce<Record<string, Todo[]>>((acc, status) => {
                acc[status] = filtered.filter((todo) => todo.status === status);
                return acc;
            }, {}),
        [filtered],
    );

    return (
        <AuthenticatedLayout>
            <Head title="Todos" />
            <div className="space-y-6">
                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h1 className="text-2xl font-semibold">Task board</h1>
                    <p className="text-sm text-slate-500">Track your execution flow by moving tasks between statuses.</p>
                    <p className="mt-1 text-sm text-slate-500">Completion: {progress}% of all tasks done.</p>
                    <div className="mt-3 h-2 rounded bg-slate-200 dark:bg-slate-800">
                        <div className="h-2 rounded bg-indigo-600" style={{ width: `${progress}%` }} />
                    </div>
                </section>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.post(route('todos.store'));
                    }}
                    className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:grid-cols-6"
                >
                    <div className="md:col-span-2">
                        <label htmlFor="todo-title" className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Task title</label>
                        <input id="todo-title" className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" placeholder="e.g. Solve chapter 4 practice problems" value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="todo-status" className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Initial status</label>
                        <select id="todo-status" className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" value={form.data.status} onChange={(e) => form.setData('status', e.target.value as Todo['status'])}>
                            {statuses.map((status) => (
                                <option key={status} value={status}>{statusLabels[status]}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="todo-subject" className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Subject</label>
                        <select id="todo-subject" className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" value={form.data.subject_id} onChange={(e) => { form.setData('subject_id', e.target.value); form.setData('topic_id', ''); }}>
                            <option value="">Unassigned</option>
                            {subjects.map((subject) => (
                                <option key={subject.id} value={subject.id}>{subject.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="todo-topic" className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Topic</label>
                        <select id="todo-topic" className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" value={form.data.topic_id} onChange={(e) => form.setData('topic_id', e.target.value)}>
                            <option value="">Optional topic</option>
                            {(selectedSubject?.topics ?? []).map((topic) => (
                                <option key={topic.id} value={topic.id}>{topic.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="todo-due-date" className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Due date</label>
                        <DatePickerInput id="todo-due-date" value={form.data.due_date} onChange={(value) => form.setData('due_date', value)} placeholder="Pick a due date" />
                    </div>
                    <button className="rounded-md bg-indigo-600 px-3 py-2 text-white md:col-span-6">Create task</button>
                </form>

                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-4 grid gap-2 md:grid-cols-2">
                        <div>
                            <label htmlFor="todo-search" className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Search tasks</label>
                            <input id="todo-search" className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" placeholder="Search by keyword" value={query} onChange={(e) => setQuery(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="todo-filter" className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Filter by status</label>
                            <select id="todo-filter" className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | Todo['status'])}>
                                <option value="all">All statuses</option>
                                {statuses.map((status) => (
                                    <option key={status} value={status}>{statusLabels[status]}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                        {statuses.map((status) => (
                            <div key={status} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                                <p className="mb-2 text-sm font-semibold uppercase text-slate-500">{statusLabels[status]}</p>
                                <div className="space-y-2">
                                    {byStatus[status].map((todo) => (
                                        <div key={todo.id} className="rounded-md bg-slate-100 p-2 dark:bg-slate-800">
                                            <p className="font-medium">{todo.title}</p>
                                            <p className="text-xs text-slate-500">{todo.due_date ? `Due ${todo.due_date}` : 'No due date'}</p>
                                            <label className="mt-2 block text-xs font-medium uppercase tracking-wide text-slate-500">Change status</label>
                                            <select
                                                className="mt-1 w-full rounded-md border-slate-300 text-sm dark:border-slate-700 dark:bg-slate-950"
                                                value={todo.status}
                                                onChange={(e) => {
                                                    router.patch(route('todos.status', todo.id), { status: e.target.value }, { preserveScroll: true });
                                                }}
                                            >
                                                {statuses.map((nextStatus) => (
                                                    <option key={nextStatus} value={nextStatus}>{statusLabels[nextStatus]}</option>
                                                ))}
                                            </select>
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
