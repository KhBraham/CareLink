<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MedicalRecord;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MedicalRecordController extends Controller
{
    public function index(Request $request)
    {
        $query = MedicalRecord::with(['patient.user', 'doctor.user', 'appointment']);

        // Filter based on user role
        if (Auth::user()->isDoctor()) {
            $query->where('doctor_id', Auth::user()->doctor->id);
        } elseif (Auth::user()->isPatient()) {
            $query->where('patient_id', Auth::user()->patient->id);
        }

        return $query->latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'appointment_id' => ['required', 'exists:appointments,id'],
            'symptoms' => ['required', 'string'],
            'diagnosis' => ['required', 'string'],
            'treatment' => ['required', 'string'],
            'prescription' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        $appointment = Appointment::findOrFail($request->appointment_id);
        
        // Ensure the doctor creating the record is assigned to the appointment
        if (Auth::user()->isDoctor() && $appointment->doctor_id !== Auth::user()->doctor->id) {
            return response()->json(['message' => 'You are not authorized to create a medical record for this appointment'], 403);
        }

        $medicalRecord = MedicalRecord::create([
            'patient_id' => $appointment->patient_id,
            'doctor_id' => $appointment->doctor_id,
            'appointment_id' => $appointment->id,
            'symptoms' => $request->symptoms,
            'diagnosis' => $request->diagnosis,
            'treatment' => $request->treatment,
            'prescription' => $request->prescription,
            'notes' => $request->notes,
        ]);

        // Mark the appointment as completed
        $appointment->update(['status' => 'completed']);

        return response()->json($medicalRecord->load(['patient.user', 'doctor.user', 'appointment']), 201);
    }

    public function show(MedicalRecord $medicalRecord)
    {
        $this->authorize('view', $medicalRecord);
        return $medicalRecord->load(['patient.user', 'doctor.user', 'appointment']);
    }

    public function update(Request $request, MedicalRecord $medicalRecord)
    {
        $this->authorize('update', $medicalRecord);

        $request->validate([
            'symptoms' => ['sometimes', 'string'],
            'diagnosis' => ['sometimes', 'string'],
            'treatment' => ['sometimes', 'string'],
            'prescription' => ['sometimes', 'nullable', 'string'],
            'notes' => ['sometimes', 'nullable', 'string'],
        ]);

        $medicalRecord->update($request->all());
        return response()->json($medicalRecord->load(['patient.user', 'doctor.user', 'appointment']));
    }

    public function destroy(MedicalRecord $medicalRecord)
    {
        $this->authorize('delete', $medicalRecord);
        $medicalRecord->delete();
        return response()->json(null, 204);
    }
}
