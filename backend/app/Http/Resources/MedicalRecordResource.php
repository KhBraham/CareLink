<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MedicalRecordResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'patient_id' => $this->patient_id,
            'doctor_id' => $this->doctor_id,
            'appointment_id' => $this->appointment_id,
            'symptoms' => $this->symptoms,
            'diagnosis' => $this->diagnosis,
            'treatment' => $this->treatment,
            'prescription' => $this->prescription,
            'notes' => $this->notes,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'patient' => new PatientResource($this->whenLoaded('patient')),
            'doctor' => new DoctorResource($this->whenLoaded('doctor')),
            'appointment' => new AppointmentResource($this->whenLoaded('appointment')),
        ];
    }
}
