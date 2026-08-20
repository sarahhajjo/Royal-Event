import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import MuiButton from '@mui/material/Button';
import { useTheme, alpha } from '@mui/material/styles';
import SortIcon from '@mui/icons-material/Sort';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

import providerService from '../../../services/companyService/providerService';

// 💡 استيراد الألوان الموحدة
import {
    GOLD, BROWN_TEXT, MUTED_TEXT,
    LIGHT_CARD, LIGHT_BORDER, LIGHT_INPUT,
    DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_SURFACE_BG, DARK_SURFACE_BORDER, DARK_CARD_SHADOW
} from '../../../utils/colorConstants';

function RecentActivityList() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await providerService.getNotifications();
                const dataArray = response.data?.data || response.data || [];
                setActivities(dataArray);
            } catch (error) {
                console.error('Failed to fetch notifications', error);
            } finally { setLoading(false); }
        };
        fetchActivities();
    }, []);

    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const displayedActivities = showAll ? activities : activities.slice(0, 5);

    return (
        <Paper elevation={0} sx={{
            p: 3,
            background: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
            border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
            borderRadius: '18px', display: 'flex', flexDirection: 'column', gap: 2.5,
            width: { xs: '100%', lg: '340px' }, transition: 'background-color 0.3s ease', height: '100%',
            backdropFilter: 'blur(16px)', boxShadow: isDark ? DARK_CARD_SHADOW : `0 18px 40px ${alpha(GOLD, 0.15)}`
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ color: isDark ? '#ffffff' : BROWN_TEXT, fontSize: '18px', fontFamily: "'Playfair Display', serif", fontWeight: 700, letterSpacing: '-0.01em' }}>
                    Recent Notifications
                </Typography>
                <SortIcon sx={{ color: isDark ? 'rgba(255,255,255,0.4)' : GOLD, fontSize: '18px', cursor: 'pointer' }} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto', pr: 0.5, flex: 1 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <CircularProgress size={24} sx={{ color: GOLD }} />
                    </Box>
                ) : activities.length === 0 ? (
                    <Typography sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, fontSize: '13px', textAlign: 'center', mt: 4, fontWeight: 600 }}>
                        No new notifications at the moment.
                    </Typography>
                ) : (
                    displayedActivities.map((act) => (
                        <Box key={act.id} sx={{
                            display: 'flex', gap: 2, alignItems: 'flex-start', textAlign: 'left',
                            opacity: act.is_read ? 0.7 : 1, transition: 'opacity 0.2s', p: 1.4, borderRadius: '16px',
                            backgroundColor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT,
                            border: isDark ? DARK_SURFACE_BORDER : `1px solid ${alpha(LIGHT_BORDER, 0.6)}`
                        }}>
                            <Box sx={{
                                p: 1, borderRadius: '50%',
                                backgroundColor: isDark ? alpha(GOLD, 0.12) : alpha(LIGHT_INPUT, 0.9),
                                color: act.is_read ? (isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT) : GOLD,
                                border: `1px solid ${alpha(GOLD, 0.3)}`,
                                display: 'flex', mt: 0.3
                            }}>
                                {act.is_read ? <NotificationsNoneIcon sx={{ fontSize: '16px' }} /> : <NotificationsActiveIcon sx={{ fontSize: '16px' }} />}
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3, flex: 1 }}>
                                <Typography sx={{ color: isDark ? '#ffffff' : BROWN_TEXT, fontSize: '13px', fontFamily: "'Inter', sans-serif", fontWeight: act.is_read ? 600 : 800 }}>
                                    {act.title}
                                </Typography>
                                <Typography sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, fontSize: '11px', fontFamily: "'Inter', sans-serif", lineHeight: 1.4, fontWeight: 500 }}>
                                    {act.body}
                                </Typography>
                                <Typography sx={{ color: isDark ? 'rgba(255,255,255,0.4)' : alpha(MUTED_TEXT, 0.7), fontSize: '9px', fontWeight: 800, mt: 0.5, fontFamily: "'Inter', sans-serif" }}>
                                    {formatDate(act.created_at)}
                                </Typography>
                            </Box>
                        </Box>
                    ))
                )}
            </Box>

            {activities.length > 5 && (
                <MuiButton
                    onClick={() => setShowAll(!showAll)} variant="outlined"
                    sx={{
                        mt: 'auto',
                        border: `1px solid ${alpha(GOLD, 0.5)}`,
                        color: isDark ? '#ffffff' : BROWN_TEXT,
                        textTransform: 'none', fontSize: '12px', fontWeight: 700, fontFamily: "'Inter', sans-serif", borderRadius: '10px',
                        '&:hover': { borderColor: GOLD, backgroundColor: isDark ? alpha(GOLD, 0.1) : LIGHT_INPUT }
                    }}
                >
                    {showAll ? 'View Less' : 'View All Notifications'}
                </MuiButton>
            )}
        </Paper>
    );
}

export default RecentActivityList;