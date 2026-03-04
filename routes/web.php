<?php

use App\Http\Controllers\Curriculum\QuickImportController;
use App\Http\Controllers\Curriculum\SubjectController;
use App\Http\Controllers\Curriculum\TaskController;
use App\Http\Controllers\Curriculum\TopicController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Planner\PlannerController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\Stats\StatsController;
use App\Http\Controllers\Timer\FocusSessionController;
use App\Http\Controllers\TodoController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health', fn () => response()->json(['status' => 'ok']));

Route::get('/', fn () => Inertia::render('Welcome'))->name('home');
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/curriculum', [SubjectController::class, 'index'])->name('curriculum.index');
    Route::post('/subjects', [SubjectController::class, 'store'])->name('subjects.store');
    Route::post('/topics', [TopicController::class, 'store'])->name('topics.store');
    Route::post('/tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::patch('/tasks/{task}/status', [TaskController::class, 'updateStatus'])->name('tasks.status');
    Route::post('/curriculum/import', QuickImportController::class)->name('curriculum.import');

    Route::get('/planner', [PlannerController::class, 'index'])->name('planner.index');
    Route::post('/planner/auto-plan', [PlannerController::class, 'autoPlan'])->name('planner.autoplan');

    Route::get('/timer', [FocusSessionController::class, 'index'])->name('timer.index');
    Route::post('/timer/start', [FocusSessionController::class, 'start'])->name('timer.start');
    Route::post('/timer/stop', [FocusSessionController::class, 'stop'])->name('timer.stop');

    Route::get('/todos', [TodoController::class, 'index'])->name('todos.index');
    Route::post('/todos', [TodoController::class, 'store'])->name('todos.store');
    Route::patch('/todos/{todo}/status', [TodoController::class, 'updateStatus'])->name('todos.status');

    Route::get('/stats', [StatsController::class, 'index'])->name('stats.index');

    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::patch('/settings', [SettingsController::class, 'update'])->name('settings.update');
});

require __DIR__.'/auth.php';
