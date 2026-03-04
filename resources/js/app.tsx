import '../css/app.css';
import './bootstrap';
import 'react-datepicker/dist/react-datepicker.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

const appName = import.meta.env.VITE_APP_NAME || 'StudyFlow';
const queryClient = new QueryClient();

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        createRoot(el).render(
            <QueryClientProvider client={queryClient}>
                <App {...props} />
                <Toaster richColors position="top-right" />
            </QueryClientProvider>,
        );
    },
    progress: { color: '#4B5563' },
});
