import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

// جلب بيانات بروفايل الشركة
const getProviderProfile = async () => {
    // جلب التوكن المخزن عند تسجيل الدخول (تأكدي من الاسم اللي عم تحفظيه بـ localStorage)
    const token = localStorage.getItem('token');

    const response = await axios.get(`${API_URL}/provider/profile`, {
        headers: {
            Authorization: `Bearer ${token}`, // إرسال التوكن للباك إند للحماية
        },
    });

    return response.data; // سيرجع الـ JSON كامل { status: "success", data: {...} }
};

const providerService = {
    getProviderProfile,
};

export default providerService;