<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class PatientController extends Controller
{
    public function index()
    {
        return Patient::with('user')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'date_of_birth' => ['required', 'date'],
            'gender' => ['required', 'string', 'in:male,female,other'],
            'phone_number' => ['required', 'string'],
            'address' => ['required', 'string'],
            'emergency_contact_name' => ['required', 'string'],
            'emergency_contact_phone' => ['required', 'string'],
            'medical_history' => ['nullable', 'string'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'patient',
        ]);

        $patient = Patient::create([
            'user_id' => $user->id,
            'date_of_birth' => $request->date_of_birth,
            'gender' => $request->gender,
            'phone_number' => $request->phone_number,
            'address' => $request->address,
            'emergency_contact_name' => $request->emergency_contact_name,
            'emergency_contact_phone' => $request->emergency_contact_phone,
            'medical_history' => $request->medical_history,
        ]);

        return response()->json($patient->load('user'), 201);
    }

    public function show(Patient $patient)
    {
        return $patient->load('user');
    }

    public function update(Request $request, Patient $patient)
    {
        $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:users,email,' . $patient->user_id],
            'date_of_birth' => ['sometimes', 'date'],
            'gender' => ['sometimes', 'string', 'in:male,female,other'],
            'phone_number' => ['sometimes', 'string'],
            'address' => ['sometimes', 'string'],
            'emergency_contact_name' => ['sometimes', 'string'],
            'emergency_contact_phone' => ['sometimes', 'string'],
            'medical_history' => ['sometimes', 'nullable', 'string'],
        ]);

        if ($request->has('name') || $request->has('email')) {
            $patient->user->update($request->only(['name', 'email']));
        }

        $patient->update($request->only([
            'date_of_birth',
            'gender',
            'phone_number',
            'address',
            'emergency_contact_name',
            'emergency_contact_phone',
            'medical_history',
        ]));

        return response()->json($patient->load('user'));
    }

    public function destroy(Patient $patient)
    {
        $patient->user->delete(); // This will cascade delete the patient record
        return response()->json(null, 204);
    }

    public function appointments(Patient $patient)
    {
        return $patient->appointments()->with(['doctor.user'])->get();
    }

    public function medicalRecords(Patient $patient)
    {
        return $patient->medicalRecords()->with(['doctor.user', 'appointment'])->get();
    }
}
