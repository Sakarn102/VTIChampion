import axiosClient from "./axiosClient";
import { message } from "antd";

/**
 * @param {Object} params - Chứa các field: page, size, keyworld, classId, creatorId, startDate, endDate
 */

export async function getExams(params) {
  try {
    const queryParams = {
      ...params,
      page: params.page ? params.page - 1 : 0,
      size: params.size || 5,
    };

    // Correct path from ExamController is /exams/getAll
    const response = await axiosClient.get(`/exams/getAll`, { params: queryParams });
    return response;
  } catch (error) {
    message.error("Không thể tải danh sách bài thi!");
    throw error;
  }
}

export const examApi = {
  getAll: (params) => getExams(params),
  create: (data) => axiosClient.post("/exams/create-exam", data),
  update: (id, data) => axiosClient.put(`/exams/${id}`, data),
  delete: (id) => axiosClient.delete(`/exams/${id}`)
};

export default examApi;
