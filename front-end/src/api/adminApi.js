import axiosClient from './axiosClient';

const adminApi = {
    getDashboardStats: () => axiosClient.get('/admin/dashboard/stats'),
    createAccount: (data) => axiosClient.post('/admin/create-account', data),
};

export default adminApi;
