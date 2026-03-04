import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { BookOpen, CheckCircle2, Clock3, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

type Task = {
    id: number;
    title: string;
    status: 'todo' | 'doing' | 'done';
    estimated_minutes: number;
    priority: number;
};

type Topic = {
    id: number;
    name: string;
    target_minutes: number;
    due_date?: string | null;
    tasks?: Task[];
};

type Subject = {
    id: number;
    name: string;
    color: string;
    priority: number;
    topics?: Topic[];
};

export default function Index({ subjects }: { subjects: Subject[] }) {
    const [query, setQuery] = useState('');
    const [expandedSubject, setExpandedSubject] = useState<number | null>(subjects[0]?.id ?? null);
    const [expandedTopic, setExpandedTopic] = useState<number | null>(null);

    const subjectForm = useForm({ name: '', color: '#6366f1', priority: 3 });
    const topicForm = useForm({ subject_id: subjects[0]?.id ?? 0, name: '', target_minutes: 120, due_date: '' });
    const taskForm = useForm({ topic_id: 0, title: '', notes: '', estimated_minutes: 30, status: 'todo', due_date: '', priority: 3 });
    const importForm = useForm({ input: '' });

    const stats = useMemo(() => {
        const topics = subjects.flatMap((subject) => subject.topics ?? []);
        const tasks = topics.flatMap((topic) => topic.tasks ?? []);
        const done = tasks.filter((task) => task.status === 'done').length;

        return {
            subjects: subjects.length,
            topics: topics.length,
            tasks: tasks.length,
            completion: tasks.length ? Math.round((done / tasks.length) * 100) : 0,
        };
    }, [subjects]);

    const filteredSubjects = useMemo(
        () => subjects.filter((subject) => subject.name.toLowerCase().includes(query.toLowerCase())),
        [subjects, query],
    );

    return (
        <AuthenticatedLayout>
            <Head title="Curriculum" />
            <div className="space-y-6">
                <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: 'Subjects', value: stats.subjects, icon: BookOpen },
                        { label: 'Topics', value: stats.topics, icon: Plus },
                        { label: 'Tasks', value: stats.tasks, icon: Clock3 },
                        { label: 'Completion', value: `${stats.completion}%`, icon: CheckCircle2 },
                    ].map((item) => (
                        <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <item.icon className="mb-2 h-4 w-4 text-indigo-500" />
                            <p className="text-xs text-slate-500 dark:text-slate-400">{item.label}</p>
                            <p className="text-2xl font-semibold">{item.value}</p>
                        </div>
                    ))}
                </section>

                <section className="grid gap-4 lg:grid-cols-2">
                    <form onSubmit={(e) => { e.preventDefault(); subjectForm.post(route('subjects.store')); }} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <h2 className="text-lg font-semibold">Add subject</h2>
                        <div className="grid gap-2 sm:grid-cols-3">
                            <input placeholder="Subject name" className="rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" value={subjectForm.data.name} onChange={(e) => subjectForm.setData('name', e.target.value)} />
                            <input type="color" className="h-10 rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" value={subjectForm.data.color} onChange={(e) => subjectForm.setData('color', e.target.value)} />
                            <input type="number" min={1} max={5} placeholder="Priority" className="rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" value={subjectForm.data.priority} onChange={(e) => subjectForm.setData('priority', Number(e.target.value))} />
                        </div>
                        <button className="rounded-md bg-indigo-600 px-3 py-2 text-white">Create subject</button>
                    </form>

                    <form onSubmit={(e) => { e.preventDefault(); importForm.post(route('curriculum.import')); }} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <h2 className="text-lg font-semibold">Bulk import</h2>
                        <textarea rows={3} placeholder="Math: Algebra, Geometry\nPhysics: Mechanics, Optics" className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" value={importForm.data.input} onChange={(e) => importForm.setData('input', e.target.value)} />
                        <button className="rounded-md bg-slate-800 px-3 py-2 text-white dark:bg-slate-700">Import subjects + topics</button>
                    </form>
                </section>

                <section className="grid gap-4 lg:grid-cols-2">
                    <form onSubmit={(e) => { e.preventDefault(); topicForm.post(route('topics.store')); }} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <h2 className="text-lg font-semibold">Add topic</h2>
                        <select className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" value={topicForm.data.subject_id} onChange={(e) => topicForm.setData('subject_id', Number(e.target.value))}>
                            <option value={0}>Select subject</option>
                            {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
                        </select>
                        <input className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" placeholder="Topic name" value={topicForm.data.name} onChange={(e) => topicForm.setData('name', e.target.value)} />
                        <div className="grid gap-2 sm:grid-cols-2">
                            <input type="number" min={15} className="rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" value={topicForm.data.target_minutes} onChange={(e) => topicForm.setData('target_minutes', Number(e.target.value))} />
                            <input type="date" className="rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" value={topicForm.data.due_date} onChange={(e) => topicForm.setData('due_date', e.target.value)} />
                        </div>
                        <button className="rounded-md bg-indigo-600 px-3 py-2 text-white">Create topic</button>
                    </form>

                    <form onSubmit={(e) => { e.preventDefault(); taskForm.post(route('tasks.store')); }} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <h2 className="text-lg font-semibold">Add task</h2>
                        <select className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" value={taskForm.data.topic_id} onChange={(e) => taskForm.setData('topic_id', Number(e.target.value))}>
                            <option value={0}>Select topic</option>
                            {subjects.flatMap((subject) => subject.topics ?? []).map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}
                        </select>
                        <input className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" placeholder="Task title" value={taskForm.data.title} onChange={(e) => taskForm.setData('title', e.target.value)} />
                        <div className="grid gap-2 sm:grid-cols-3">
                            <input type="number" min={5} className="rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" value={taskForm.data.estimated_minutes} onChange={(e) => taskForm.setData('estimated_minutes', Number(e.target.value))} />
                            <select className="rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" value={taskForm.data.status} onChange={(e) => taskForm.setData('status', e.target.value as 'todo' | 'doing' | 'done')}>
                                <option value="todo">Todo</option><option value="doing">Doing</option><option value="done">Done</option>
                            </select>
                            <input type="number" min={1} max={5} className="rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950" value={taskForm.data.priority} onChange={(e) => taskForm.setData('priority', Number(e.target.value))} />
                        </div>
                        <button className="rounded-md bg-indigo-600 px-3 py-2 text-white">Create task</button>
                    </form>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="text-lg font-semibold">Curriculum map</h2>
                        <div className="relative w-full max-w-xs">
                            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search subject" className="w-full rounded-md border-slate-300 pl-9 dark:border-slate-700 dark:bg-slate-950" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        {filteredSubjects.map((subject) => (
                            <div key={subject.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                                <button onClick={() => setExpandedSubject(expandedSubject === subject.id ? null : subject.id)} className="flex w-full items-center justify-between text-left">
                                    <div>
                                        <p className="font-semibold">{subject.name}</p>
                                        <p className="text-sm text-slate-500">{subject.topics?.length ?? 0} topics</p>
                                    </div>
                                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: subject.color }} />
                                </button>
                                {expandedSubject === subject.id && (
                                    <div className="mt-3 space-y-2">
                                        {(subject.topics ?? []).map((topic) => (
                                            <div key={topic.id} className="rounded-md border border-slate-200 p-3 dark:border-slate-700">
                                                <button className="flex w-full items-center justify-between" onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}>
                                                    <p className="font-medium">{topic.name}</p>
                                                    <span className="text-xs text-slate-500">{topic.tasks?.length ?? 0} tasks</span>
                                                </button>
                                                {expandedTopic === topic.id && (
                                                    <div className="mt-2 space-y-1 text-sm">
                                                        {(topic.tasks ?? []).map((task) => (
                                                            <div key={task.id} className="flex justify-between rounded bg-slate-100 px-2 py-1 dark:bg-slate-800">
                                                                <span>{task.title}</span>
                                                                <span>{task.status} · {task.estimated_minutes}m</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <button onClick={() => router.reload({ only: ['subjects'] })} className="mt-4 rounded-md border border-slate-300 px-3 py-2 text-sm">Refresh curriculum</button>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
