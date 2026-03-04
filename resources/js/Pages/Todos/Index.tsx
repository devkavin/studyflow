import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

type Todo = {
    id: number;
    title: string;
    status: string;
};

export default function Todos({ todos }: { todos: Todo[] }) {
    const form = useForm({ title: '', status: 'todo' });

    return (
        <AuthenticatedLayout>
            <Head title="Todos" />
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.post(route('todos.store'));
                }}
                className="mb-4 flex gap-2"
            >
                <input
                    className="rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    value={form.data.title}
                    onChange={(e) => form.setData('title', e.target.value)}
                />
                <button className="rounded bg-indigo-600 px-3 py-2 text-white">Add</button>
            </form>
            {todos.map((todo) => (
                <div key={todo.id} className="mb-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
                    {todo.title} - {todo.status}
                </div>
            ))}
        </AuthenticatedLayout>
    );
}
