import { usePage } from '@inertiajs/react';

export type AuthUser = {
    name?: string;
    email?: string;
    email_verified_at?: string | null;
    timezone?: string;
    daily_study_goal_minutes?: number;
    pomodoro_focus_minutes?: number;
    pomodoro_break_minutes?: number;
    pomodoro_long_break_minutes?: number;
    pomodoro_long_break_interval?: number;
};

export function useAuthUser(): AuthUser | null {
    const { props } = usePage();
    const auth = (props as { auth?: { user?: AuthUser | null } }).auth;

    return auth?.user ?? null;
}
