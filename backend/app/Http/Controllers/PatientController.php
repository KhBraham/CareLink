<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\User;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PatientController extends Controller
{
    /**
     * Display a listing of patients.
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        $search = $request->query('search', '');

        $query = Patient::query()
            ->with('user')
            ->select('patients.*');

        if ($search) {
            $query->whereHas('user', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            })
            ->orWhere('phone_number', 'like', "%{$search}%");
        }

        $patients = $query->orderBy('created_at', 'desc')->paginate($perPage);

        // Transform the data to match our interface
        $patients->through(function ($patient) {
            return [
                'id' => $patient->id,
                'user' => [
                    'name' => $patient->user->name,
                    'email' => $patient->user->email
                ],
                'date_of_birth' => $patient->date_of_birth,
                'gender' => $patient->gender,
                'phone_number' => $patient->phone_number,
                'address' => $patient->address,
                'emergency_contact_name' => $patient->emergency_contact_name,
                'emergency_contact_phone' => $patient->emergency_contact_phone,
                'medical_history' => $patient->medical_history
            ];
        });

        return response()->json($patients);
    }

    /**
     * Display a listing of appointments for the patient.
     */
    public function appointments(Patient $patient)
    {
        // Check if the authenticated user has access to this patient's data
        if (Auth::user()->role !== 'admin' && 
            Auth::user()->id !== $patient->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $appointments = Appointment::where('patient_id', $patient->id)
            ->with('doctor:id,user_id')
            ->with('doctor.user:id,name')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'patientId' => $appointment->patient_id,
                    'doctorId' => $appointment->doctor_id,
                    'doctorName' => $appointment->doctor ? $appointment->doctor->user->name : null,
                    'appointmentDate' => $appointment->appointment_datetime,
                    'reasonForVisit' => $appointment->reason_for_visit,
                    'status' => $appointment->status,
                    'createdAt' => $appointment->created_at,
                    'updatedAt' => $appointment->updated_at
                ];
            });

        return response()->json($appointments);
    }

    /**
     * Display the specified patient.
     */
    public function show(Patient $patient)
    {
        // Check if the authenticated user has access to this patient's data
        if (Auth::user()->role !== 'admin' && 
            Auth::user()->id !== $patient->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $patient->load('user');
        
        return response()->json([
            'id' => $patient->id,
            'user' => [
                'name' => $patient->user->name,
                'email' => $patient->user->email
            ],
            'date_of_birth' => $patient->date_of_birth,
            'gender' => $patient->gender,
            'phone_number' => $patient->phone_number,
            'address' => $patient->address,
            'emergency_contact_name' => $patient->emergency_contact_name,
            'emergency_contact_phone' => $patient->emergency_contact_phone,
            'medical_history' => $patient->medical_history
        ]);
    }

    /**
     * Store a newly created patient in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'date_of_birth' => 'required|date',
            'gender' => 'required|string|in:male,female,other',
            'phone_number' => 'required|string|max:20',
            'address' => 'required|string',
            'emergency_contact_name' => 'required|string|max:255',
            'emergency_contact_phone' => 'required|string|max:20',
            'medical_history' => 'nullable|string'
        ]);

        // Begin transaction
        DB::beginTransaction();

        try {
            // Create user first
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'role' => 'patient'
            ]);

            // Create patient record
            $patient = Patient::create([
                'user_id' => $user->id,
                'date_of_birth' => date('Y-m-d', strtotime($request->date_of_birth)),
                'gender' => $request->gender,
                'phone_number' => $request->phone_number,
                'address' => $request->address,
                'emergency_contact_name' => $request->emergency_contact_name,
                'emergency_contact_phone' => $request->emergency_contact_phone,
                'medical_history' => $request->medical_history
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Patient created successfully',
                'patient' => array_merge(
                    $patient->toArray(),
                    ['name' => $user->name, 'email' => $user->email]
                )
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Error creating patient',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified patient in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Patient  $patient
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Patient $patient)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $patient->user_id,
            'date_of_birth' => 'required|date',
            'gender' => 'required|string|in:male,female,other',
            'phone_number' => 'required|string|max:20',
            'address' => 'required|string',
            'emergency_contact_name' => 'required|string|max:255',
            'emergency_contact_phone' => 'required|string|max:20',
            'medical_history' => 'nullable|string'
        ]);

        // Begin transaction
        DB::beginTransaction();

        try {
            // Update user information
            $user = $patient->user;
            $user->update([
                'name' => $request->name,
                'email' => $request->email
            ]);

            // Update patient information
            $patient->update([
                'date_of_birth' => date('Y-m-d', strtotime($request->date_of_birth)),
                'gender' => $request->gender,
                'phone_number' => $request->phone_number,
                'address' => $request->address,
                'emergency_contact_name' => $request->emergency_contact_name,
                'emergency_contact_phone' => $request->emergency_contact_phone,
                'medical_history' => $request->medical_history ?: null
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Patient updated successfully',
                'patient' => [
                    'id' => $patient->id,
                    'user' => [
                        'name' => $user->name,
                        'email' => $user->email
                    ],
                    'date_of_birth' => $patient->date_of_birth,
                    'gender' => $patient->gender,
                    'phone_number' => $patient->phone_number,
                    'address' => $patient->address,
                    'emergency_contact_name' => $patient->emergency_contact_name,
                    'emergency_contact_phone' => $patient->emergency_contact_phone,
                    'medical_history' => $patient->medical_history
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Error updating patient',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified patient from storage.
     *
     * @param  \App\Models\Patient  $patient
     * @return \Illuminate\Http\Response
     */
    public function destroy(Patient $patient)
    {
        try {
            DB::beginTransaction();
            
            // Get the associated user ID
            $userId = $patient->user_id;
            
            // Delete the patient first (due to foreign key constraint)
            $patient->delete();
            
            // Delete the associated user
            User::find($userId)->delete();
            
            DB::commit();
            
            return response()->json([
                'message' => 'Patient deleted successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error deleting patient',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
