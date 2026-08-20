import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Paper, Avatar, TextField, Stack, CircularProgress, Button } from '@mui/material';
import BusinessCenterOutlinedIcon  from '@mui/icons-material/BusinessCenterOutlined';
import EmailOutlinedIcon           from '@mui/icons-material/EmailOutlined';
import PhoneIphoneOutlinedIcon     from '@mui/icons-material/PhoneIphoneOutlined';
import VerifiedUserOutlinedIcon    from '@mui/icons-material/VerifiedUserOutlined';
import StarIcon                    from '@mui/icons-material/Star';
import ArrowBackIcon               from '@mui/icons-material/ArrowBack';
import QrCodeScannerOutlinedIcon   from '@mui/icons-material/QrCodeScannerOutlined'; // تم الاستيراد
import dayjs from 'dayjs';

import { T, typography } from '../Theme.jsx';
import Sidebar from '../components/Sidebar.jsx';
import TopBar from '../components/TopBar.jsx';

// تأكد من استيراد دالة جلب الـ QR من الـ Slice الخاص بك
import { fetchFreelancerById, fetchAdminFreelancerQr } from '../directorySlice.js';

// دالة إصلاح مسار الصورة
const fixImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith('http')) return img;

    // 👑 استخراج الرابط الأساسي بدون كلمة /api
    const base = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    const BACKEND_URL = base.replace(/\/api\/?$/, '');

    let cleanPath = img.startsWith('/') ? img : `/${img}`;
    if (cleanPath.includes('/uploads/') && !cleanPath.includes('/storage/')) {
        cleanPath = cleanPath.replace('/uploads/', '/storage/uploads/');
    }
    if (!cleanPath.startsWith('/storage/')) {
        cleanPath = `/storage${cleanPath}`;
    }
    return `${BACKEND_URL}${cleanPath}`;
};
export default function FreelancerProfilePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // جلب بيانات الـ QR من الـ state بالإضافة لبيانات الفريلانسر
    const {
        selectedFreelancer,
        freelancerLoading,
        error,
        adminQrUrl,       // الرابط القادم من الـ Thunk الجديد
        qrLoading         // حالة التحميل الخاصة بالـ QR
    } = useSelector((state) => state.directory);

    useEffect(() => {
        if (id) {
            dispatch(fetchFreelancerById(id));
            dispatch(fetchAdminFreelancerQr(id)); // استدعاء تابع الـ GET للـ QR
        }
    }, [dispatch, id]);

    if (freelancerLoading) {
        return (
            <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: T.pageBg }}>
                <Sidebar activeItem="Freelancers" />
                <Box sx={{ flexGrow: 1, ml: { xs: 0, md: "240px" }, display: 'flex', flexDirection: 'column' }}>
                    <TopBar title="Elite Admin" />
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                        <CircularProgress sx={{ color: T.gold }} />
                    </Box>
                </Box>
            </Box>
        );
    }

    if (error || !selectedFreelancer) {
        return (
            <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: T.pageBg }}>
                <Sidebar activeItem="Freelancers" />
                <Box sx={{ flexGrow: 1, ml: { xs: 0, md: "240px" }, display: 'flex', flexDirection: 'column' }}>
                    <TopBar title="Elite Admin" />
                    <Box sx={{ textAlign: 'center', py: 10, color: '#b05050' }}>
                        {error?.message || error || "No profile data found."}
                    </Box>
                </Box>
            </Box>
        );
    }

    // التفكيك الدقيق للبيانات
    const actualData = selectedFreelancer || {};

    const business = actualData.business || {};
    const identity = actualData.identity || {};
    const profileData = actualData.profile || {};
    const security = actualData.security || {};

    const displayName = business.brand_name || profileData.brand_name || identity.full_name || 'N/A';
    const initial = displayName !== 'N/A' ? displayName.charAt(0).toUpperCase() : '?';

    const email = identity.email || 'N/A';
    const phone = identity.phone || 'Not Provided';
    const createdAt = profileData.join_date ? dayjs(profileData.join_date).format('MMM DD, YYYY') : 'N/A';

    const providerType = profileData.provider_type || 'Freelancer';
    const rating = profileData.rating ?? 'N/A';

    const nationalId = business.national_id || 'N/A';
    const experienceYears = business.experience_years ? `${business.experience_years} Years` : 'N/A';

    const isPhoneVerified = !!security.is_phone_verified;
    const isEmailVerified = !!security.is_email_verified;

    // حالة الموافقة
    const approvalBadge = profileData.approval_badge || 'PENDING';
    const isApproved = approvalBadge.toUpperCase() === 'APPROVED';

    const industryCategories = Array.isArray(profileData.categories) && profileData.categories.length > 0
        ? profileData.categories.join(' • ')
        : 'N/A';

    // الرابط النهائي للـ QR (إما القادم من التابع الجديد أو الموجود مسبقاً في الداتا)
    const finalQrUrl = adminQrUrl || business.qr_url || profileData.qr_code_url || null;

    const card = {
        backgroundColor: T.cardBg,
        border: `1px solid ${T.border}`,
        borderRadius: 2,
        p: 3,
        boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
    };

    const inp = {
        '& .MuiOutlinedInput-root': {
            backgroundColor: T.pageBg,
            borderRadius: 1.5,
            '& fieldset': { borderColor: T.border },
            '&.Mui-focused fieldset': { borderColor: T.gold }
        },
        '& .MuiInputBase-input': {
            fontSize: '0.88rem',
            padding: '10px 14px',
            color: T.textPrimary,
            fontFamily: typography.fontFamily
        },
        '& .Mui-disabled': {
            WebkitTextFillColor: T.textPrimary,
            opacity: 0.9
        }
    };

    const FieldLabel = ({ children }) => (
        <Typography sx={{ ...typography.sectionLabel, mb: 0.75, display: 'block' }}>
            {children}
        </Typography>
    );

    const CardHeader = ({ icon: Icon, title }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Icon sx={{ color: T.gold, fontSize: 20 }} />
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: T.textPrimary, fontFamily: typography.fontFamily }}>{title}</Typography>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: T.pageBg }}>

            <Sidebar activeItem="Freelancers" />

            <Box component="main" sx={{ flexGrow: 1, ml: { xs: 0, md: "240px" }, display: 'flex', flexDirection: 'column' }}>

                <TopBar title="Elite Admin" />

                <Box sx={{ width: '100%', maxWidth: 1100, mx: 'auto', p: { xs: 2, md: 4 } }}>

                    <Box sx={{ mb: 4 }}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate(-1)}
                            sx={{ color: T.textMuted, mb: 1, textTransform: 'none', '&:hover': { color: T.gold } }}
                        >
                            Back to Freelancers
                        </Button>
                        <Typography sx={{ fontFamily: "'Cinzel', serif", fontSize: '2.2rem', fontWeight: 700, color: T.textPrimary, mb: 0.5 }}>
                            Freelancer Profile
                        </Typography>
                        <Typography sx={{ fontSize: '0.85rem', color: T.textMuted, fontWeight: 400, fontFamily: typography.fontFamily }}>
                            Admin view of freelancer credentials, personal details, and account status.
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', flexDirection: { xs: 'column', md: 'row' }, width: '100%' }}>

                        {/* ── العمود الأيسر ── */}
                        <Box sx={{ width: { xs: '100%', md: '33%' }, flexShrink: 0 }}>
                            <Stack spacing={3}>
                                <Paper elevation={0} sx={card}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                                        <Avatar sx={{ width: 96, height: 96, border: `2px solid ${T.gold}`, bgcolor: T.avatarBg, color: T.gold, fontSize: '2.5rem', mb: 1.5, fontWeight: 700 }}>
                                            {initial}
                                        </Avatar>
                                        <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: T.textPrimary, mb: 0.3, textTransform: 'capitalize', fontFamily: typography.fontFamily }}>
                                            {displayName}
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.6rem', letterSpacing: '0.14em', color: T.goldLabel, textTransform: 'uppercase', fontWeight: 700 }}>
                                            {providerType}
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                                            <StarIcon sx={{ color: T.gold, fontSize: 16 }} />
                                            <Typography sx={{ fontSize: '0.9rem', fontWeight: 'bold', color: T.textPrimary }}>
                                                {rating}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Stack spacing={0} divider={<Box sx={{ height: '1px', backgroundColor: T.border }} />}>
                                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', py: 2 }}>
                                            <EmailOutlinedIcon sx={{ color: T.textMuted, fontSize: 18, mt: '2px' }} />
                                            <Box><Typography sx={{ fontSize: '0.6rem', color: T.textMuted, textTransform: 'uppercase', fontWeight: 600 }}>Email Address</Typography><Typography sx={{ fontSize: '0.85rem', color: T.textPrimary, fontWeight: 600 }}>{email}</Typography></Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', py: 2 }}>
                                            <PhoneIphoneOutlinedIcon sx={{ color: T.textMuted, fontSize: 18, mt: '2px' }} />
                                            <Box><Typography sx={{ fontSize: '0.6rem', color: T.textMuted, textTransform: 'uppercase', fontWeight: 600 }}>Contact Number</Typography><Typography sx={{ fontSize: '0.85rem', color: T.textPrimary, fontWeight: 600 }}>{phone}</Typography></Box>
                                        </Box>
                                    </Stack>
                                </Paper>

                                <Paper elevation={0} sx={card}>
                                    <Typography sx={{ ...typography.sectionLabel, mb: 2.5 }}>Verification & Status</Typography>

                                    {/* عرض حالة الحساب (Approved/Pending) */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography sx={{ fontSize: '0.85rem', color: T.textPrimary, fontWeight: 600 }}>Approval Status</Typography>
                                        <Box sx={{ border: `1px solid ${isApproved ? '#2ecc71' : '#e74c3c'}`, color: isApproved ? '#2ecc71' : '#e74c3c', px: 1.2, py: 0.25, borderRadius: 1, fontSize: '0.6rem', fontWeight: 700 }}>
                                            {approvalBadge}
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography sx={{ fontSize: '0.85rem', color: T.textPrimary, fontWeight: 600 }}>Joined Platform</Typography>
                                        <Typography sx={{ fontSize: '0.8rem', color: T.textMuted }}>{createdAt}</Typography>
                                    </Box>
                                </Paper>

                                {/* ── قسم عرض الـ QR Code الخاص بالأدمن ── */}
                                <Paper elevation={0} sx={card}>
                                    <CardHeader icon={QrCodeScannerOutlinedIcon} title="Payment QR Code" />
                                    <Typography sx={{ fontSize: '0.75rem', color: T.textMuted, mb: 2 }}>
                                        Provider's official payment QR Code (View Only).
                                    </Typography>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{
                                            width: 140,
                                            height: 140,
                                            border: `2px dashed ${T.border}`,
                                            borderRadius: 2,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: T.pageBg,
                                            overflow: 'hidden'
                                        }}>
                                            {qrLoading ? (
                                                <CircularProgress size={30} sx={{ color: T.gold }} />
                                            ) : finalQrUrl ? (
                                                <img
                                                    src={fixImageUrl(finalQrUrl)}
                                                    alt="Provider QR Code"
                                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                />
                                            ) : (
                                                <Typography sx={{ fontSize: '0.7rem', color: T.textMuted }}>No QR Uploaded</Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </Paper>
                            </Stack>
                        </Box>

                        {/* ── العمود الأيمن ── */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Stack spacing={3}>
                                <Paper elevation={0} sx={card}>
                                    <CardHeader icon={BusinessCenterOutlinedIcon} title="Professional Credentials" />

                                    <Box sx={{ display: 'flex', gap: 2.5, mb: 2.5, flexDirection: { xs: 'column', sm: 'row' } }}>
                                        <Box sx={{ flex: 1 }}>
                                            <FieldLabel>Legal Full Name</FieldLabel>
                                            <TextField fullWidth size="small" value={identity.full_name || 'N/A'} disabled sx={inp} />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <FieldLabel>Brand / Stage Name</FieldLabel>
                                            <TextField fullWidth size="small" value={business.brand_name || profileData.brand_name || 'N/A'} disabled sx={inp} />
                                        </Box>
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
                                            <TextField fullWidth size="small" value={security.moderation_status || 'N/A'} disabled sx={{ ...inp, textTransform: 'capitalize' }} />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <FieldLabel>Provider Type</FieldLabel>
                                            <TextField fullWidth size="small" value={providerType} disabled sx={{ ...inp, textTransform: 'capitalize' }} />
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 2.5, flexDirection: { xs: 'column', sm: 'row' }, p: 2, bgcolor: T.pageBg, borderRadius: 2, border: `1px solid ${T.border}` }}>
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

                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}