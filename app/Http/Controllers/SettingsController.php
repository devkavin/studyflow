<?php
namespace App\Http\Controllers;
use App\Http\Requests\UpdateSettingsRequest;
use Inertia\Inertia;
class SettingsController extends Controller
{
    public function index() { return Inertia::render('Settings/Index'); }
    public function update(UpdateSettingsRequest $request) { $request->user()->update($request->validated()); return back(); }
}
