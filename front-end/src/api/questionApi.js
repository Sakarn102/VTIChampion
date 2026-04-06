import axiosClient from "./axiosClient";

export const questionApi = {
    getMyQuestions: (params) => axiosClient.get("/questions/my-questions", { params }),
    getAll: (params) => axiosClient.get("/questions", { params }),
    createQuestion: (data) => axiosClient.post("/questions/create-question", data),
    updateQuestion: (id, data) => axiosClient.put(`/questions/update-question/${id}`, data),
    deleteQuestion: (id) => axiosClient.delete(`/questions/delete-question/${id}`),
    importQuestions: (file, examId) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("examId", examId);
        return axiosClient.post("/questions/import", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    },
    downloadTemplate: () => axiosClient.get("/questions/download-template", { responseType: 'blob' })
};

export default questionApi;
