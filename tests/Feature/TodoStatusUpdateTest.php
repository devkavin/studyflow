<?php

use App\Models\TodoItem;
use App\Models\User;

it('updates a todo status for the authenticated owner', function () {
    $user = User::factory()->create();
    $todo = TodoItem::create([
        'user_id' => $user->id,
        'title' => 'Review algebra notes',
        'status' => 'todo',
    ]);

    $response = $this
        ->actingAs($user)
        ->patch(route('todos.status', $todo), ['status' => 'doing']);

    $response->assertRedirect();

    expect($todo->fresh()->status)->toBe('doing');
});

it('forbids updating another users todo status', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();

    $todo = TodoItem::create([
        'user_id' => $owner->id,
        'title' => 'Complete practice quiz',
        'status' => 'todo',
    ]);

    $response = $this
        ->actingAs($otherUser)
        ->patch(route('todos.status', $todo), ['status' => 'done']);

    $response->assertForbidden();
    expect($todo->fresh()->status)->toBe('todo');
});
