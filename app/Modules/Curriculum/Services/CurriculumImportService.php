<?php

namespace App\Modules\Curriculum\Services;

class CurriculumImportService
{
    public function parse(string $input): array
    {
        $subjects = [];
        foreach (array_filter(array_map('trim', explode(';', $input))) as $segment) {
            [$subject, $topics] = array_pad(array_map('trim', explode(':', $segment, 2)), 2, '');
            if (! $subject) continue;
            $subjects[] = [
                'name' => $subject,
                'topics' => array_values(array_filter(array_map('trim', explode(',', $topics)))),
            ];
        }

        return $subjects;
    }
}
