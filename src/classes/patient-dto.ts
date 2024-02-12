export default interface PatientDTO {
  _id?: string;
  sex?: string;
  dob?: Date;
  residence?: string;
  name?: string;
  surname?: string;
  cf?: string;
  email?: string;
  phone?: string;
  username?: string;
  adherence?: number;
  validationAlexaDefault?: boolean;
  validationPhoneDefault?: boolean;
  validationWebDefault?: boolean;
}

export interface patientUpdateDTO {
  user?: {
    name?: string;
    surname?: string;
    cf?: string;
    email?: string;
    phone?: string;
  };
  patient?: {
    dob?: string;
    sex?: string;
    residence?: string;
    validationAlexaDefault?: boolean;
    validationPhoneDefault?: boolean;
    validationWebDefault?: boolean;
  };
}
