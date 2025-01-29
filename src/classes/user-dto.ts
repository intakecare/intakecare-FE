export interface UserDTO { //default
  user: {
    _id: string;
    name: string;
    surname: string;
    cf: string;
    email: string;
    email_alexa: string
    phone: string;
    user_type: string;
    new_user: boolean;
    endpoint: string;
    expirationTime: number;
    key_p256dh: string;
    key_auth: string;
    persona_id: number;
  };
  /**@deprecated*/
  access_token: string;
}

export interface UserUpdateDTO {
  user:{
    name?: string;
    surname?: string;
    cf?: string;
    sex?: string;
    dob?: Date;
    residence?: string;
    email?: string;
    email_alexa?: string;
    phone?: string;
    endpoint?: string;
    expirationTime?: number;
    key_p256dh?: string;
    key_auth?: string;
    persona_id?: number;
  }
}

export interface UserCreateDTO {
  user: {
    name?: string;
    surname?: string;
    cf?: string;
    sex?: string;
    dob?: Date;
    residence?: string;
    email?: string;
    email_alexa?: string;
    phone?: string;
    endpoint?: string;
    expirationTime?: number;
    key_p256dh?: string;
    key_auth?: string;
    persona_id?: number;
  };
  username: string;
  patient: {}
}

export interface CreateDoctorDto {
  user: {
    name: string;
    surname?: string;
    credentials_id?: string;
    cf?: string;
    email?: string;
    user_type?: string;
    phone?: string;
  };
  username: string;
  doctor: {
    user_id?: string;
  };
}
