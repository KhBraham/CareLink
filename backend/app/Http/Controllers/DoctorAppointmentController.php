<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\MedicalRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class DoctorAppointmentController extends Controller
{
    /**
     * Get upcoming appointments for the authenticated doctor
     */
    public function upcoming()
    {
        try {
            $user = Auth::user();
            $doctor = Doctor::where('user_id', $user->id)->firstOrFail();

            $appointments = Appointment::where('doctor_id', $doctor->id)
                ->whereIn('status', ['confirmed', 'completed'])
                ->where('appointment_datetime', '>=', Carbon::now()->startOfDay())
                ->with(['patient' => function($query) {
                    $query->select('id', 'user_id')
                        ->with(['user' => function($q) {
                            $q->select('id', 'name');
                        }]);
                }])
                ->orderBy('appointment_datetime', 'asc')
                ->get()
                ->map(function ($appointment) {
                    return [
                        'id' => $appointment->id,
                        'appointment_datetime' => $appointment->appointment_datetime,
                        'reason_for_visit' => $appointment->reason_for_visit,
                        'status' => $appointment->status,
                        'notes' => $appointment->notes,
                        'patient' => [
                            'id' => $appointment->patient->id,
                            'name' => $appointment->patient->user->name
                        ]
                    ];
                });

            return response()->json([
                'data' => $appointments
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching appointments',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index()
    {
        try {
            $user = Auth::user();
            $doctor = Doctor::where('user_id', $user->id)->firstOrFail();

            $appointments = Appointment::with(['patient.user'])
                ->where('doctor_id', $doctor->id)
                ->where('status', '!=', 'cancelled')
                ->where('appointment_datetime', '>=', Carbon::now()->startOfDay())
                ->orderBy('appointment_datetime', 'asc')
                ->get()
                ->map(function ($appointment) {
                    return [
                        'id' => $appointment->id,
                        'appointment_datetime' => $appointment->appointment_datetime,
                        'reason_for_visit' => $appointment->reason_for_visit,
                        'status' => $appointment->status,
                        'patient' => [
                            'id' => $appointment->patient->id,
                            'name' => $appointment->patient->user->name
                        ]
                    ];
                });

            return response()->json([
                'data' => $appointments
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching appointments',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $user = Auth::user();
            $doctor = Doctor::where('user_id', $user->id)->firstOrFail();

            $appointment = Appointment::with([
                'patient.user',
                'patient' => function($query) {
                    $query->select(
                        'id',
                        'user_id',
                        'date_of_birth',
                        'gender',
                        'phone_number',
                        'address',
                        'emergency_contact_name',
                        'emergency_contact_phone',
                        'medical_history'
                    );
                }
            ])
            ->where('doctor_id', $doctor->id)
            ->findOrFail($id);

            // Fetch medical records for the patient
            $medicalRecords = MedicalRecord::with(['doctor.user'])
                ->where('patient_id', $appointment->patient->id)
                ->orderBy('created_at', 'desc')
                ->get();

            // Add medical records to the response
            $appointment->patient->medicalRecords = $medicalRecords;

            return response()->json([
                'data' => $appointment
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching appointment details',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = Auth::user();
            $doctor = Doctor::where('user_id', $user->id)->firstOrFail();

            $appointment = Appointment::where('doctor_id', $doctor->id)
                ->findOrFail($id);

            // Update appointment status and notes
            $appointment->update([
                'status' => $request->status,
                'notes' => $request->notes
            ]);

            // Create a new medical record
            if ($request->status === 'completed') {
                MedicalRecord::create([
                    'patient_id' => $appointment->patient_id,
                    'doctor_id' => $doctor->id,
                    'appointment_id' => $appointment->id,
                    'symptoms' => $request->symptoms ?? '',
                    'diagnosis' => $request->diagnosis ?? '',
                    'treatment' => $request->treatment ?? '',
                    'prescription' => $request->prescription,
                    'notes' => $request->notes
                ]);
            }

            return response()->json([
                'message' => 'Appointment updated successfully',
                'data' => $appointment
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating appointment',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
