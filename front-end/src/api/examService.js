import axios from 'axios';

export const getAllExams = async () => {
  const response = await axios.get("http://localhost:8080/api/v1/exams/getAll");
  return response.data;
};
