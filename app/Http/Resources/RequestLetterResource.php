<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RequestLetterResource extends JsonResource
{
    public function toArray($request)
    {
        // Parse stages map
        $toStagesMap = json_decode($this->to_stages ?? '{}', true);
        $rejectedStagesMap = json_decode($this->rejected_stages ?? '{}', true);
        $stageId = $this->stages['id'] ?? null;

        return [
            'id' => $this->id,
            'request_name' => $this->request_name,
            'user' => $this->user,
            'stages' => [
                // ...$this->stages,
                ...$this->stages->toArray(),
                'to_stage_id' => $toStagesMap[$stageId] ?? null,
                'rejected_id' => $rejectedStagesMap[$stageId] ?? null,
            ],
            'memo' => $this->memo,
            'progress_stages' => json_decode($this->progress_stages ?? '[]', true),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            // 'progress' => RequestStagesResourc::collection($this->progress),
        ];
    }
}
