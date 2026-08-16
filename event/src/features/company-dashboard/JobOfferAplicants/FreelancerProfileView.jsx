import React from 'react';
import { Box, Typography, Paper, Avatar, TextField, Stack, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import BusinessCenterOutlinedIcon  from '@mui/icons-material/BusinessCenterOutlined';
import EmailOutlinedIcon           from '@mui/icons-material/EmailOutlined';
import PhoneIphoneOutlinedIcon     from '@mui/icons-material/PhoneIphoneOutlined';
import VerifiedUserOutlinedIcon    from '@mui/icons-material/VerifiedUserOutlined';
import SettingsOutlinedIcon        from '@mui/icons-material/SettingsOutlined';
import ArticleOutlinedIcon         from '@mui/icons-material/ArticleOutlined'; // 💡 استيراد أيقونة العنوان
import ArrowBackIcon               from '@mui/icons-material/ArrowBack';
import StarIcon                    from '@mui/icons-material/Star';

import { useSelector, useDispatch } from 'react-redux';
import { clearSelectedFreelancer } from './jobManagementSlice';
import dayjs from 'dayjs';

export default function FreelancerProfileView() {
    const theme  = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const dispatch = useDispatch();

    const { selectedFreelancer } = useSelector((state) => state.jobManagement);

    if (!selectedFreelancer) {
        return (
            <Box sx={{ p: 5, textAlign: 'center' }}>
                <Typography sx={{ color: theme.palette.text.secondary }}>No applicant selected.</Typography>
                <Button onClick={() => dispatch(clearSelectedFreelancer())} sx={{ mt: 2, color: theme.palette.primary.main }}>Go Back</Button>
            </Box>
        );
    }

    // تفكيك البيانات
    const user = selectedFreelancer.user || {};
    const provider = selectedFreelancer || {};
    const freelancerDetails = selectedFreelancer.freelancer_details || {};

    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A';
    const initial = fullName !== 'N/A' ? fullName.charAt(0).toUpperCase() : '?';
    const email = user.email || 'N/A';
    const phone = user.phone || 'Not Provided';
    const isVerified = provider.is_verified === 1 || provider.is_verified === true;
    const createdAt = user.created_at ? dayjs(user.created_at).format('MMM DD, YYYY') : 'N/A';

    const brandName = provider.brand_name || 'N/A';
    const moderationStatus = provider.moderation_status || 'N/A';
    const providerType = provider.provider_type || 'N/A';
    const rating = provider.rating || 'N/A';

    const nationalId = freelancerDetails.national_id || 'N/A';
    const experienceYears = freelancerDetails.experience_years ? `${freelancerDetails.experience_years} Years` : 'N/A';

    // 💡 إضافة متغير العنوان (بانتظار الباك إند لإرساله)
    const addressDetails = freelancerDetails.address_details || 'Not Provided';

    // 💡 إضافة متغيرات التحقق من الإيميل ورقم الهاتف
    // 💡 التعديل هنا: نتحقق مما إذا كان حقل التاريخ موجوداً ولا يساوي null
    const isPhoneVerified = !!user.phone_verified_at;
    const isEmailVerified = !!user.email_verified_at;

    const industryCategories = provider.categories && provider.categories.length > 0
        ? provider.categories.map(c => c.name?.en || c.name?.ar || 'Unknown').join(' • ')
        : 'N/A';

    const settingsLanguage = user.settings_language === 'ar' ? 'Arabic (AR)' : 'English (EN)';
    const settingsTheme = user.settings_theme === 'dark' ? 'Dark Mode' : 'Light Mode';

    // الألوان والتنسيقات
    const gold        = theme.palette.primary.main;
    const border      = isDark ? 'rgba(197,160,89,0.18)' : 'rgba(0,0,0,0.10)';
    const cardBg      = theme.palette.background.paper;
    const inputBg     = isDark ? 'rgba(0,0,0,0.28)' : 'rgba(0,0,0,0.02)';

    const card = { backgroundColor: cardBg, border: `1px solid ${border}`, borderRadius: 3, p: 3 };

    const inp = {
        '& .MuiOutlinedInput-root': { backgroundColor: inputBg, borderRadius: 1.5, '& fieldset': { borderColor: border } },
        '& .MuiInputBase-input': { fontSize: '0.88rem', padding: '10px 14px' },
        '& .Mui-disabled': { WebkitTextFillColor: theme.palette.text.primary, opacity: 0.95 }
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
        <Box sx={{ width: '100%', maxWidth: 1100, mx: 'auto', p: { xs: 2, md: 3 } }}>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => dispatch(clearSelectedFreelancer())}
                        sx={{ color: theme.palette.text.secondary, mb: 1, textTransform: 'none', '&:hover': { color: gold } }}
                    >
                        Back to Applicants
                    </Button>
                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 400, color: gold, mb: 0.5 }}>
                        Applicant Profile
                    </Typography>
                    <Typography sx={{ fontSize: '0.82rem', color: theme.palette.text.secondary, fontWeight: 300 }}>
                        Detailed view of the freelancer's credentials, experience, and system profile.
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start', flexDirection: { xs: 'column', md: 'row' }, width: '100%' }}>

                {/* ── العمود الأيسر ── */}
                <Box sx={{ width: { xs: '100%', md: '33%' }, flexShrink: 0 }}>
                    <Stack spacing={2.5}>
                        <Paper elevation={0} sx={card}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                                <Avatar sx={{ width: 96, height: 96, border: `2px solid ${gold}`, bgcolor: isDark ? '#2e2318' : '#e8dcc0', color: gold, fontSize: '2.5rem', mb: 1.5 }}>
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

                            <Stack spacing={0} divider={<Box sx={{ height: '0.5px', backgroundColor: border }} />}>
                                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', py: 1.5 }}>
                                    <EmailOutlinedIcon sx={{ color: theme.palette.text.secondary, fontSize: 17, mt: '2px' }} />
                                    <Box><Typography sx={{ fontSize: '0.58rem', color: theme.palette.text.secondary, textTransform: 'uppercase' }}>Email Address</Typography><Typography sx={{ fontSize: '0.82rem', color: theme.palette.text.primary, fontWeight: 500 }}>{email}</Typography></Box>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', py: 1.5 }}>
                                    <PhoneIphoneOutlinedIcon sx={{ color: theme.palette.text.secondary, fontSize: 17, mt: '2px' }} />
                                    <Box><Typography sx={{ fontSize: '0.58rem', color: theme.palette.text.secondary, textTransform: 'uppercase' }}>Contact Number</Typography><Typography sx={{ fontSize: '0.82rem', color: theme.palette.text.primary, fontWeight: 500 }}>{phone}</Typography></Box>
                                </Box>
                            </Stack>
                        </Paper>

                        <Paper elevation={0} sx={card}>
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', color: theme.palette.text.secondary, mb: 2 }}>Verification & Status</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.75 }}>
                                <Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.primary, fontWeight: 500 }}>Identity Verification</Typography>
                                <Box sx={{ border: `1px solid ${isVerified ? '#2ecc71' : '#b05050'}`, color: isVerified ? '#2ecc71' : '#b05050', px: 1.2, py: 0.25, borderRadius: 1, fontSize: '0.58rem', fontWeight: 700 }}>{isVerified ? 'VERIFIED' : 'PENDING'}</Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.primary, fontWeight: 500 }}>Joined Platform</Typography>
                                <Typography sx={{ fontSize: '0.8rem', color: theme.palette.text.secondary }}>{createdAt}</Typography>
                            </Box>
                        </Paper>


                    </Stack>
                </Box>

                {/* ── العمود الأيمن ── */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack spacing={2.5}>
                        <Paper elevation={0} sx={card}>
                            <CardHeader icon={BusinessCenterOutlinedIcon} title="Professional Credentials" />

                            <Box sx={{ mb: 2 }}>
                                <FieldLabel>Brand / Stage Name</FieldLabel>
                                <TextField fullWidth size="small" value={brandName} disabled sx={inp} />
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
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

                        {/* 💡 التعديل هنا: كرت الـ Account Status مطابق للصورة تماماً */}
                        <Paper elevation={0} sx={card}>
                            <CardHeader icon={VerifiedUserOutlinedIcon} title="Account Status" />

                            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <Box sx={{ flex: 1 }}>
                                    <FieldLabel>Moderation Status</FieldLabel>
                                    <TextField fullWidth size="small" value={moderationStatus} disabled sx={{ ...inp, textTransform: 'capitalize' }} />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <FieldLabel>Provider Type</FieldLabel>
                                    <TextField fullWidth size="small" value={providerType} disabled sx={{ ...inp, textTransform: 'capitalize' }} />
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <Box sx={{ flex: 1 }}>
                                    <FieldLabel>Phone Verified</FieldLabel>
                                    <Typography sx={{ fontSize: '0.9rem', color: isPhoneVerified ? gold : '#b05050', fontWeight: 600 }}>
                                        {isPhoneVerified ? 'Yes' : 'No'}
                                    </Typography>
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <FieldLabel>Email Verified</FieldLabel>
                                    <Typography sx={{ fontSize: '0.9rem', color: isEmailVerified ? gold : '#b05050', fontWeight: 600 }}>
                                        {isEmailVerified ? 'Yes' : 'No'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>

                        {/* 💡 التعديل هنا: تمت إضافة كرت الـ Platform Presentation (Address) */}
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
    );
}