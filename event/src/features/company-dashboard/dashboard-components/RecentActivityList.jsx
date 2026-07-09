import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import MuiButton from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import SortIcon from '@mui/icons-material/Sort';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

// 💡 استيراد السيرفيس الذي جهزناه
import providerService from '../../../services/companyService/providerService';

function RecentActivityList() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false); // 💡 حالة جديدة للتحكم بظهور كل الإشعارات

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await providerService.getNotifications();
                // لتجنب أي مشاكل مع الـ Pagination الخاص بلارافيل، نفحص مكان المصفوفة
                const dataArray = response.data?.data || response.data || [];
                setActivities(dataArray);
            } catch (error) {
                console.error('Failed to fetch notifications', error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    // دالة بسيطة لتنسيق التاريخ القادم من لارافيل
    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // 💡 تحديد الإشعارات التي سيتم عرضها (أول 5 أو الكل بناءً على حالة showAll)
    const displayedActivities = showAll ? activities : activities.slice(0, 5);

    return (
        <Paper elevation={0} sx={{
            p: 3,
            backgroundColor: isDark ? '#140e0c' : '#EFE4C9',
            border: isDark ? '1px solid rgba(78, 70, 57, 0.15)' : '1px solid rgba(179, 140, 69, 0.2)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            width: { xs: '100%', lg: '340px' },
            transition: 'background-color 0.3s ease',
            height: '100%' // لملء المساحة
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ color: isDark ? '#eee0da' : '#2B211E', fontSize: '18px', fontFamily: "'Playfair Display', serif" }}>
                    Recent Notifications
                </Typography>
                <SortIcon sx={{ color: isDark ? '#5a5043' : '#7A6F5E', fontSize: '18px', cursor: 'pointer' }} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, overflowY: 'auto', pr: 0.5, flex: 1 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <CircularProgress size={24} sx={{ color: isDark ? '#c5a059' : '#b38c45' }} />
                    </Box>
                ) : activities.length === 0 ? (
                    <Typography sx={{ color: isDark ? '#8a7f70' : '#5A5043', fontSize: '13px', textAlign: 'center', mt: 4 }}>
                        No new notifications at the moment.
                    </Typography>
                ) : (
                    displayedActivities.map((act) => (
                        <Box key={act.id} sx={{
                            display: 'flex', gap: 2, alignItems: 'flex-start', textAlign: 'left',
                            opacity: act.is_read ? 0.7 : 1, // بهتان الإشعار المقروء
                            transition: 'opacity 0.2s'
                        }}>
                            <Box sx={{
                                p: 1,
                                borderRadius: '50%',
                                backgroundColor: isDark ? 'rgba(28, 21, 18, 0.8)' : '#FAF0D5',
                                color: act.is_read ? (isDark ? '#5a5043' : '#7A6F5E') : '#c5a059',
                                border: isDark ? `1px solid rgba(78, 70, 57, 0.25)` : `1px solid rgba(179, 140, 69, 0.2)`,
                                display: 'flex', mt: 0.3
                            }}>
                                {act.is_read ? <NotificationsNoneIcon sx={{ fontSize: '16px' }} /> : <NotificationsActiveIcon sx={{ fontSize: '16px' }} />}
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3, flex: 1 }}>
                                <Typography sx={{ color: isDark ? '#eee0da' : '#2B211E', fontSize: '13px', fontFamily: "'Inter', sans-serif", fontWeight: act.is_read ? 500 : 700 }}>
                                    {act.title}
                                </Typography>
                                <Typography sx={{ color: isDark ? '#8a7f70' : '#5A5043', fontSize: '11px', fontFamily: "'Inter', sans-serif", lineHeight: 1.4 }}>
                                    {act.body}
                                </Typography>
                                <Typography sx={{ color: isDark ? '#5a5043' : '#7A6F5E', fontSize: '9px', fontWeight: 600, mt: 0.5, fontFamily: "'Inter', sans-serif" }}>
                                    {formatDate(act.created_at)}
                                </Typography>
                            </Box>
                        </Box>
                    ))
                )}
            </Box>

            {/* 💡 إظهار الزر فقط إذا كان هناك أكثر من 5 إشعارات */}
            {activities.length > 5 && (
                <MuiButton
                    onClick={() => setShowAll(!showAll)}
                    variant="outlined"
                    sx={{
                        mt: 'auto',
                        border: isDark ? '1px solid rgba(78, 70, 57, 0.3)' : '1px solid rgba(179, 140, 69, 0.4)',
                        color: isDark ? '#9a8f80' : '#7A6F5E',
                        textTransform: 'none',
                        fontSize: '12px',
                        fontFamily: "'Inter', sans-serif",
                        borderRadius: '8px',
                        '&:hover': { borderColor: isDark ? '#c5a059' : '#b38c45', color: isDark ? '#eee0da' : '#2B211E' }
                    }}
                >
                    {showAll ? 'View Less' : 'View All Notifications'}
                </MuiButton>
            )}
        </Paper>
    );
}

export default RecentActivityList;