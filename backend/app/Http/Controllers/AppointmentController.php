<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\MedicalRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AppointmentController extends Controller
{
    /**
     * Get recent appointments
     */
    public function getRecentAppointments()
    {
        // Get the 10 most recent appointments with their relationships
        $appointments = Appointment::with(['patient.user', 'doctor.user'])
            ->whereIn('status', ['pending', 'confirmed'])
            ->orderBy('appointment_datetime', 'desc')
            ->take(10)
            ->get();

        return response()->json($appointments->map(function ($appointment) {
            return [
                'id' => $appointment->id,
                'date' => date('Y-m-d', strtotime($appointment->appointment_datetime)),
                'time' => date('H:i', strtotime($appointment->appointment_datetime)),
                'patientName' => $appointment->patient->user->name,
                'doctorName' => $appointment->doctor ? $appointment->doctor->user->name : 'Not Assigned',
                'type' => $appointment->reason_for_visit,
                'status' => $appointment->status
            ];
        }));
    }

    /**
     * Get appointment details
     */
    public function getAppointmentDetails($id)
    {
        $appointment = Appointment::with(['patient.user', 'doctor.user'])
            ->findOrFail($id);

        // Get patient's medical records
        $medicalRecords = MedicalRecord::where('patient_id', $appointment->patient_id)
            ->with('doctor.user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'id' => $appointment->id,
            'date' => date('Y-m-d', strtotime($appointment->appointment_datetime)),
            'time' => date('H:i', strtotime($appointment->appointment_datetime)),
            'patient' => [
                'id' => $appointment->patient->id,
                'name' => $appointment->patient->user->name,
                'dateOfBirth' => date('Y-m-d', strtotime($appointment->patient->date_of_birth)),
                'gender' => $appointment->patient->gender,
                'phone' => $appointment->patient->phone_number ?? 'Not provided',
                'email' => $appointment->patient->user->email,
            ],
            'doctor' => $appointment->doctor ? [
                'id' => $appointment->doctor->id,
                'name' => $appointment->doctor->user->name,
                'specialization' => $appointment->doctor->specialization,
                'qualifications' => $appointment->doctor->qualifications,
            ] : null,
            'type' => $appointment->type,
            'status' => $appointment->status,
            'symptoms' => $appointment->symptoms,
            'reason_for_visit' => $appointment->reason_for_visit,
            'medicalRecords' => $medicalRecords->map(function ($record) {
                return [
                    'id' => $record->id,
                    'date' => $record->created_at->format('Y-m-d'),
                    'diagnosis' => $record->diagnosis,
                    'prescription' => $record->prescription,
                    'notes' => $record->notes,
                    'doctorName' => $record->doctor->user->name
                ];
            })
        ]);
    }

    /**
     * Store a newly created appointment in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'patientId' => 'required|exists:patients,id',
            'appointmentDate' => 'required|date',
            'reasonForVisit' => 'required|string'
        ]);

        // Check if the authenticated user has access to create this appointment
        $patient = Patient::find($request->patientId);
        if (!$patient || (Auth::user()->role !== 'admin' && Auth::user()->id !== $patient->user_id)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $appointment = Appointment::create([
            'patient_id' => $request->patientId,
            'appointment_datetime' => $request->appointmentDate,
            'reason_for_visit' => $request->reasonForVisit,
            'status' => 'pending'
        ]);

        // Load the doctor information if available
        $appointment->load(['doctor.user']);

        return response()->json([
            'id' => $appointment->id,
            'patientId' => $appointment->patient_id,
            'doctorId' => $appointment->doctor_id,
            'doctorName' => $appointment->doctor ? $appointment->doctor->user->name : null,
            'appointmentDate' => $appointment->appointment_datetime,
            'reasonForVisit' => $appointment->reason_for_visit,
            'status' => $appointment->status,
            'createdAt' => $appointment->created_at,
            'updatedAt' => $appointment->updated_at
        ]);
    }

    /**
     * Update the specified appointment in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'doctorId' => 'required|exists:doctors,id',
            'appointmentDate' => 'required|date',
            'appointmentTime' => 'required',
            'status' => 'required|in:pending,confirmed,cancelled'
        ]);

        $appointment = Appointment::findOrFail($id);
        
        $appointment->doctor_id = $request->doctorId;
        $appointment->appointment_datetime = $request->appointmentDate . ' ' . $request->appointmentTime;
        $appointment->status = $request->status;
        $appointment->save();

        return response()->json(['message' => 'Appointment updated successfully']);
    }

    /**
     * Cancel the specified appointment.
     */
    public function cancel(Appointment $appointment)
    {
        // Check if the authenticated user has access to cancel this appointment
        if (Auth::user()->role !== 'admin' && 
            Auth::user()->id !== $appointment->patient->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $appointment->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Appointment cancelled successfully']);
    }
}
