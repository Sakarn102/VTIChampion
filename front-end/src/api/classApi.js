import axiosClient from "./axiosClient";

const classApi = {
    getAll: () => axiosClient.get("/classes"),
    getStudentCounts: () => axiosClient.get("/classes/student-counts"),
};

export default classApi;
