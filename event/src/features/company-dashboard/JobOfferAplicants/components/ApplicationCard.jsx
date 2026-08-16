import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Typography, Button, Avatar, Rating, CircularProgress } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useDispatch } from 'react-redux';

import { setSelectedFreelancer, fetchJobsWithApplications } from '../jobManagementSlice';
import { acceptApplicationService } from '../../../../services/companyService/jobService';
import { addNotification } from '../../../../notificationSlice';

export default function ApplicationCard({ application }) {
    const dispatch = useDispatch();
    const [isAccepting, setIsAccepting] = useState(false);

    const { id, freelancer, status } = application;
    const user = freelancer?.user;

    const firstName = user?.first_name || '';
    const lastName = user?.last_name || '';
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Unknown Applicant';
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || '?';

    // 💡 تلوين دقيق لحالة الطلب الفعلية
    const statusColor = status === 'active' ? 'success.main' : (status === 'pending' ? 'warning.main' : 'error.main');

    const handleViewProfile = () => {
        dispatch(setSelectedFreelancer(freelancer));
    };

    const handleAccept = async () => {
        setIsAccepting(true);
        try {
            await acceptApplicationService(id);

            dispatch(addNotification({
                title: 'Success',
                body: 'Applicant has been accepted successfully!',
                time: new Date().toISOString()
            }));

            dispatch(fetchJobsWithApplications());
        } catch (error) {
            console.error("Error accepting applicant:", error);
            dispatch(addNotification({
                title: 'Error',
                body: error.response?.data?.message || 'Failed to accept applicant.',
                time: new Date().toISOString()
            }));
        } finally {
            setIsAccepting(false);
        }
    };

    const isAlreadyAccepted = status === 'active';

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                rowGap: 2,
                p: 2.5,
                mb: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? alpha('#ffffff', 0.02) : alpha('#000000', 0.015)),
                transition: 'all 0.3s ease',
                '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: (theme) => `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`
                }
            }}
        >
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Avatar
                    sx={{
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.18),
                        color: 'primary.main',
                        width: 56,
                        height: 56,
                        fontWeight: 'bold',
                    }}
                >
                    {initials}
                </Avatar>
                <Box>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5, flexWrap: 'wrap', rowGap: 0.5 }}>
                        <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: 'text.primary' }}>
                            {fullName}
                        </Typography>
                        {/* 💡 تغيير الكلمة إلى VERIFIED PROFILE لإزالة الالتباس مع حالة الطلب */}
                        {freelancer?.moderation_status === 'approved' && (
                            <Box
                                sx={{
                                    px: 1,
                                    py: 0.2,
                                    bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                                    border: '1px solid',
                                    borderColor: 'info.main',
                                    borderRadius: 4,
                                }}
                            >
                                <Typography sx={{ fontSize: '0.65rem', color: 'info.main', fontWeight: 'bold' }}>
                                    ✓ VERIFIED PROFILE
                                </Typography>
                            </Box>
                        )}
                    </Stack>
                    <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary', mb: 0.5 }}>
                        {freelancer?.brand_name || '—'}
                    </Typography>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 0.5 }}>
                        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                            <Rating
                                value={parseFloat(freelancer?.rating) || 0}
                                precision={0.1}
                                readOnly
                                size="small"
                                sx={{ color: 'primary.main' }}
                            />
                            <Typography sx={{ fontSize: '0.8rem', color: 'text.primary', fontWeight: 'bold' }}>
                                {freelancer?.rating ?? '—'}
                            </Typography>
                        </Stack>

                        {user?.email && (
                            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                                {user.email}
                            </Typography>
                        )}

                        {freelancer?.provider_type && (
                            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                                {freelancer.provider_type.toUpperCase()}
                            </Typography>
                        )}
                    </Stack>
                </Box>
            </Stack>

            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <Typography
                    sx={{ fontSize: '0.8rem', fontWeight: 'bold', color: statusColor, textTransform: 'uppercase', mr: 1 }}
                >
                    {status}
                </Typography>

                <Button
                    variant="contained"
                    onClick={handleAccept}
                    disabled={isAccepting || isAlreadyAccepted}
                    sx={{
                        bgcolor: isAlreadyAccepted ? 'action.disabledBackground' : 'success.main',
                        color: isAlreadyAccepted ? 'text.disabled' : '#fff',
                        textTransform: 'none',
                        borderRadius: 1.5,
                        boxShadow: 'none',
                        minWidth: 90,
                        '&:hover': {
                            bgcolor: isAlreadyAccepted ? 'action.disabledBackground' : 'success.dark',
                            boxShadow: 'none'
                        },
                    }}
                >
                    {isAccepting ? (
                        <CircularProgress size={20} color="inherit" />
                    ) : (
                        isAlreadyAccepted ? 'Accepted' : 'Accept'
                    )}
                </Button>

                <Button
                    variant="outlined"
                    {...(user?.email ? { component: 'a', href: `mailto:${user.email}` } : {})}
                    sx={{
                        borderColor: (theme) => alpha(theme.palette.primary.main, 0.4),
                        color: 'text.primary',
                        textTransform: 'none',
                        borderRadius: 1.5,
                    }}
                >
                    Contact
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleViewProfile}
                    sx={{
                        borderColor: (theme) => alpha(theme.palette.primary.main, 0.4),
                        color: 'text.primary',
                        textTransform: 'none',
                        borderRadius: 1.5,
                    }}
                >
                    View Profile →
                </Button>
            </Stack>
        </Box>
    );
}

ApplicationCard.propTypes = {
    application: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        status: PropTypes.string,
        freelancer: PropTypes.shape({
            brand_name: PropTypes.string,
            moderation_status: PropTypes.string,
            provider_type: PropTypes.string,
            rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            user: PropTypes.shape({
                first_name: PropTypes.string,
                last_name: PropTypes.string,
                email: PropTypes.string,
                settings_language: PropTypes.string,
            }),
        }),
    }).isRequired,
};