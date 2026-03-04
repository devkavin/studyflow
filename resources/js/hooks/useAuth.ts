import { usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';

export type AuthUser = PageProps['auth']['user'];

export function useAuthUser(): AuthUser | null {
    const { props } = usePage<PageProps>();

    return props.auth?.user ?? null;
}
