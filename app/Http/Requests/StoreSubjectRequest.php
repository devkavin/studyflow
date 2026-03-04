<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class StoreSubjectRequest extends FormRequest { public function authorize(): bool { return true; } public function rules(): array { return ['name'=>'required|string|max:120','color'=>'nullable|string|max:20','priority'=>'required|integer|min:1|max:5']; }}
