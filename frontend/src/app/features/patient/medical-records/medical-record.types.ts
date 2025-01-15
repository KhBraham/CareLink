export interface MedicalRecord {
    id: number;
    patientId: number;
    doctorId: number;
    doctorName: string;
    date: string;
    symptoms: string;
    diagnosis: string;
    treatment: string;
    prescription: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}
