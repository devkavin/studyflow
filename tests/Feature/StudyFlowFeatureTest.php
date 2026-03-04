<?php

use App\Models\FocusSession;
use App\Models\Subject;
use App\Models\Task;
use App\Models\Topic;
use App\Models\User;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use Laravel\Socialite\Facades\Socialite;

it('google oauth callback creates and logs in user', function () {
    $socialiteUser = \Mockery::mock(SocialiteUser::class);
    $socialiteUser->shouldReceive('getAttribute')->with('email')->andReturn('test@example.com');
    $socialiteUser->email = 'test@example.com';
    $socialiteUser->name = 'Study User';
    $socialiteUser->id = 'gid_1';
    $socialiteUser->avatar = 'https://avatar';

    Socialite::shouldReceive('driver->stateless->user')->andReturn($socialiteUser);

    $this->get(route('google.callback'))->assertRedirect(route('dashboard'));
    $this->assertDatabaseHas('users', ['email' => 'test@example.com', 'google_id' => 'gid_1']);
});

it('creates subject topic task', function () {
    $user = User::factory()->create();
    $this->actingAs($user)->post(route('subjects.store'), ['name' => 'Math', 'color' => '#111', 'priority' => 3]);
    $subject = Subject::first();
    $this->actingAs($user)->post(route('topics.store'), ['subject_id' => $subject->id, 'name' => 'Algebra', 'target_minutes' => 120]);
    $topic = Topic::first();
    $this->actingAs($user)->post(route('tasks.store'), ['topic_id' => $topic->id, 'title' => 'Worksheet', 'estimated_minutes' => 30, 'status' => 'todo', 'priority' => 3]);
    $this->assertDatabaseHas('tasks', ['title' => 'Worksheet']);
});

it('starts and stops focus session', function () {
    $user = User::factory()->create();
    $start = $this->actingAs($user)->postJson(route('timer.start'), ['mode' => 'pomodoro'])->assertOk()->json();
    $this->actingAs($user)->postJson(route('timer.stop'), ['session_id' => $start['id']])->assertOk();
    expect(FocusSession::first()->duration_seconds)->toBeGreaterThanOrEqual(0);
});

it('stats returns totals', function () {
    $this->withoutVite();
    $user = User::factory()->create();
    FocusSession::create(['user_id' => $user->id, 'start_time' => now()->subHour(), 'end_time' => now(), 'duration_seconds' => 1800, 'mode' => 'custom', 'is_active' => false]);
    $this->actingAs($user)->get(route('stats.index'))->assertOk();
});
