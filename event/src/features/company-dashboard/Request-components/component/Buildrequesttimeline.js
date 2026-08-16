// المسار الطبيعي (Happy Path) لأي طلب لسا ماشي بشكل طبيعي
const HAPPY_PATH = [
    { key: 'pending', label: 'Request Sent' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'completed', label: 'Completed' },
];

// المسار لما ينلغى/يترفض الطلب
const NEGATIVE_PATH = {
    cancelled: [
        { key: 'pending', label: 'Request Sent' },
        { key: 'in_review', label: 'Under Review' },
        { key: 'cancelled', label: 'Cancelled' },
    ],
    rejected: [
        { key: 'pending', label: 'Request Sent' },
        { key: 'in_review', label: 'Under Review' },
        { key: 'rejected', label: 'Rejected' },
    ],
};

/**
 * يبني الخط الزمني للطلب.
 *
 * ✅ لو الطلب جاي من الـ backend وفيه request.timeline جاهزة، منستخدمها هي كما هي
 *    (الشكل المتوقع لكل عنصر: { label, date, completed, isTerminalNegative? }).
 * ⚠️ إذا مافي، منولّد خط زمني افتراضي بالاعتماد على status + date + timeAgo الحاليين
 *    فقط (تقريبي، مش دقيق 100% لأنه ما عنا تواريخ حقيقية لكل مرحلة).
 *    الأفضل لاحقاً إن الـ backend يرجّع request.timeline مباشرة لدقة أعلى.
 */
export const buildRequestTimeline = (request) => {
    if (Array.isArray(request.timeline) && request.timeline.length > 0) {
        return request.timeline;
    }

    const { status, date, timeAgo } = request;

    if (status === 'cancelled' || status === 'rejected') {
        const path = NEGATIVE_PATH[status] || NEGATIVE_PATH.cancelled;
        return path.map((step, idx) => ({
            label: step.label,
            date: idx === 0 ? date || '—' : idx === path.length - 1 ? timeAgo || '—' : '—',
            completed: true, // كل الخطوات وصلت فعلياً لحد نقطة الإلغاء/الرفض
            isTerminalNegative: idx === path.length - 1,
        }));
    }

    const currentIndex = HAPPY_PATH.findIndex((s) => s.key === status);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;

    return HAPPY_PATH.map((step, idx) => ({
        label: step.label,
        date: idx === 0 ? date || '—' : idx <= safeIndex ? timeAgo || '—' : '—',
        completed: idx <= safeIndex,
        isTerminalNegative: false,
    }));
};