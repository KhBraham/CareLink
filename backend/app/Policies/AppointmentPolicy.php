<?php

namespace App\Policies;

use App\Models\Appointment;
use App\Models\User;

class AppointmentPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // Everyone can view appointments list (filtered by role in controller)
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Appointment $appointment): bool
    {
        return $user->isAdmin() ||
            ($user->isDoctor() && $appointment->doctor_id === $user->doctor->id) ||
            ($user->isPatient() && $appointment->patient_id === $user->patient->id);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true; // Everyone can create appointments (validated in controller)
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Appointment $appointment): bool
    {
        return $user->isAdmin() ||
            ($user->isDoctor() && $appointment->doctor_id === $user->doctor->id);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Appointment $appointment): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can assign doctor to the model.
     */
    public function assignDoctor(User $user, Appointment $appointment): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can cancel the model.
     */
    public function cancel(User $user, Appointment $appointment): bool
    {
        return $user->isAdmin() ||
            ($user->isDoctor() && $appointment->doctor_id === $user->doctor->id) ||
            ($user->isPatient() && $appointment->patient_id === $user->patient->id);
    }

    /**
     * Determine whether the user can complete the model.
     */
    public function complete(User $user, Appointment $appointment): bool
    {
        return $user->isAdmin() ||
            ($user->isDoctor() && $appointment->doctor_id === $user->doctor->id);
    }
}
