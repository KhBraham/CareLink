<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class DoctorController extends Controller
{
    public function index()
    {
        return Doctor::with('user')->where('is_active', true)->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'specialization' => ['required', 'string'],
            'qualifications' => ['required', 'string'],
            'phone_number' => ['required', 'string'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'doctor',
        ]);

        $doctor = Doctor::create([
            'user_id' => $user->id,
            'specialization' => $request->specialization,
            'qualifications' => $request->qualifications,
            'phone_number' => $request->phone_number,
        ]);

        return response()->json($doctor->load('user'), 201);
    }

    public function show(Doctor $doctor)
    {
        return $doctor->load('user');
    }

    public function update(Request $request, Doctor $doctor)
    {
        $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:users,email,' . $doctor->user_id],
            'specialization' => ['sometimes', 'string'],
            'qualifications' => ['sometimes', 'string'],
            'phone_number' => ['sometimes', 'string'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if ($request->has('name') || $request->has('email')) {
            $doctor->user->update($request->only(['name', 'email']));
        }

        $doctor->update($request->only([
            'specialization',
            'qualifications',
            'phone_number',
            'is_active',
        ]));

        return response()->json($doctor->load('user'));
    }

    public function destroy(Doctor $doctor)
    {
        $doctor->user->delete(); // This will cascade delete the doctor record
        return response()->json(null, 204);
    }

    public function appointments(Doctor $doctor)
    {
        return $doctor->appointments()->with(['patient.user'])->get();
    }

    public function medicalRecords(Doctor $doctor)
    {
        return $doctor->medicalRecords()->with(['patient.user', 'appointment'])->get();
    }
}
