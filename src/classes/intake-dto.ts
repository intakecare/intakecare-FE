export interface IntakeDTO {
  _id: string;
  therapy_id: string;
  programmed_date: Date;
  intake_delay?: number;
  max_delay: number;
  notes?: string;
  status: "programmed" | "taken" | "missed";
  __v?: number;
}
