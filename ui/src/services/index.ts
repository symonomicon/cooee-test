import axios from 'axios'

const BASE_URL = 'http://localhost:3001'; // process env replacable

export interface SubmitObj {
    make: string | null;
    model: string | null;
    badge: string | null;
    logbook: File | null;
  }
  
  interface SubmitResponse {
    message: string;
  }

async function getAvailableVehicles() {
  try {
    const response = await axios.get(`${BASE_URL}/vehicles`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function submitForm(formData: SubmitObj) {
    try {
        console.log(formData)
      const response = await axios.post(`${BASE_URL}/submit`, formData, {headers: {
        'Content-Type': 'multipart/form-data'
      }});
      console.log(response.data)
      return response.data;
    } catch (error) {
      throw error;
    }
  }
   

export {
    getAvailableVehicles,
    submitForm
}