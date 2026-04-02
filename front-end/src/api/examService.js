import axiosClient from './axiosClient';

export const getAllExams = async (params = {}) => {
  return axiosClient.get("/exams/getAll", { params });
};

export const createExam = async (data) => {
  return axiosClient.post("/exams/create-exam", data);
};

export const updateExam = async (id, data) => {
  return axiosClient.put(`/exams/update-exam/${id}`, data);
};

export const getExamById = async (id) => {
  return axiosClient.get(`/exams/${id}`);
};

export const deleteExam = async (id) => {
  return axiosClient.delete(`/exams/${id}`);
};
