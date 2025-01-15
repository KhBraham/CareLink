<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MedicalRecord;
use App\Models\Patient;
use App\Models\Doctor;
use App\Models\Appointment;
use Carbon\Carbon;

class MedicalRecordSeeder extends Seeder
{
    public function run(): void
    {
        // Get Alice Brown's patient ID
        $patient = Patient::where('email', 'alice.brown@example.com')->first();
        
        // Get some doctors
        $doctors = Doctor::take(3)->get();
        
        if ($patient && $doctors->count() > 0) {
            // Create appointments for the medical records
            $appointments = [];
            foreach (range(1, 5) as $i) {
                $appointment = Appointment::create([
                    'patient_id' => $patient->id,
                    'doctor_id' => $doctors[($i - 1) % 3]->id,
                    'date' => Carbon::now()->subDays($i * 30),
                    'status' => 'completed'
                ]);
                $appointments[] = $appointment;
            }

            // Create medical records
            $records = [
                [
                    'symptoms' => 'Persistent cough, fatigue, and mild fever',
                    'diagnosis' => 'Upper respiratory tract infection',
                    'treatment' => 'Rest, increased fluid intake, and over-the-counter cough suppressants',
                    'prescription' => 'Dextromethorphan 30mg every 6 hours for 5 days',
                    'notes' => 'Follow up in 1 week if symptoms persist'
                ],
                [
                    'symptoms' => 'Severe headache, sensitivity to light, nausea',
                    'diagnosis' => 'Migraine',
                    'treatment' => 'Dark, quiet environment, adequate hydration',
                    'prescription' => 'Sumatriptan 50mg as needed, max 2 doses per 24 hours',
                    'notes' => 'Keep headache diary to track triggers'
                ],
                [
                    'symptoms' => 'Joint pain in knees, morning stiffness',
                    'diagnosis' => 'Osteoarthritis',
                    'treatment' => 'Physical therapy, weight management, regular exercise',
                    'prescription' => 'Ibuprofen 400mg every 6 hours as needed',
                    'notes' => 'Recommended swimming or cycling for low-impact exercise'
                ],
                [
                    'symptoms' => 'Itchy eyes, runny nose, sneezing',
                    'diagnosis' => 'Seasonal allergies',
                    'treatment' => 'Avoid known allergens, use air purifier',
                    'prescription' => 'Cetirizine 10mg daily',
                    'notes' => 'Consider allergy testing if symptoms worsen'
                ],
                [
                    'symptoms' => 'Difficulty sleeping, anxiety, restlessness',
                    'diagnosis' => 'Insomnia due to stress',
                    'treatment' => 'Sleep hygiene counseling, stress management techniques',
                    'prescription' => 'Melatonin 5mg before bedtime',
                    'notes' => 'Recommended meditation app and evening routine'
                ]
            ];

            foreach ($appointments as $index => $appointment) {
                MedicalRecord::create([
                    'patient_id' => $patient->id,
                    'doctor_id' => $appointment->doctor_id,
                    'appointment_id' => $appointment->id,
                    'symptoms' => $records[$index]['symptoms'],
                    'diagnosis' => $records[$index]['diagnosis'],
                    'treatment' => $records[$index]['treatment'],
                    'prescription' => $records[$index]['prescription'],
                    'notes' => $records[$index]['notes'],
                    'created_at' => $appointment->date,
                    'updated_at' => $appointment->date
                ]);
            }
        }
    }
}
