<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
class Task extends Model
{
    use HasFactory, SoftDeletes;
    protected $guarded = [];
    public function topic(): BelongsTo { return $this->belongsTo(Topic::class); }
}
