<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class UpdateSettingsRequest extends FormRequest { public function authorize(): bool { return true; } public function rules(): array { return ['timezone'=>'required|string|max:64','daily_study_goal_minutes'=>'required|integer|min:15|max:1000','pomodoro_focus_minutes'=>'required|integer|min:5|max:120','pomodoro_break_minutes'=>'required|integer|min:1|max:30','pomodoro_long_break_minutes'=>'required|integer|min:5|max:60','pomodoro_long_break_interval'=>'required|integer|min:2|max:8']; }}
