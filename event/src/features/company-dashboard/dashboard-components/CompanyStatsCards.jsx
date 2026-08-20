import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useTheme, alpha } from '@mui/material/styles';
import { useSelector } from 'react-redux';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LayersIcon from '@mui/icons-material/Layers';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

// 💡 استيراد الألوان الموحدة
import {
    GOLD, BROWN_TEXT, MUTED_TEXT,
    LIGHT_CARD, LIGHT_BORDER, LIGHT_INPUT,
    DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_CARD_SHADOW, DARK_CARD_HOVER_SHADOW
} from '../../../utils/colorConstants';

const iconMap = {
    revenue: <AttachMoneyIcon sx={{ color: GOLD, fontSize: '20px' }} />,
    listings: <LayersIcon sx={{ color: GOLD, fontSize: '20px' }} />,
    pending: <AccessTimeIcon sx={{ color: GOLD, fontSize: '20px' }} />,
    events: <EventAvailableIcon sx={{ color: GOLD, fontSize: '20px' }} />,
    wallet: <AccountBalanceWalletIcon sx={{ color: GOLD, fontSize: '20px' }} />
};

function CompanyStatsCards({ statsData }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const user = useSelector((state) => state.auth?.user);
    const walletBalance = user?.wallet_balance || 0;

    const defaultStats = statsData || [
        { id: 1, title: 'My Wallet', value: `${Number(walletBalance).toLocaleString()} SYP`, info: 'Available Balance', icon: 'wallet' },
        { id: 2, title: 'Total Revenue', value: '$1.24M', info: '+12% this month', icon: 'revenue' },
        { id: 3, title: 'Active Listings', value: '42', info: 'Premium venues', icon: 'listings' },
        { id: 4, title: 'Pending Requests', value: '18', info: 'Needs review', icon: 'pending', alert: true },
    ];

    // 💡 جلب الرابط الأساسي ديناميكياً من ملف .env
    const getWalletUrl = () => {
        const mode = import.meta.env.VITE_ENV_MODE;
        const apiUrl = mode === 'ngrok'
            ? import.meta.env.VITE_API_NGROK
            : import.meta.env.VITE_API_LOCAL;

        // إزالة '/api' من النهاية للحصول على الرابط الأساسي للموقع (إذا كان رابط المحفظة خارج الـ api)
        const baseUrl = apiUrl?.replace(/\/api$/, '') || 'http://127.0.0.1:8000';

        // مسار المحفظة (يمكنك تعديل /wallet حسب المسار الصحيح لديك)
        return `${baseUrl}/wallet`;
    };

    const handleCardClick = (stat) => {
        // تنفيذ التوجيه فقط إذا كان الكرت هو كرت المحفظة
        if (stat.icon === 'wallet') {
            const walletUrl = getWalletUrl();
            window.location.href = walletUrl;
            // 💡 ملاحظة: استخدمي window.open(walletUrl, '_blank') إذا أردتِ فتحه في نافذة جديدة
        }
    };

    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' }, gap: 2.5, width: '100%', boxSizing: 'border-box' }}>
            {defaultStats.map((stat) => (
                <Paper
                    key={stat.id}
                    elevation={0}
                    onClick={() => handleCardClick(stat)} // 💡 إضافة حدث الضغط هنا
                    sx={{
                        p: 2.6, minHeight: 126,
                        background: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
                        border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
                        borderRadius: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1.6,
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: stat.icon === 'wallet' ? 'pointer' : 'default', // 💡 تغيير شكل الماوس للمحفظة فقط
                        backdropFilter: 'blur(16px)',
                        boxShadow: isDark ? DARK_CARD_SHADOW : `0 18px 40px ${alpha(GOLD, 0.1)}`,
                        '&:hover': {
                            transform: stat.icon === 'wallet' ? 'translateY(-4px)' : 'none', // 💡 تفعيل الحركة للمحفظة فقط
                            boxShadow: stat.icon === 'wallet' ? (isDark ? DARK_CARD_HOVER_SHADOW : `0 20px 44px ${alpha(GOLD, 0.2)}`) : 'none',
                            borderColor: stat.icon === 'wallet' ? (isDark ? alpha(GOLD, 0.3) : GOLD) : (isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`)
                        },
                        '&:active': {
                            transform: stat.icon === 'wallet' ? 'scale(0.98) translateY(-2px)' : 'none',
                            transition: 'all 0.05s ease'
                        }
                    }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, fontSize: '12px', fontFamily: "'Inter', sans-serif", fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            {stat.title}
                        </Typography>
                        <Box sx={{ display: 'flex', p: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : LIGHT_INPUT, border: isDark ? '1px solid rgba(255,255,255,0.1)' : `1px solid ${alpha(GOLD, 0.2)}`, borderRadius: '12px' }}>
                            {iconMap[stat.icon]}
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ color: isDark ? '#ffffff' : BROWN_TEXT, fontSize: stat.value.toString().length > 12 ? '1.5rem' : '2rem', fontWeight: 700, fontFamily: "'Playfair Display', serif", textAlign: 'left', lineHeight: 1 }}>
                            {stat.value}
                        </Typography>
                        <Typography sx={{ color: stat.alert ? '#d32f2f' : (isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT), fontSize: '11px', fontFamily: "'Inter', sans-serif", textAlign: 'left', fontWeight: 600 }}>
                            {stat.alert ? `! ${stat.info}` : stat.info}
                        </Typography>
                    </Box>
                </Paper>
            ))}
        </Box>
    );
}

export default CompanyStatsCards;