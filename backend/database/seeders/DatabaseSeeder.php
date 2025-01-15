<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\MedicalRecord;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Faker\Factory;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin Users
        $admins = [
            [
                'name' => 'Admin User',
                'email' => 'admin@carelink.com',
            ],
            [
                'name' => 'System Admin',
                'email' => 'system.admin@carelink.com',
            ]
        ];

        foreach ($admins as $adminData) {
            User::create([
                'name' => $adminData['name'],
                'email' => $adminData['email'],
                'password' => Hash::make('password'),
                'role' => 'admin'
            ]);
        }

        // Create doctor users and their profiles
        $doctors = [
            ['name' => 'Dr. John Smith', 'email' => 'john.smith@carelink.com', 'specialization' => 'Cardiology', 'qualifications' => 'MD, PhD'],
            ['name' => 'Dr. Sarah Johnson', 'email' => 'sarah.johnson@carelink.com', 'specialization' => 'Pediatrics', 'qualifications' => 'MD'],
            ['name' => 'Dr. Michael Williams', 'email' => 'michael.williams@carelink.com', 'specialization' => 'Orthopedics', 'qualifications' => 'MD, MS'],
            ['name' => 'Dr. Emily Davis', 'email' => 'emily.davis@carelink.com', 'specialization' => 'Neurology', 'qualifications' => 'MD, PhD'],
            ['name' => 'Dr. Robert Chen', 'email' => 'robert.chen@carelink.com', 'specialization' => 'Dermatology', 'qualifications' => 'MD'],
            ['name' => 'Dr. Lisa Anderson', 'email' => 'lisa.anderson@carelink.com', 'specialization' => 'Psychiatry', 'qualifications' => 'MD, MPH'],
            ['name' => 'Dr. James Wilson', 'email' => 'james.wilson@carelink.com', 'specialization' => 'Internal Medicine', 'qualifications' => 'MD'],
            ['name' => 'Dr. Maria Garcia', 'email' => 'maria.garcia@carelink.com', 'specialization' => 'Gynecology', 'qualifications' => 'MD'],
            ['name' => 'Dr. David Kim', 'email' => 'david.kim@carelink.com', 'specialization' => 'Oncology', 'qualifications' => 'MD, PhD'],
            ['name' => 'Dr. Rachel Green', 'email' => 'rachel.green@carelink.com', 'specialization' => 'Endocrinology', 'qualifications' => 'MD']
        ];

        $doctorIds = [];
        foreach ($doctors as $doctorData) {
            $user = User::create([
                'name' => $doctorData['name'],
                'email' => $doctorData['email'],
                'password' => Hash::make('password'),
                'role' => 'doctor'
            ]);

            $doctor = Doctor::create([
                'user_id' => $user->id,
                'specialization' => $doctorData['specialization'],
                'qualifications' => $doctorData['qualifications'],
                'phone_number' => '+1' . rand(1000000000, 9999999999),
                'is_active' => true
            ]);

            $doctorIds[] = $doctor->id;
        }

        // Create patients
        $patients = [
            ['name' => 'Alice Brown', 'email' => 'alice.brown@example.com', 'gender' => 'female', 'dob' => '1990-05-15'],
            ['name' => 'Bob Wilson', 'email' => 'bob.wilson@example.com', 'gender' => 'male', 'dob' => '1985-03-22'],
            ['name' => 'Carol Martinez', 'email' => 'carol.martinez@example.com', 'gender' => 'female', 'dob' => '1992-11-08'],
            ['name' => 'David Lee', 'email' => 'david.lee@example.com', 'gender' => 'male', 'dob' => '1988-07-30'],
            ['name' => 'Emma Thompson', 'email' => 'emma.thompson@example.com', 'gender' => 'female', 'dob' => '1995-09-12'],
            ['name' => 'Frank Rodriguez', 'email' => 'frank.rodriguez@example.com', 'gender' => 'male', 'dob' => '1983-12-04'],
            ['name' => 'Grace Kim', 'email' => 'grace.kim@example.com', 'gender' => 'female', 'dob' => '1991-02-18'],
            ['name' => 'Henry Patel', 'email' => 'henry.patel@example.com', 'gender' => 'male', 'dob' => '1987-06-25'],
            ['name' => 'Isabella Santos', 'email' => 'isabella.santos@example.com', 'gender' => 'female', 'dob' => '1993-04-09'],
            ['name' => 'Jack Anderson', 'email' => 'jack.anderson@example.com', 'gender' => 'male', 'dob' => '1986-08-14']
        ];

        $patientIds = [];
        foreach ($patients as $patientData) {
            $user = User::create([
                'name' => $patientData['name'],
                'email' => $patientData['email'],
                'password' => Hash::make('password'),
                'role' => 'patient'
            ]);

            $patient = Patient::create([
                'user_id' => $user->id,
                'date_of_birth' => Carbon::createFromFormat('Y-m-d', $patientData['dob']),
                'gender' => $patientData['gender'],
                'phone_number' => '+1' . rand(1000000000, 9999999999),
                'address' => Factory::create()->address(),
                'emergency_contact_name' => Factory::create()->name(),
                'emergency_contact_phone' => '+1' . rand(1000000000, 9999999999),
                'medical_history' => Factory::create()->text(200)
            ]);

            $patientIds[] = $patient->id;
        }

        // Common medical conditions and treatments for realistic data
        $medicalConditions = [
            [
                'symptoms' => 'Persistent cough, fatigue, mild fever',
                'diagnosis' => 'Upper respiratory tract infection',
                'treatment' => 'Rest, increased fluid intake',
                'prescription' => 'Dextromethorphan 30mg every 6 hours'
            ],
            [
                'symptoms' => 'Severe headache, sensitivity to light',
                'diagnosis' => 'Migraine',
                'treatment' => 'Dark room rest, hydration',
                'prescription' => 'Sumatriptan 50mg as needed'
            ],
            [
                'symptoms' => 'Joint pain, morning stiffness',
                'diagnosis' => 'Osteoarthritis',
                'treatment' => 'Physical therapy, exercise',
                'prescription' => 'Ibuprofen 400mg as needed'
            ],
            [
                'symptoms' => 'Chest pain, shortness of breath',
                'diagnosis' => 'Hypertension',
                'treatment' => 'Diet modification, exercise',
                'prescription' => 'Lisinopril 10mg daily'
            ],
            [
                'symptoms' => 'Fatigue, weight gain, cold sensitivity',
                'diagnosis' => 'Hypothyroidism',
                'treatment' => 'Hormone replacement therapy',
                'prescription' => 'Levothyroxine 50mcg daily'
            ],
            [
                'symptoms' => 'Abdominal pain, bloating',
                'diagnosis' => 'Irritable Bowel Syndrome',
                'treatment' => 'Dietary changes, stress management',
                'prescription' => 'Dicyclomine 10mg as needed'
            ],
            [
                'symptoms' => 'Wheezing, shortness of breath',
                'diagnosis' => 'Asthma',
                'treatment' => 'Avoid triggers, use inhaler',
                'prescription' => 'Albuterol inhaler as needed'
            ],
            [
                'symptoms' => 'Itchy eyes, runny nose, sneezing',
                'diagnosis' => 'Seasonal allergies',
                'treatment' => 'Avoid allergens',
                'prescription' => 'Cetirizine 10mg daily'
            ],
            [
                'symptoms' => 'Anxiety, insomnia',
                'diagnosis' => 'Generalized Anxiety Disorder',
                'treatment' => 'Cognitive behavioral therapy',
                'prescription' => 'Sertraline 50mg daily'
            ],
            [
                'symptoms' => 'Back pain, muscle spasms',
                'diagnosis' => 'Lumbar strain',
                'treatment' => 'Physical therapy, rest',
                'prescription' => 'Cyclobenzaprine 5mg as needed'
            ]
        ];

        // Create 50 appointments and medical records
        $startDate = Carbon::now()->subYears(2);
        
        // First, create 10 records specifically for Alice Brown
        $aliceId = Patient::whereHas('user', function($query) {
            $query->where('email', 'alice.brown@example.com');
        })->first()->id;
        
        // Use only 3 specific doctors for Alice
        $aliceDoctors = array_slice($doctorIds, 0, 3);
        
        for ($i = 0; $i < 10; $i++) {
            $condition = $medicalConditions[array_rand($medicalConditions)];
            $appointmentDate = $startDate->copy()->addDays(rand(1, 730));
            
            $appointment = Appointment::create([
                'patient_id' => $aliceId,
                'doctor_id' => $aliceDoctors[$i % 3],
                'appointment_datetime' => $appointmentDate,
                'reason_for_visit' => $condition['symptoms'],
                'status' => 'completed',
                'notes' => Factory::create()->text(100)
            ]);

            MedicalRecord::create([
                'patient_id' => $aliceId,
                'doctor_id' => $appointment->doctor_id,
                'appointment_id' => $appointment->id,
                'symptoms' => $condition['symptoms'],
                'diagnosis' => $condition['diagnosis'],
                'treatment' => $condition['treatment'],
                'prescription' => $condition['prescription'],
                'notes' => Factory::create()->text(150)
            ]);
        }

        // Create remaining 40 records for other patients
        for ($i = 0; $i < 40; $i++) {
            $patientId = $patientIds[array_rand(array_filter($patientIds, fn($id) => $id !== $aliceId))];
            $doctorId = $doctorIds[array_rand($doctorIds)];
            $condition = $medicalConditions[array_rand($medicalConditions)];
            $appointmentDate = $startDate->copy()->addDays(rand(1, 730));

            $appointment = Appointment::create([
                'patient_id' => $patientId,
                'doctor_id' => $doctorId,
                'appointment_datetime' => $appointmentDate,
                'reason_for_visit' => $condition['symptoms'],
                'status' => 'completed',
                'notes' => Factory::create()->text(100)
            ]);

            MedicalRecord::create([
                'patient_id' => $patientId,
                'doctor_id' => $appointment->doctor_id,
                'appointment_id' => $appointment->id,
                'symptoms' => $condition['symptoms'],
                'diagnosis' => $condition['diagnosis'],
                'treatment' => $condition['treatment'],
                'prescription' => $condition['prescription'],
                'notes' => Factory::create()->text(150)
            ]);
        }
    }
}
