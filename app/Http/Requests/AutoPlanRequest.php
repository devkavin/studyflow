<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class AutoPlanRequest extends FormRequest { public function authorize(): bool { return true; } public function rules(): array { return ['days'=>'required|array|min:1','minutes_per_day'=>'required|integer|min:15|max:600']; }}
