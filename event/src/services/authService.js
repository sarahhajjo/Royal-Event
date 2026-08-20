import api from './api'; // 💡 استخدام المعترض المركزي

const register = async (userData) => {
    const response = await api.post(`/auth/register`, userData);
    return response.data;
};

const login = async (userData) => {
    const response = await api.post(`/auth/login`, new URLSearchParams(userData).toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    if (response.data.data && response.data.data.access_token) {
        const token = response.data.data.access_token;
        localStorage.setItem('token', token);
        console.log("تم استلام التوكن بنجاح:", token);
    }

    return response.data;
};

const getCategories = async () => {
    const response = await api.get(`/categories`);
    return response.data;
};

const getDistricts = async () => {
    const response = await api.get(`/districts`);
    return response.data;
};

const setupProfile = async (profileData) => {
    const response = await api.post('/provider/complete-profile', profileData);
    return response;
};

const setupfreelancerProfile = async (profileData) => {
    const response = await api.post('/provider/complete-profile', profileData);
    return response;
};

const verifyOTP = async (data) => {
    const response = await api.post(`/auth/verify-otp`, new URLSearchParams(data).toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    if (response.data.data && response.data.data.access_token) {
        localStorage.setItem('token', response.data.data.access_token);
    }
    return response.data;
};

const verifyEmailOTP = async (data) => {
    const response = await api.post(`/auth/verify-email-otp`, new URLSearchParams(data).toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    if (response.data.data?.access_token) {
        localStorage.setItem('token', response.data.data.access_token);
    }
    return response.data;
};

const resendOTP = async (data) => {
    const response = await api.post(`/otp/resend`, data);
    return response.data;
};

const authService = { register, login, getCategories, getDistricts, verifyOTP, setupProfile, setupfreelancerProfile, verifyEmailOTP, resendOTP };

export default authService;