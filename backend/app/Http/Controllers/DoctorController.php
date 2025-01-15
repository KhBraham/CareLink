<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class DoctorController extends Controller
{
    /**
     * Display a listing of the doctors.
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        $search = $request->query('search', '');

        $query = Doctor::query()
            ->join('users', 'doctors.user_id', '=', 'users.id')
            ->select(
                'doctors.id',
                'users.name',
                'users.email',
                'doctors.specialization',
                'doctors.phone_number',
                'doctors.qualifications'
            );

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('users.name', 'like', "%{$search}%")
                  ->orWhere('users.email', 'like', "%{$search}%")
                  ->orWhere('doctors.specialization', 'like', "%{$search}%")
                  ->orWhere('doctors.phone_number', 'like', "%{$search}%");
            });
        }

        $doctors = $query->orderBy('users.name')->paginate($perPage);

        return response()->json($doctors);
    }

    /**
     * Store a newly created doctor in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'phone_number' => 'required|string|max:20',
            'specialization' => 'required|string|max:255',
            'qualifications' => 'required|string|max:255'
        ]);

        DB::beginTransaction();
        try {
            // Create user first
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'doctor'
            ]);

            // Create doctor profile
            $doctor = Doctor::create([
                'user_id' => $user->id,
                'specialization' => $request->specialization,
                'qualifications' => $request->qualifications,
                'phone_number' => $request->phone_number
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Doctor created successfully',
                'doctor' => [
                    'id' => $doctor->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'specialization' => $doctor->specialization,
                    'qualifications' => $doctor->qualifications,
                    'phone_number' => $doctor->phone_number
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Error creating doctor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified doctor.
     */
    public function show($id)
    {
        try {
            $doctor = Doctor::with('user')->findOrFail($id);
            
            return response()->json([
                'id' => $doctor->id,
                'name' => $doctor->user->name,
                'email' => $doctor->user->email,
                'specialization' => $doctor->specialization,
                'qualifications' => $doctor->qualifications,
                'phone_number' => $doctor->phone_number,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified doctor in storage.
     */
    public function update(Request $request, $id)
    {
        $doctor = Doctor::with('user')->findOrFail($id);

        $request->validate([
            'specialization' => 'sometimes|required|string|max:255',
            'qualifications' => 'sometimes|required|string',
            'phone_number' => 'sometimes|required|string|max:20',
            'email' => 'sometimes|required|email|unique:users,email,' . $doctor->user->id,
            'password' => 'nullable|min:8'  
        ]);

        DB::beginTransaction();
        try {
            // Update doctor-specific fields
            $doctor->update($request->only(['specialization', 'qualifications', 'phone_number']));

            // Update user fields if provided
            if ($request->has('email') || $request->has('password')) {
                $userUpdate = [];
                if ($request->has('email')) {
                    $userUpdate['email'] = $request->email;
                }
                if ($request->has('password') && !empty($request->password)) {
                    $userUpdate['password'] = bcrypt($request->password);
                }
                if (!empty($userUpdate)) {
                    $doctor->user->update($userUpdate);
                }
            }

            DB::commit();

            // Refresh the doctor model to get updated data
            $doctor->refresh();
            $doctor->load('user');

            return response()->json([
                'message' => 'Doctor updated successfully',
                'doctor' => [
                    'id' => $doctor->id,
                    'name' => $doctor->user->name,
                    'email' => $doctor->user->email,
                    'specialization' => $doctor->specialization,
                    'qualifications' => $doctor->qualifications,
                    'phone_number' => $doctor->phone_number
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating doctor: ' . $e->getMessage());
            return response()->json(['error' => 'Error updating doctor: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified doctor from storage.
     */
    public function destroy($id)
    {
        $doctor = Doctor::findOrFail($id);
        $doctor->user()->delete(); // This will cascade delete the doctor record as well
        return response()->json(['message' => 'Doctor deleted successfully']);
    }
}
