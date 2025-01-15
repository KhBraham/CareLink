<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Appointment::with(['patient.user', 'doctor.user']);

        // Filter based on user role
        if (Auth::user()->isDoctor()) {
            $query->where('doctor_id', Auth::user()->doctor->id);
        } elseif (Auth::user()->isPatient()) {
            $query->where('patient_id', Auth::user()->patient->id);
        }

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range if provided
        if ($request->has('start_date')) {
            $query->whereDate('appointment_datetime', '>=', $request->start_date);
        }
        if ($request->has('end_date')) {
            $query->whereDate('appointment_datetime', '<=', $request->end_date);
        }

        return $query->orderBy('appointment_datetime')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => ['required_without:doctor_id', 'exists:patients,id'],
            'doctor_id' => ['required_without:patient_id', 'exists:doctors,id'],
            'appointment_datetime' => ['required', 'date', 'after:now'],
            'reason_for_visit' => ['required', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        // If patient is creating appointment
        if (Auth::user()->isPatient()) {
            $request->merge(['patient_id' => Auth::user()->patient->id]);
        }
        // If doctor is creating appointment
        elseif (Auth::user()->isDoctor()) {
            $request->merge(['doctor_id' => Auth::user()->doctor->id]);
        }

        $appointment = Appointment::create($request->all());
        return response()->json($appointment->load(['patient.user', 'doctor.user']), 201);
    }

    public function show(Appointment $appointment)
    {
        $this->authorize('view', $appointment);
        return $appointment->load(['patient.user', 'doctor.user']);
    }

    public function update(Request $request, Appointment $appointment)
    {
        $this->authorize('update', $appointment);

        $request->validate([
            'doctor_id' => ['sometimes', 'exists:doctors,id'],
            'appointment_datetime' => ['sometimes', 'date', 'after:now'],
            'status' => ['sometimes', 'string', 'in:pending,confirmed,cancelled,completed'],
            'notes' => ['sometimes', 'nullable', 'string'],
        ]);

        $appointment->update($request->all());
        return response()->json($appointment->load(['patient.user', 'doctor.user']));
    }

    public function destroy(Appointment $appointment)
    {
        $this->authorize('delete', $appointment);
        $appointment->delete();
        return response()->json(null, 204);
    }

    public function assignDoctor(Request $request, Appointment $appointment)
    {
        $this->authorize('assignDoctor', $appointment);

        $request->validate([
            'doctor_id' => ['required', 'exists:doctors,id'],
        ]);

        $doctor = Doctor::findOrFail($request->doctor_id);
        
        $appointment->update([
            'doctor_id' => $doctor->id,
            'status' => 'confirmed'
        ]);

        return response()->json($appointment->load(['patient.user', 'doctor.user']));
    }

    public function cancel(Appointment $appointment)
    {
        $this->authorize('cancel', $appointment);
        
        $appointment->update(['status' => 'cancelled']);
        return response()->json($appointment->load(['patient.user', 'doctor.user']));
    }

    public function complete(Appointment $appointment)
    {
        $this->authorize('complete', $appointment);
        
        $appointment->update(['status' => 'completed']);
        return response()->json($appointment->load(['patient.user', 'doctor.user']));
    }
}
