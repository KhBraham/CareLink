export interface User {
    id: number;
    name: string;
    email: string;
    role: 'patient' | 'doctor' | 'admin';
    profile?: {
        patientId?: number;
        doctorId?: number;
        dateOfBirth?: string;
        gender?: string;
        phone?: string;
        address?: string;
        specialization?: string;
        qualifications?: string;
    };
    token?: string;
}
