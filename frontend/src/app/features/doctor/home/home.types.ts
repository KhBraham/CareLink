export interface DoctorProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  specialization: string;
  licenseNumber: string;
  experience: number;
  education: string;
  address: string;
  biography?: string;
  consultationFee?: number;
  availableHours?: string;
  createdAt?: string;
  updatedAt?: string;
}
