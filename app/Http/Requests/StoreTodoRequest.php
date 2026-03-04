<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class StoreTodoRequest extends FormRequest { public function authorize(): bool { return true; } public function rules(): array { return ['title'=>'required|string|max:255','status'=>'required|in:todo,doing,done','subject_id'=>'nullable|exists:subjects,id','topic_id'=>'nullable|exists:topics,id','due_date'=>'nullable|date']; }}
