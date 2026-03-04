<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
class Topic extends Model
{
    use HasFactory, SoftDeletes;
    protected $guarded = [];
    public function subject(): BelongsTo { return $this->belongsTo(Subject::class); }
    public function tasks(): HasMany { return $this->hasMany(Task::class); }
}
