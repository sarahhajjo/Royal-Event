import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Typography, Button, Avatar, Rating, CircularProgress } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';

import { setSelectedFreelancer, fetchJobsWithApplications } from '../jobManagementSlice';
import { acceptApplicationService } from '../../../../services/companyService/jobService';
import { addNotification } from '../../../../notificationSlice';

// 💡 استيراد ثوابت الألوان
import { GOLD, BROWN_TEXT, MUTED_TEXT, DARK_SURFACE_BG, LIGHT_INPUT } from '../../../../utils/colorConstants';

export default function ApplicationCard({ application }) {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [isAccepting, setIsAccepting] = useState(false);

    const { id, freelancer, status } = application;
    const user = freelancer?.user;

    const firstName = user?.first_name || '';
    const lastName = user?.last_name || '';
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Unknown Applicant';
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || '?';

    const statusColor = status === 'active' ? 'success.main' : (status === 'pending' ? 'warning.main' : 'error.main');

    const textPrimary = isDark ? '#ffffff' : '#1A120D';
    const textSecondary = isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT;
    const cardBg = isDark ? DARK_SURFACE_BG : alpha('#ffffff', 0.65); // شفافية جميلة في المضيء

    const handleViewProfile = () => dispatch(setSelectedFreelancer(freelancer));

    const handleAccept = async () => {
        setIsAccepting(true);
        try {
            await acceptApplicationService(id);
            dispatch(addNotification({ title: 'Success', body: 'Applicant has been accepted successfully!', time: new Date().toISOString() }));
            dispatch(fetchJobsWithApplications());
        } catch (error) {
            dispatch(addNotification({ title: 'Error', body: error.response?.data?.message || 'Failed to accept applicant.', time: new Date().toISOString() }));
        } finally {
            setIsAccepting(false);
        }
    };

    const isAlreadyAccepted = status === 'active';

    return (
        <Box
            sx={{
                display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', rowGap: 2,
                p: 2.5, mb: 2, borderRadius: 2,
                border: `1px solid ${isDark ? alpha(GOLD, 0.2) : alpha(BROWN_TEXT, 0.15)}`,
                bgcolor: cardBg,
                transition: 'all 0.3s ease',
                '&:hover': {
                    borderColor: isDark ? GOLD : BROWN_TEXT,
                    boxShadow: `0 4px 20px ${isDark ? alpha(GOLD, 0.1) : alpha(BROWN_TEXT, 0.08)}`
                }
            }}
        >
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Avatar
                    sx={{
                        bgcolor: isDark ? alpha(GOLD, 0.18) : alpha(BROWN_TEXT, 0.1),
                        color: isDark ? GOLD : BROWN_TEXT,
                        width: 56, height: 56, fontWeight: 'bold', fontSize: '1.2rem'
                    }}
                >
                    {initials}
                </Avatar>
                <Box>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5, flexWrap: 'wrap', rowGap: 0.5 }}>
                        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: textPrimary }}>
                            {fullName}
                        </Typography>
                        {freelancer?.moderation_status === 'approved' && (
                            <Box sx={{ px: 1, py: 0.2, bgcolor: alpha(theme.palette.info.main, 0.1), border: '1px solid', borderColor: 'info.main', borderRadius: 4 }}>
                                <Typography sx={{ fontSize: '0.65rem', color: 'info.main', fontWeight: 'bold' }}>
                                    ✓ VERIFIED PROFILE
                                </Typography>
                            </Box>
                        )}
                    </Stack>
                    <Typography sx={{ fontSize: '0.85rem', color: textSecondary, mb: 0.5, fontWeight: 600 }}>
                        {freelancer?.brand_name || '—'}
                    </Typography>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 0.5 }}>
                        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                            <Rating value={parseFloat(freelancer?.rating) || 0} precision={0.1} readOnly size="small" sx={{ color: isDark ? GOLD : BROWN_TEXT }} />
                            <Typography sx={{ fontSize: '0.8rem', color: textPrimary, fontWeight: 'bold' }}>
                                {freelancer?.rating ?? '—'}
                            </Typography>
                        </Stack>

                        {user?.email && (
                            <Typography sx={{ fontSize: '0.75rem', color: textSecondary, fontWeight: 600 }}>
                                {user.email}
                            </Typography>
                        )}

                        {freelancer?.provider_type && (
                            <Typography sx={{ fontSize: '0.75rem', color: textSecondary, fontWeight: 700 }}>
                                {freelancer.provider_type.toUpperCase()}
                            </Typography>
                        )}
                    </Stack>
                </Box>
            </Stack>

            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: statusColor, textTransform: 'uppercase', mr: 1 }}>
                    {status}
                </Typography>

                <Button
                    variant="contained"
                    onClick={handleAccept}
                    disabled={isAccepting || isAlreadyAccepted}
                    sx={{
                        bgcolor: isAlreadyAccepted ? 'action.disabledBackground' : 'success.main',
                        color: isAlreadyAccepted ? 'text.disabled' : '#fff',
                        textTransform: 'none', borderRadius: 1.5, boxShadow: 'none', minWidth: 90, fontWeight: 700,
                        '&:hover': { bgcolor: isAlreadyAccepted ? 'action.disabledBackground' : 'success.dark', boxShadow: 'none' },
                    }}
                >
                    {isAccepting ? <CircularProgress size={20} color="inherit" /> : (isAlreadyAccepted ? 'Accepted' : 'Accept')}
                </Button>

                <Button
                    variant="outlined"
                    {...(user?.email ? { component: 'a', href: `mailto:${user.email}` } : {})}
                    sx={{ borderColor: isDark ? alpha(GOLD, 0.4) : alpha(BROWN_TEXT, 0.3), color: textPrimary, textTransform: 'none', borderRadius: 1.5, fontWeight: 600 }}
                >
                    Contact
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleViewProfile}
                    sx={{ borderColor: isDark ? alpha(GOLD, 0.4) : alpha(BROWN_TEXT, 0.3), color: textPrimary, textTransform: 'none', borderRadius: 1.5, fontWeight: 600 }}
                >
                    View Profile →
                </Button>
            </Stack>
        </Box>
    );
}