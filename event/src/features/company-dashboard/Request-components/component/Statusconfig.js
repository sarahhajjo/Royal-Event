import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CancelIcon from '@mui/icons-material/Cancel';
import BlockIcon from '@mui/icons-material/Block';

// 💡 استيراد اللون الذهبي (عدلي المسار حسب مجلدك)
import { GOLD } from '../../../../utils/colorConstants';

export const REQUEST_STATUS_CONFIG = {
    pending: {
        accentColor: GOLD, // 💡 ذهبي للطلبات الجديدة
        badgeLabel: 'NEW REQUEST',
        BadgeIcon: AddCircleIcon,
        detailsLabel: 'OFFER DETAILS',
        detailsType: 'offer',
        buttonLabel: 'VIEW',
        buttonColor: GOLD,
    },
    accepted: {
        accentColor: '#ffa726', // برتقالي لانتظار الدفع
        badgeLabel: 'AWAITING PAYMENT',
        BadgeIcon: CheckCircleOutlinedIcon,
        detailsLabel: 'PAYMENT DETAILS',
        detailsType: 'offer',
        buttonLabel: 'VIEW',
        buttonColor: '#ffa726',
    },
    confirmed: {
        accentColor: '#29b6f6', // أزرق للتأكيد
        badgeLabel: 'CONFIRMED',
        BadgeIcon: CheckCircleIcon,
        detailsLabel: 'BOOKING DETAILS',
        detailsType: 'offer',
        buttonLabel: 'VIEW',
        buttonColor: '#29b6f6',
    },
    completed: {
        accentColor: '#4caf50', // أخضر للاكتمال
        badgeLabel: 'COMPLETED',
        BadgeIcon: DoneAllIcon,
        detailsLabel: 'SUMMARY',
        detailsType: 'offer',
        buttonLabel: 'VIEW RECEIPT',
        buttonColor: '#4caf50',
    },
    cancelled: {
        accentColor: '#ef5350', // أحمر للإلغاء
        badgeLabel: 'CANCELLATION ALERT',
        BadgeIcon: CancelIcon,
        detailsLabel: 'CANCELLATION REASON',
        detailsType: 'reason',
        buttonLabel: 'VIEW DETAILS',
        buttonColor: '#ef5350',
    },
    rejected: {
        accentColor: '#ef5350', // أحمر للرفض
        badgeLabel: 'REQUEST REJECTED',
        BadgeIcon: BlockIcon,
        detailsLabel: 'REASON',
        detailsType: 'reason',
        buttonLabel: 'VIEW',
        buttonColor: '#ef5350',
    },
};

export const getStatusConfig = (status) =>
    REQUEST_STATUS_CONFIG[status] || REQUEST_STATUS_CONFIG.pending;