import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Paper, Avatar, TextField, Stack, CircularProgress, Button } from '@mui/material';

// الأيقونات
import BusinessCenterOutlinedIcon  from '@mui/icons-material/BusinessCenterOutlined';
import EmailOutlinedIcon           from '@mui/icons-material/EmailOutlined';
import PhoneIphoneOutlinedIcon     from '@mui/icons-material/PhoneIphoneOutlined';
import VerifiedUserOutlinedIcon    from '@mui/icons-material/VerifiedUserOutlined';
import ReportProblemOutlinedIcon   from '@mui/icons-material/ReportProblemOutlined';
import QrCodeScannerOutlinedIcon   from '@mui/icons-material/QrCodeScannerOutlined';
import ArrowBackIcon               from '@mui/icons-material/ArrowBack';
import StarIcon                    from '@mui/icons-material/Star';
import dayjs from 'dayjs';

// استيرادات الأدمن
import { T, typography } from '../Theme.jsx';
import Sidebar from '../components/Sidebar.jsx';
import TopBar from '../components/TopBar.jsx';
import { fetchCompanyById } from '../directorySlice.js';

export default function CompanyProfilePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { selectedCompany, companyLoading, error } = useSelector((state) => state.directory);

    useEffect(() => {
        if (id) {
            dispatch(fetchCompanyById(id));
        }
    }, [dispatch, id]);

    if (companyLoading) {
        return (
            <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: T.pageBg }}>
                <Sidebar activeItem="Company Directory" />
                <Box sx={{ flexGrow: 1, ml: { xs: 0, md: "240px" }, display: 'flex', flexDirection: 'column' }}>
                    <TopBar title="Elite Admin" />
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                        <CircularProgress sx={{ color: T.gold }} />
                    </Box>
                </Box>
            </Box>
        );
    }

    if (error || !selectedCompany) {
        return (
            <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: T.pageBg }}>
                <Sidebar activeItem="Company Directory" />
                <Box sx={{ flexGrow: 1, ml: { xs: 0, md: "240px" }, display: 'flex', flexDirection: 'column' }}>
                    <TopBar title="Elite Admin" />
                    <Box sx={{ textAlign: 'center', py: 10, color: '#b05050' }}>
                        {error?.message || error || "No company profile data found."}
                    </Box>
                </Box>
            </Box>
        );
    }

    const rawData = selectedCompany || {};
    const actualData = rawData.data?.user ? rawData.data : (Array.isArray(rawData) ? rawData[0] : rawData) || {};

    const business = actualData.business || actualData.provider_details || {};
    const identity = actualData.identity || actualData.user || {};
    const profileData = actualData.profile || actualData.provider || actualData || {};
    const security = actualData.security || actualData.provider || {};

    const displayName = business.brand_name || profileData.brand_name || identity.full_name || 'N/A';
    const fullName = identity.full_name || `${identity.first_name || ''} ${identity.last_name || ''}`.trim() || 'N/A';
    const initial = displayName !== 'N/A' ? displayName.charAt(0).toUpperCase() : '?';

    const email = identity.email || 'N/A';
    const phone = identity.phone || 'Not Provided';
    const createdAt = profileData.join_date || profileData.created_at ? dayjs(profileData.join_date || profileData.created_at).format('MMM DD, YYYY') : 'N/A';

    const moderationStatus = security.moderation_status || profileData.moderation_status || 'N/A';
    const providerType = profileData.provider_type || 'Company';
    const rating = profileData.rating ?? 'N/A';

    const taxNumber = business.tax_number || 'N/A';
    const registrationNo = business.registration_no || 'N/A';
    const districtId = business.district_id || profileData.district_id || 'N/A';

    const isPhoneVerified = !!security.is_phone_verified;
    const isEmailVerified = !!security.is_email_verified;

    const rejectionReason = security.rejection_reason || profileData.rejection_reason || 'No current rejections or notices. Account is in good standing.';
    const currentQrUrl = profileData.qr_code_url || business.qr_code_url || null;

    const industryCategories = Array.isArray(profileData.categories) && typeof profileData.categories[0] === 'string'
        ? profileData.categories.join(' • ')
        : (Array.isArray(profileData.categories) ? profileData.categories.map(c => c.name_en || c.name || '').join(' • ') : 'N/A');

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

    const CardHeader = ({ icon: Icon, title, iconColor }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Icon sx={{ color: iconColor || T.gold, fontSize: 20 }} />
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: T.textPrimary, fontFamily: typography.fontFamily }}>{title}</Typography>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: T.pageBg }}>

            <Sidebar activeItem="Company Directory" />

            <Box component="main" sx={{ flexGrow: 1, ml: { xs: 0, md: "240px" }, display: 'flex', flexDirection: 'column' }}>

                <TopBar title="Elite Admin" />

                <Box sx={{ width: '100%', maxWidth: 1100, mx: 'auto', p: { xs: 2, md: 4 } }}>

                    <Box sx={{ mb: 4 }}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate(-1)}
                            sx={{ color: T.textMuted, mb: 1, textTransform: 'none', '&:hover': { color: T.gold } }}
                        >
                            Back to Companies
                        </Button>
                        <Typography sx={{ fontFamily: "'Cinzel', serif", fontSize: '2.2rem', fontWeight: 700, color: T.textPrimary, mb: 0.5 }}>
                            Company Profile
                        </Typography>
                        <Typography sx={{ fontSize: '0.85rem', color: T.textMuted, fontWeight: 400, fontFamily: typography.fontFamily }}>
                            Admin view of organizational credentials, platform status, and operational details.
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
                                    <Typography sx={{ ...typography.sectionLabel, mb: 2.5 }}>Verification Status</Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography sx={{ fontSize: '0.85rem', color: T.textPrimary, fontWeight: 600 }}>Profile Created</Typography>
                                        <Typography sx={{ fontSize: '0.8rem', color: T.textMuted }}>{createdAt}</Typography>
                                    </Box>
                                </Paper>

                                {/* قسم الـ QR Code */}
                                <Paper elevation={0} sx={card}>
                                    <CardHeader icon={QrCodeScannerOutlinedIcon} title="Payment QR Code" />
                                    <Typography sx={{ fontSize: '0.75rem', color: T.textMuted, mb: 2 }}>
                                        Company's official payment QR Code.
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <Box sx={{
                                            width: 140, height: 140, border: `2px dashed ${T.border}`, borderRadius: 2,
                                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                                            backgroundColor: T.pageBg, overflow: 'hidden'
                                        }}>
                                            {currentQrUrl ? (
                                                <img src={currentQrUrl} alt="Company QR Code" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            ) : (
                                                <QrCodeScannerOutlinedIcon sx={{ fontSize: 40, color: T.textMuted, opacity: 0.5 }} />
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
                                    <CardHeader icon={BusinessCenterOutlinedIcon} title="Company Credentials" />

                                    <Box sx={{ display: 'flex', gap: 2.5, mb: 2.5, flexDirection: { xs: 'column', sm: 'row' } }}>
                                        <Box sx={{ flex: 1 }}>
                                            <FieldLabel>Legal Representative Name</FieldLabel>
                                            <TextField fullWidth size="small" value={fullName} disabled sx={inp} />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <FieldLabel>Brand / Company Name</FieldLabel>
                                            <TextField fullWidth size="small" value={displayName} disabled sx={inp} />
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 2.5, mb: 2.5, flexDirection: { xs: 'column', sm: 'row' } }}>
                                        <Box sx={{ flex: 1 }}>
                                            <FieldLabel>Tax Identification Number</FieldLabel>
                                            <TextField fullWidth size="small" value={taxNumber} disabled sx={inp} />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <FieldLabel>Commercial Registration</FieldLabel>
                                            <TextField fullWidth size="small" value={registrationNo} disabled sx={inp} />
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 2.5, mb: 2.5, flexDirection: { xs: 'column', sm: 'row' } }}>
                                        <Box sx={{ flex: 1 }}>
                                            <FieldLabel>District ID</FieldLabel>
                                            <TextField fullWidth size="small" value={districtId} disabled sx={inp} />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <FieldLabel>Industry Category</FieldLabel>
                                            <TextField fullWidth size="small" value={industryCategories} disabled sx={inp} />
                                        </Box>
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

                                    <Box sx={{ display: 'flex', gap: 2.5, flexDirection: { xs: 'column', sm: 'row' }, p: 2, bgcolor: T.pageBg, borderRadius: 2, border: `1px solid ${T.border}` }}>
                                        <Box sx={{ flex: 1 }}>
                                            <FieldLabel>Phone Verified</FieldLabel>
                                            <Typography sx={{ fontSize: '0.9rem', color: isPhoneVerified ? '#2ecc71' : '#e74c3c', fontWeight: 600 }}>{isPhoneVerified ? 'Yes' : 'No'}</Typography>
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <FieldLabel>Email Verified</FieldLabel>
                                            <Typography sx={{ fontSize: '0.9rem', color: isEmailVerified ? '#2ecc71' : '#e74c3c', fontWeight: 600 }}>{isEmailVerified ? 'Yes' : 'No'}</Typography>
                                        </Box>
                                    </Box>
                                </Paper>

                                <Paper elevation={0} sx={{ ...card, ...(security.rejection_reason || profileData.rejection_reason ? { borderColor: '#b05050' } : {}) }}>
                                    <CardHeader
                                        icon={ReportProblemOutlinedIcon}
                                        title="Moderation Notice"
                                        iconColor={(security.rejection_reason || profileData.rejection_reason) ? '#b05050' : T.textMuted}
                                    />
                                    <FieldLabel>Rejection Reason</FieldLabel>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={(security.rejection_reason || profileData.rejection_reason) ? 3 : 1}
                                        value={rejectionReason}
                                        disabled
                                        sx={{
                                            ...inp,
                                            '& .MuiInputBase-input': {
                                                padding: '12px 14px',
                                                color: (security.rejection_reason || profileData.rejection_reason) ? '#b05050' : T.textMuted
                                            }
                                        }}
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