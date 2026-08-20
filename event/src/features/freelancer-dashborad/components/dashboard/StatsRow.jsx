import React from 'react';
import { Box, Typography, Grid, useTheme } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';

const StatsRow = ({ stats }) => {
    const theme = useTheme();

    const statCardStyle = {
        background: theme.palette.mode === 'dark' ? "rgba(15, 15, 20, 0.65)" : "rgba(250, 248, 245, 0.55)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid",
        borderColor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
        borderRadius: "16px",
        boxShadow: theme.palette.mode === 'dark' ? "0 8px 32px 0 rgba(0, 0, 0, 0.4)" : "0 8px 32px 0 rgba(130, 120, 110, 0.08)",
        p: 4,
        minHeight: "175px", // 👑 توحيد الارتفاع الأدنى بدقة
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // 👑 توزيع العناصر بمسافات متساوية لضمان التطابق التام
        transition: "all 0.3s ease",
        "&:hover": {
            borderColor: "primary.main",
            bgcolor: theme.palette.mode === 'dark' ? "rgba(15, 15, 20, 0.8)" : "rgba(255, 255, 255, 0.8)"
        }
    };

    const statItems = [
        { title: "TOTAL EARNINGS", value: stats?.totalEarnings || "$0", sub: stats?.earningsTrend || "", icon: AccountBalanceWalletIcon },
        { title: "ACTIVE ORDERS", value: stats?.activeOrders || "0", sub: `${stats?.ordersActionNeeded || 0} requiring action today`, icon: ShoppingBagIcon },
        { title: "SERVICES", value: `${stats?.services || 0}`, sub: "Active catalog listings", icon: CheckCircleIcon }, // 👈 قراءة stats.services بدلاً من completion
        { title: "RATING", value: stats?.rating || "0", sub: stats?.ratingStatus || "", icon: StarIcon }
    ];

    return (
        <Grid container spacing={3}>
            {statItems.map((item, i) => {
                const IconComponent = item.icon;
                return (
                    <Grid item xs={12} sm={6} md={3} key={i}>
                        <Box sx={statCardStyle}>
                            {/* القسم العلوي: العنوان والأيقونة */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', color: theme.palette.text.secondary }}>
                                    {item.title}
                                </Typography>
                                {IconComponent && <IconComponent sx={{ color: "primary.main", fontSize: 28 }} />}
                            </Box>

                            {/* الرقم الأساسي */}
                            <Typography sx={{ fontSize: '2.4rem', fontWeight: 600, color: theme.palette.text.primary, fontFamily: "'Playfair Display', serif", my: 1 }}>
                                {item.value}
                            </Typography>

                            {/* القسم السفلي: النص الفرعي (مع حماية المساحة ليبقى متطابقاً حتى لو كان فارغاً) */}
                            <Typography sx={{
                                fontSize: '0.9rem',
                                minHeight: '24px', // 👑 حجز مساحة ثابتة للنص الفرعي لضمان توازي الكروت
                                color: String(item.sub).includes('+') ? theme.palette.success.main : theme.palette.text.secondary,
                                opacity: item.sub ? 1 : 0 // إخفاء النص المؤقت لـ Completion دون الإخلل بالمساحة
                            }}>
                                {item.sub || "\u00A0"}
                            </Typography>
                        </Box>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default StatsRow;