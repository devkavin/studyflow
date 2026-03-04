<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class StoreTopicRequest extends FormRequest { public function authorize(): bool { return true; } public function rules(): array { return ['subject_id'=>'required|exists:subjects,id','name'=>'required|string|max:120','target_minutes'=>'required|integer|min:15','due_date'=>'nullable|date']; }}
