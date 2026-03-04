import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

type Subject = {
    id: number;
    name: string;
    topics?: { id: number }[];
};

export default function Index({ subjects }: { subjects: Subject[] }) {
    const subjectForm = useForm({ name: '', color: '#3b82f6', priority: 3 });
    const importForm = useForm({ input: '' });

    return (
        <AuthenticatedLayout>
            <Head title="Curriculum" />
            <h1 className="mb-4 text-2xl font-semibold text-slate-900 dark:text-slate-100">Curriculum</h1>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    subjectForm.post(route('subjects.store'));
                }}
                className="mb-4 flex gap-2"
            >
                <input
                    aria-label="Subject name"
                    className="rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    value={subjectForm.data.name}
                    onChange={(e) => subjectForm.setData('name', e.target.value)}
                />
                <button className="rounded bg-indigo-600 px-3 py-2 text-white">Add Subject</button>
            </form>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    importForm.post(route('curriculum.import'));
                }}
                className="mb-6 flex gap-2"
            >
                <input
                    aria-label="Quick import"
                    className="flex-1 rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    value={importForm.data.input}
                    onChange={(e) => importForm.setData('input', e.target.value)}
                />
                <button className="rounded bg-slate-800 px-3 py-2 text-white dark:bg-slate-700">Quick Add</button>
            </form>

            <div className="space-y-3">
                {subjects.map((subject) => (
                    <div key={subject.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
                        <h2 className="font-medium text-slate-900 dark:text-slate-100">{subject.name}</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{subject.topics?.length ?? 0} topics</p>
                    </div>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}
