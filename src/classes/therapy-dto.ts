export interface Therapy {
  _id?: string;
  adherence: number;
  validation_alexa: boolean;
  validation_phone?: boolean;
  validation_web?: boolean;
  edit?: "saved" | "new" | "updated" | "todelete" | "deleted";
  state: boolean;
  posology: string;
  hiring_time: "morning" | "afternoon" | "evening" | "no";
  meals?: "before" | "during" | "after" | "no";
  end_date?: Date;
  duration?: number;
  start_date: Date;
  delivery: Dose;
  drug: string;
  patient_id: string;
  __v?: number;
}

export interface Dose {
  scheduling_type: "daily" | "interval" | "weekly" | "once";
  options: Option[];
}

export interface Option {
  cadence: string[];
  max_delay: number;
  time: string;
}

export interface OptionExt {
  cadence: number;
  weekdays: string[];
  time: string;
}

export interface TherapyLog {
  _id: string;
  therapy_update: Therapy;
  date: Date;
  name: string;
  surname?: string;
  __v?: number;
}
