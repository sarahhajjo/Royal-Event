import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/auth';

const register = async (userData) => {
    const response = await axios.post(`http://localhost:8000/api/auth/register`, userData);
    return response.data;
};

const login = async (userData) => {
    // إرسال البيانات كـ x-www-form-urlencoded
    const response = await axios.post(`${API_URL}/login`, new URLSearchParams(userData).toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    if (response.data.data.access_token) {
        localStorage.setItem('token', response.data.data.access_token);
    }
    return response.data;
};

const getCategories = async () => {
    const response = await axios.get(`http://127.0.0.1:8000/api/categories`);
    return response.data;
};
const getDistricts = async () => {
    const response = await axios.get(`http://127.0.0.1:8000/api/districts`);
    return response.data;
};
// في authService.js
const setupProfile = async (profileData) => {
    const token = localStorage.getItem('token');
    const URL = 'http://127.0.0.1:8000/api/provider/complete-profile';

    return await axios.post(URL, profileData, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json', // أضيفي هذا السطر
            'Authorization': `Bearer ${token}`
        }
    });
};
// في authService.js
const setupfreelancerProfile = async (profileData) => {
    const token = localStorage.getItem('token');
    return await axios.post('http://127.0.0.1:8000/api/provider/complete-profile', profileData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
};


const verifyOTP = async (data) => {
    // بناءً على Postman، البيانات ترسل كـ x-www-form-urlencoded
    const response = await axios.post(`http://127.0.0.1:8000/api/auth/verify-otp`, new URLSearchParams(data).toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    // إذا كان الـ API يعيد token عند التحقق، يفضل تخزينه
    if (response.data.data && response.data.data.access_token) {
        localStorage.setItem('token', response.data.data.access_token);
    }
    return response.data;
};
const verifyEmailOTP = async (data) => {
    // بناءً على طلبك، الإيميل والرمز يرسلان كـ params في الـ URL
    const response = await axios.post(`http://127.0.0.1:8000/api/auth/verify-email-otp`, null, {
        params: { email: data.email, otp: data.otp }
    });
    if (response.data.data?.access_token) {
        localStorage.setItem('token', response.data.data.access_token);
    }
    return response.data;
};
const authService = { register, login,getCategories,getDistricts , verifyOTP ,setupProfile ,setupfreelancerProfile,verifyEmailOTP};
export default authService;