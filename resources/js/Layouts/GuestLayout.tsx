import ApplicationLogo from '@/Components/ApplicationLogo';
import { useTheme } from '@/hooks/useTheme';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    useTheme();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4 py-10 dark:bg-slate-950">
            <div className="mb-6">
                <Link href="/">
                    <ApplicationLogo className="h-16 w-16 fill-current text-indigo-600 dark:text-indigo-400" />
                </Link>
            </div>

            <div className="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white px-6 py-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
                {children}
            </div>
        </div>
    );
}
