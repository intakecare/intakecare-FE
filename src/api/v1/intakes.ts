import * as fetchApi from "../fetchApi";

export async function getIntakes(
  start_date: Date,
  end_date: Date,
  therapy_id?: string,
  patient_id?: string
) {
  return await fetchApi.getHttp(
    `/api/intakes${therapy_id ? "/" + therapy_id : ""}`,
    {
      start: start_date.toISOString(),
      end: end_date.toISOString(),
      id: patient_id,
    }
  );
}

export async function getAllIntakes(
  therapy_id: string,
  patient_id: string,
  start_date: Date,
  end_date: Date,
  
  
) {
  return await fetchApi.getHttp(
    `/api/intakes/all`,
    {
      therapyId: therapy_id,
      patientId: patient_id,
      start: start_date.toISOString(),
      end: end_date.toISOString(),
    }
  );
}

/*export async function getIntakesById(
  therapy_id: string,
  start_date: Date,
  end_date: Date,
) {
  return await fetchApi.getHttp(
    `/api/intakes/therapy/${therapy_id}`,
    {
      id: therapy_id,
      start: start_date.toISOString(),
      end: end_date.toISOString(),
    }
  );
}*/
