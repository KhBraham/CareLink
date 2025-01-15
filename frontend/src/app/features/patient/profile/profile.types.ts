export interface PatientProfile {
  id: number;
  user: {
    name: string;
    email: string;
  };
  date_of_birth: string;
  gender: string;
  phone_number: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  medical_history: string;
}
