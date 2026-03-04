import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
export default function Stats({stats}:{stats:any}) { return <AuthenticatedLayout><Head title='Stats' /><h1 className='mb-4 text-2xl font-semibold'>Statistics</h1><div className='grid gap-3 md:grid-cols-4'>{['today_minutes','week_minutes','month_minutes','completion_rate'].map(k=><div key={k} className='rounded bg-white p-4 shadow'><p className='text-sm text-slate-500'>{k}</p><p className='text-xl font-semibold'>{stats[k]}</p></div>)}</div></AuthenticatedLayout>; }
