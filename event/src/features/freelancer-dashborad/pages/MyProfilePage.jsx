import React, { useEffect } from 'react';
import { Box, Typography, Paper, Avatar, TextField, Stack, CircularProgress, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import BusinessCenterOutlinedIcon  from '@mui/icons-material/BusinessCenterOutlined';
import EmailOutlinedIcon           from '@mui/icons-material/EmailOutlined';
import PhoneIphoneOutlinedIcon     from '@mui/icons-material/PhoneIphoneOutlined';
import VerifiedUserOutlinedIcon    from '@mui/icons-material/VerifiedUserOutlined';
import ArticleOutlinedIcon         from '@mui/icons-material/ArticleOutlined';
import StarIcon                    from '@mui/icons-material/Star';
import EditIcon                    from '@mui/icons-material/Edit';

import { useSelector, useDispatch } from 'react-redux';
import { fetchMyProfile } from './../freelancerProfileSlice';
import dayjs from 'dayjs';

import Sidebar from '../components/layout/Sidebar.jsx';
import Header from '../components/layout/Header.jsx';

export default function MyProfilePage() {
    const theme  = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const dispatch = useDispatch();

    const { profileData, status, error } = useSelector((state) => state.freelancerProfile);

    useEffect(() => {
        dispatch(fetchMyProfile());
    }, [dispatch]);

    if (status === 'loading') {
        return (
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
                <Sidebar />
                <Box component="main" sx={{ ml: { xs: 0, md: '260px' }, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Header title="My Profile" />
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                        <CircularProgress color="primary" />
                    </Box>
                </Box>
            </Box>
        );
    }

    if (status === 'failed' || !profileData) {
        return (
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
                <Sidebar />
                <Box component="main" sx={{ ml: { xs: 0, md: '260px' }, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Header title="My Profile" />
                    <Box sx={{ textAlign: 'center', py: 10, color: 'error.main' }}>
                        {error || "No profile data found."}
                    </Box>
                </Box>
            </Box>
        );
    }

    // 👑 التعديل هنا: تفكيك البيانات لتتطابق تماماً مع الـ JSON المرسل
    const user = profileData.user || {};
    const provider = profileData.provider || {};
    const providerDetails = profileData.provider_details || {};

    const fullName = user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A';
    const initial = fullName !== 'N/A' ? fullName.charAt(0).toUpperCase() : '?';
    const email = user.email || 'N/A';
    const phone = user.phone || 'Not Provided';
    const isVerified = provider.is_verified === true || provider.is_verified === 1;
    const createdAt = user.created_at ? dayjs(user.created_at).format('MMM DD, YYYY') : 'N/A';

    const brandName = provider.brand_name || 'N/A';
    const moderationStatus = provider.moderation_status || 'N/A';
    const providerType = provider.provider_type || 'Freelancer';
    const rating = provider.rating ?? 'N/A';

    const nationalId = providerDetails.national_id || 'N/A';
    const experienceYears = providerDetails.experience_years ? `${providerDetails.experience_years} Years` : 'N/A';
    const addressDetails = providerDetails.address_details || 'Not Provided';

    const isPhoneVerified = !!user.is_phone_verified;
    const isEmailVerified = !!user.is_email_verified;

    // 👑 التعديل هنا: قراءة name_en بدلاً من name.en
    const industryCategories = provider.categories && provider.categories.length > 0
        ? provider.categories.map(c => c.name_en || c.name_ar || 'Unknown').join(' • ')
        : 'N/A';

    // الألوان والتنسيقات
    const gold        = theme.palette.primary.main;
    const border      = isDark ? 'rgba(197,160,89,0.2)' : 'rgba(179,140,69,0.3)';
    const cardBg      = theme.palette.background.paper;
    const inputBg     = isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.4)';

    const card = {
        backgroundColor: cardBg,
        border: `1px solid ${border}`,
        borderRadius: 3,
        p: 3,
        boxShadow: isDark ? 'none' : '0 2px 10px rgba(0,0,0,0.02)'
    };

    const inp = {
        '& .MuiOutlinedInput-root': { backgroundColor: inputBg, borderRadius: 1.5, '& fieldset': { borderColor: border } },
        '& .MuiInputBase-input': { fontSize: '0.88rem', padding: '10px 14px', color: theme.palette.text.primary },
        '& .Mui-disabled': { WebkitTextFillColor: theme.palette.text.primary, opacity: 0.9 }
    };

    const FieldLabel = ({ children }) => (
        <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.palette.text.secondary, mb: 0.75, display: 'block' }}>
            {children}
        </Typography>
    );

    const CardHeader = ({ icon: Icon, title }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Icon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: theme.palette.text.primary }}>{title}</Typography>
        </Box>
    );

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>

            <Sidebar activeItem="My Profile" />

            {/* 👑 التعديل هنا: إزاحة المحتوى ليترك مساحة للسايد بار (ml: 260px) */}
            <Box component="main" sx={{ ml: { xs: 0, md: '260px' }, display: 'flex', flexDirection: 'column' }}>

                <Header title="My Profile" user={{ name: fullName, role: providerType, avatar: '' }} />

                <Box sx={{ width: '100%', maxWidth: 1100, mx: 'auto', p: { xs: 2, md: 4 } }}>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 600, color: gold, mb: 0.5 }}>
                                My Profile
                            </Typography>
                            <Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.secondary, fontWeight: 400 }}>
                                Manage your credentials, personal details, and account status.
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            sx={{ backgroundColor: gold, color: isDark ? '#000' : '#fff', fontWeight: 'bold', '&:hover': { backgroundColor: isDark ? '#b38f40' : '#8c6b30' } }}
                        >
                            Edit Profile
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', flexDirection: { xs: 'column', md: 'row' }, width: '100%' }}>

                        {/* ── العمود الأيسر ── */}
                        <Box sx={{ width: { xs: '100%', md: '33%' }, flexShrink: 0 }}>
                            <Stack spacing={3}>
                                <Paper elevation={0} sx={card}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                                        <Avatar sx={{ width: 96, height: 96, border: `2px solid ${gold}`, bgcolor: isDark ? 'rgba(197,160,89,0.1)' : 'rgba(179,140,69,0.1)', color: gold, fontSize: '2.5rem', mb: 1.5 }}>
                                            {initial}
                                        </Avatar>
                                        <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: theme.palette.text.primary, mb: 0.3, textTransform: 'capitalize' }}>
                                            {fullName}
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.6rem', letterSpacing: '0.14em', color: gold, textTransform: 'uppercase', fontWeight: 600 }}>
                                            {providerType}
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                                            <StarIcon sx={{ color: gold, fontSize: 16 }} />
                                            <Typography sx={{ fontSize: '0.9rem', fontWeight: 'bold', color: theme.palette.text.primary }}>
                                                {rating}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Stack spacing={0} divider={<Box sx={{ height: '1px', backgroundColor: border }} />}>
                                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', py: 2 }}>
                                            <EmailOutlinedIcon sx={{ color: theme.palette.text.secondary, fontSize: 18, mt: '2px' }} />
                                            <Box><Typography sx={{ fontSize: '0.6rem', color: theme.palette.text.secondary, textTransform: 'uppercase' }}>Email Address</Typography><Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.primary, fontWeight: 500 }}>{email}</Typography></Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', py: 2 }}>
                                            <PhoneIphoneOutlinedIcon sx={{ color: theme.palette.text.secondary, fontSize: 18, mt: '2px' }} />
                                            <Box><Typography sx={{ fontSize: '0.6rem', color: theme.palette.text.secondary, textTransform: 'uppercase' }}>Contact Number</Typography><Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.primary, fontWeight: 500 }}>{phone}</Typography></Box>
                                        </Box>
                                    </Stack>
                                </Paper>

                                <Paper elevation={0} sx={card}>
                                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', color: theme.palette.text.secondary, mb: 2.5, textTransform: 'uppercase' }}>Verification & Status</Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.primary, fontWeight: 500 }}>Identity Verification</Typography>
                                        <Box sx={{ border: `1px solid ${moderationStatus === 'approved' ? '#2ecc71' : '#e74c3c'}`, color: moderationStatus === 'approved' ? '#2ecc71' : '#e74c3c', px: 1.2, py: 0.25, borderRadius: 1, fontSize: '0.6rem', fontWeight: 700 }}>
                                            {moderationStatus === 'approved' ? 'APPROVED' : 'PENDING'}
                                        </Box>                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.primary, fontWeight: 500 }}>Joined Platform</Typography>
                                        <Typography sx={{ fontSize: '0.8rem', color: theme.palette.text.secondary }}>{createdAt}</Typography>
                                    </Box>
                                </Paper>
                            </Stack>
                        </Box>

                        {/* ── العمود الأيمن ── */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Stack spacing={3}>
                                <Paper elevation={0} sx={card}>
                                    <CardHeader icon={BusinessCenterOutlinedIcon} title="Professional Credentials" />

                                    <Box sx={{ mb: 2.5 }}>
                                        <FieldLabel>Brand / Stage Name</FieldLabel>
                                        <TextField fullWidth size="small" value={brandName} disabled sx={inp} />
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 2.5, mb: 2.5, flexDirection: { xs: 'column', sm: 'row' } }}>
                                        <Box sx={{ flex: 1 }}>
                                            <FieldLabel>National ID</FieldLabel>
                                            <TextField fullWidth size="small" value={nationalId} disabled sx={inp} />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <FieldLabel>Experience Years</FieldLabel>
                                            <TextField fullWidth size="small" value={experienceYears} disabled sx={inp} />
                                        </Box>
                                    </Box>

                                    <Box>
                                        <FieldLabel>Expertise Categories</FieldLabel>
                                        <TextField fullWidth size="small" value={industryCategories} disabled sx={inp} />
                                    </Box>
                                </Paper>

                                <Paper elevation={0} sx={card}>
                                    <CardHeader icon={VerifiedUserOutlinedIcon} title="Account Status" />

                                    <Box sx={{ display: 'flex', gap: 2.5, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                                        <Box sx={{ flex: 1 }}>
                                            <FieldLabel>Moderation Status</FieldLabel>
                                            <TextField fullWidth size="small" value={moderationStatus} disabled sx={{ ...inp, textTransform: 'capitalize' }} />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <FieldLabel>Provider Type</FieldLabel>
                                            <TextField fullWidth size="small" value={providerType} disabled sx={{ ...inp, textTransform: 'capitalize' }} />
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 2.5, flexDirection: { xs: 'column', sm: 'row' }, p: 2, bgcolor: inputBg, borderRadius: 2, border: `1px solid ${border}` }}>
                                        <Box sx={{ flex: 1 }}>
                                            <FieldLabel>Phone Verified</FieldLabel>
                                            <Typography sx={{ fontSize: '0.9rem', color: isPhoneVerified ? '#2ecc71' : '#e74c3c', fontWeight: 600 }}>
                                                {isPhoneVerified ? 'Yes' : 'No'}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <FieldLabel>Email Verified</FieldLabel>
                                            <Typography sx={{ fontSize: '0.9rem', color: isEmailVerified ? '#2ecc71' : '#e74c3c', fontWeight: 600 }}>
                                                {isEmailVerified ? 'Yes' : 'No'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>

                                <Paper elevation={0} sx={card}>
                                    <CardHeader icon={ArticleOutlinedIcon} title="Platform Presentation" />
                                    <FieldLabel>Address Details</FieldLabel>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={addressDetails}
                                        disabled
                                        sx={{ ...inp, '& .MuiInputBase-input': { padding: '12px 14px' } }}
                                    />
                                </Paper>

                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}