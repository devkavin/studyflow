import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
export default function Timer({activeSession}:{activeSession:any}) { const [session,setSession]=useState(activeSession); return <AuthenticatedLayout><Head title='Timer' /><h1 className='mb-4 text-2xl font-semibold'>Focus Timer</h1><div className='rounded bg-white p-4 shadow'><p>{session?`Active since ${session.start_time}`:'No active session'}</p><div className='mt-3 flex gap-2'><button className='rounded bg-green-600 px-3 py-2 text-white' onClick={async()=>setSession((await axios.post(route('timer.start'),{mode:'pomodoro'})).data)}>Start</button><button className='rounded bg-red-600 px-3 py-2 text-white' onClick={async()=>session&&setSession((await axios.post(route('timer.stop'),{session_id:session.id})).data)}>Stop</button></div></div></AuthenticatedLayout>; }
