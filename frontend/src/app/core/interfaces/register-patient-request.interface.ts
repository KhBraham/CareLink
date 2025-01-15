export interface RegisterPatientRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  phone_number: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  medical_history: string;
}
