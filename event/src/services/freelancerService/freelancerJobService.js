import freelancerApi from './FreelancerApi'; // 👈 استيراد الكلاس المستقل

// جلب الوظائف المتاحة
const getJobOffers = async () => {
    const response = await freelancerApi.get('/job-offers');
    return response.data.data || response.data;
};

// جلب تفاصيل وظيفة محددة
const getJobOfferById = async (id) => {
    const response = await freelancerApi.get(`/job-offers/${id}`);
    return response.data.data;
};

// التقديم على وظيفة
const applyForJob = async (id) => {
    // نمرر كائن فارغ {} كجسم للطلب (body) لأن الطلب POST
    const response = await freelancerApi.post(`/job-offers/${id}/apply`, {});
    return response.data;
};

// جلب الوظائف التي قدمت عليها
const getMyAppliedJobs = async () => {
    const response = await freelancerApi.get('/my-applied-jobs');
    return response.data.data;
};

const freelancerJobService = {
    getJobOffers,
    getJobOfferById,
    applyForJob,
    getMyAppliedJobs,
};

export default freelancerJobService;