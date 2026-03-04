# Package Inventory

| Package | Purpose | Why chosen | Key config | Where used |
|---|---|---|---|---|
| laravel/breeze | lightweight auth scaffolding | low overhead | inertia react ts preset | auth flows |
| laravel/sanctum | session/cookie auth | standard laravel session auth | stateful domains env | web auth middleware |
| laravel/socialite | Google OAuth | official social auth | config/services.php google | GoogleAuthController |
| spatie/laravel-backup | backup automation | proven package | config/backup.php | `backup:run` + cron |
| barryvdh/laravel-debugbar | dev diagnostics | standard in laravel | APP_DEBUG local | local dev |
| pestphp/pest | testing | expressive Laravel tests | pest.php bootstrap | tests/Feature |
| react-hook-form + zod | frontend forms/validation | low re-render + typed schemas | resolver in forms | React pages |
| @tanstack/react-query | server state caching | reliable async cache | QueryClient provider | stats expansion |
| recharts | charts | simple + lightweight | n/a | stats page charts |
| dnd-kit | drag/drop planner | modern maintained | sensors/sortable | planner page |
| sonner | toasts | light, accessible | Toaster root | UI notifications |
