export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    timezone?: string;
    daily_study_goal_minutes?: number;
    pomodoro_focus_minutes?: number;
    pomodoro_break_minutes?: number;
    pomodoro_long_break_minutes?: number;
    pomodoro_long_break_interval?: number;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User | null;
    };
};
