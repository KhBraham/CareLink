<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DoctorAppointmentController;
use App\Http\Controllers\ChatbotController;

// Handle preflight OPTIONS requests
Route::options('/{any}', function () {
    return response()->json(['status' => 'success'])
        ->header('Access-Control-Allow-Origin', 'http://localhost:4200')
        ->header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN')
        ->header('Access-Control-Allow-Credentials', 'true');
})->where('any', '.*');

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/admin/login', [AuthController::class, 'adminLogin']);
Route::get('/news/health', [NewsController::class, 'getHealthNews']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Dashboard routes
    Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);

    // Doctor routes
    Route::apiResource('doctors', DoctorController::class);
    Route::get('doctors/{doctor}/appointments', [DoctorController::class, 'appointments']);
    Route::get('doctors/{doctor}/medical-records', [DoctorController::class, 'medicalRecords']);
    Route::get('/doctors/{id}', [DoctorController::class, 'show']);
    Route::put('/doctors/{id}', [DoctorController::class, 'update']);

    // Doctor dashboard routes
    Route::get('/doctor/appointments/upcoming', [DoctorAppointmentController::class, 'upcoming']);

    // Doctor appointment routes
    Route::prefix('doctor')->group(function () {
        Route::get('appointments/upcoming', [DoctorAppointmentController::class, 'index']);
        Route::get('appointments/{id}', [DoctorAppointmentController::class, 'show']);
    });

    // Doctor Routes
    Route::middleware(['auth:sanctum'])->prefix('doctor')->group(function () {
        Route::get('/appointments', [DoctorAppointmentController::class, 'index']);
        Route::get('/appointments/{id}', [DoctorAppointmentController::class, 'show']);
        Route::put('/appointments/{id}', [DoctorAppointmentController::class, 'update']);
    });

    // Patient routes
    Route::apiResource('patients', PatientController::class);
    Route::get('patients/{patient}/appointments', [PatientController::class, 'appointments']);
    Route::get('patients/{patient}/medical-records', [PatientController::class, 'medicalRecords']);

    // Appointment routes
    Route::get('appointments/recent', [AppointmentController::class, 'getRecentAppointments']);
    Route::get('appointments/{id}/details', [AppointmentController::class, 'getAppointmentDetails']);
    Route::apiResource('appointments', AppointmentController::class);
    Route::post('appointments/{appointment}/assign-doctor', [AppointmentController::class, 'assignDoctor']);
    Route::post('appointments/{appointment}/cancel', [AppointmentController::class, 'cancel']);
    Route::post('appointments/{appointment}/complete', [AppointmentController::class, 'complete']);

    // Medical Record routes
    Route::apiResource('medical-records', MedicalRecordController::class);

    // Medical Records Routes
    Route::get('/medical-records/patient/{patientId}', [MedicalRecordController::class, 'getPatientRecords']);
    Route::get('/medical-records/{patientId}/download', [MedicalRecordController::class, 'downloadRecords']);
    Route::get('/medical-records/record/{id}', [MedicalRecordController::class, 'show']);

    // News routes
    Route::get('/news/health', [NewsController::class, 'getHealthNews']);

    // Chatbot route
    Route::post('/chatbot', [ChatbotController::class, 'handleMessage']);
});
