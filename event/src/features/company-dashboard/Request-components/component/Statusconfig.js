import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CancelIcon from '@mui/icons-material/Cancel';
import BlockIcon from '@mui/icons-material/Block';

/**
 * إعدادات موحّدة لكل حالة طلب: اللون، الأيقونة، نص الشارة، ونوع المحتوى
 * (offer = تفاصيل عرض بصيغة "التسمية: القيمة" | reason = نص سبب حر - للرفض/الإلغاء).
 *
 * كل الألوان مأخوذة من tokens الثيم القياسية بـ MUI (success/warning/info/error/text)
 * وهي موجودة تلقائياً بأي ثيم حتى لو مش معرّفة صراحة بملف theme عندك — فما في داعي
 * لتعديل ملف الثيم عشان هالكرت يشتغل.
 */
export const REQUEST_STATUS_CONFIG = {
    pending: {
        accentColor: 'success.main',
        badgeLabel: 'NEW REQUEST',
        BadgeIcon: AddCircleIcon,
        detailsLabel: 'OFFER DETAILS',
        detailsType: 'offer',
        buttonLabel: 'VIEW',
        buttonColor: 'primary.main', // نفس التصميم الأصلي المعتمد (ذهبي)
    },
    accepted: {
        accentColor: 'warning.main',
        badgeLabel: 'AWAITING PAYMENT',
        BadgeIcon: CheckCircleOutlinedIcon,
        detailsLabel: 'PAYMENT DETAILS',
        detailsType: 'offer',
        buttonLabel: 'VIEW',
        buttonColor: 'warning.main',
    },
    confirmed: {
        accentColor: 'info.main',
        badgeLabel: 'CONFIRMED',
        BadgeIcon: CheckCircleIcon,
        detailsLabel: 'BOOKING DETAILS',
        detailsType: 'offer',
        buttonLabel: 'VIEW',
        buttonColor: 'info.main',
    },
    completed: {
        accentColor: 'text.secondary',
        badgeLabel: 'COMPLETED',
        BadgeIcon: DoneAllIcon,
        detailsLabel: 'SUMMARY',
        detailsType: 'offer',
        buttonLabel: 'VIEW RECEIPT',
        buttonColor: 'text.secondary',
    },
    cancelled: {
        accentColor: 'error.light',
        badgeLabel: 'CANCELLATION ALERT',
        BadgeIcon: CancelIcon,
        detailsLabel: 'CANCELLATION REASON',
        detailsType: 'reason',
        buttonLabel: 'VIEW DETAILS',
        buttonColor: 'error.light',
    },
    rejected: {
        accentColor: 'error.main',
        badgeLabel: 'REQUEST REJECTED',
        BadgeIcon: BlockIcon,
        detailsLabel: 'REASON',
        detailsType: 'reason',
        buttonLabel: 'VIEW',
        buttonColor: 'error.main',
    },
};

export const getStatusConfig = (status) =>
    REQUEST_STATUS_CONFIG[status] || REQUEST_STATUS_CONFIG.pending;