export interface Appointment {
    id?: number;
    patientId: number;
    doctorId?: number;
    appointmentDate: string;
    reasonForVisit: string;
    status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    createdAt?: string;
    updatedAt?: string;
}

export interface AppointmentResponse extends Appointment {
    id: number;
    doctorName?: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}
