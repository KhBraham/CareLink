<?php

namespace App\Http\Controllers;

use App\Models\MedicalRecord;
use App\Models\Doctor;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class MedicalRecordController extends Controller
{
    public function getPatientRecords($patientId)
    {
        // Verify if the authenticated user has access to these records
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // If user is a patient, they can only access their own records
        if ($user->role === 'patient') {
            $patient = Patient::where('user_id', $user->id)->first();
            if (!$patient || $patient->id != $patientId) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        $records = MedicalRecord::with(['doctor.user', 'appointment'])
            ->where('patient_id', $patientId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($record) {
                return [
                    'id' => $record->id,
                    'date' => Carbon::parse($record->appointment->appointment_datetime)->format('Y-m-d'),
                    'doctorName' => $record->doctor->user->name,
                    'doctorId' => $record->doctor_id,
                    'patientId' => $record->patient_id,
                    'symptoms' => $record->symptoms,
                    'diagnosis' => $record->diagnosis,
                    'treatment' => $record->treatment,
                    'prescription' => $record->prescription,
                    'notes' => $record->notes
                ];
            });

        return response()->json($records);
    }

    public function downloadRecords($patientId)
    {
        // Verify if the authenticated user has access to these records
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // If user is a patient, they can only access their own records
        if ($user->role === 'patient') {
            $patient = Patient::where('user_id', $user->id)->first();
            if (!$patient || $patient->id != $patientId) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        // Get patient information
        $patient = Patient::with('user')->find($patientId);
        if (!$patient) {
            return response()->json(['message' => 'Patient not found'], 404);
        }

        // Get all medical records
        $records = MedicalRecord::with(['doctor.user', 'appointment'])
            ->where('patient_id', $patientId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($record) {
                return [
                    'date' => Carbon::parse($record->appointment->appointment_datetime)->format('Y-m-d'),
                    'doctorName' => $record->doctor->user->name,
                    'symptoms' => $record->symptoms,
                    'diagnosis' => $record->diagnosis,
                    'treatment' => $record->treatment,
                    'prescription' => $record->prescription,
                    'notes' => $record->notes
                ];
            });

        $data = [
            'patient' => [
                'name' => $patient->user->name,
                'email' => $patient->user->email,
                'dateOfBirth' => Carbon::parse($patient->date_of_birth)->format('Y-m-d'),
                'gender' => $patient->gender,
                'phone' => $patient->phone_number,
                'address' => $patient->address,
                'emergencyContact' => [
                    'name' => $patient->emergency_contact_name,
                    'phone' => $patient->emergency_contact_phone
                ]
            ],
            'records' => $records,
            'generatedDate' => Carbon::now()->format('Y-m-d')
        ];

        $pdf = PDF::loadView('pdf.medical-records', $data);
        
        return $pdf->download('medical_records_' . $patient->user->name . '.pdf');
    }

    public function show($id)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $record = MedicalRecord::with(['doctor.user', 'patient.user', 'appointment'])->find($id);
        
        if (!$record) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        // Check authorization
        if ($user->role === 'patient') {
            $patient = Patient::where('user_id', $user->id)->first();
            if (!$patient || $patient->id !== $record->patient_id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        return response()->json([
            'id' => $record->id,
            'date' => Carbon::parse($record->appointment->appointment_datetime)->format('Y-m-d'),
            'doctorName' => $record->doctor->user->name,
            'doctorId' => $record->doctor_id,
            'patientId' => $record->patient_id,
            'symptoms' => $record->symptoms,
            'diagnosis' => $record->diagnosis,
            'treatment' => $record->treatment,
            'prescription' => $record->prescription,
            'notes' => $record->notes
        ]);
    }
}
