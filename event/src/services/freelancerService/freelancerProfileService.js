import freelancerApi from './FreelancerApi';

// 1. جلب بيانات الملف الشخصي الكاملة للفريلانسر
const getMyProfile = async () => {
    const response = await freelancerApi.get('/provider/profile'); // أو المسار المعرف في الباك إند لديكِ
    return response.data;
};

// 2. تحديث بيانات الملف الشخصي (مثل الـ brand_name و experience_years)
const updateMyProfile = async (profileData) => {
    const response = await freelancerApi.put('/provider/profile', profileData);
    return response.data;
};

// 3. جلب رابط QR Code الخاص بالدفع
const getFreelancerQrCode = async () => {
    const response = await freelancerApi.get('/provider/qr');
    return response.data;
};

// 4. رفع أو تحديث صورة الـ QR Code للدفع
const uploadFreelancerQrCode = async (file) => {
    const formData = new FormData();
    formData.append("qr_image", file); // تأكدي أن اسم الحقل مطابق للباك إند (مثلاً qr_code أو image)

    const response = await freelancerApi.post('/provider/upload-qr', formData, { // 👈 انتبهي: هنا الرابط /upload-qr
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
};

const freelancerProfileService = {
    getMyProfile,
    updateMyProfile,
    getFreelancerQrCode,
    uploadFreelancerQrCode
};

export default freelancerProfileService;