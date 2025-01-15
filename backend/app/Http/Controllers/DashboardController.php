<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Appointment;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function getStats()
    {
        $totalPatients = Patient::count();
        $totalDoctors = Doctor::count();
        $pendingAppointments = Appointment::where('status', 'pending')->count();

        return response()->json([
            'totalPatients' => $totalPatients,
            'totalDoctors' => $totalDoctors,
            'pendingAppointments' => $pendingAppointments
        ]);
    }
}
