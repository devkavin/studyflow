<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class StopFocusSessionRequest extends FormRequest { public function authorize(): bool { return true; } public function rules(): array { return ['session_id'=>'required|integer|exists:focus_sessions,id']; }}
