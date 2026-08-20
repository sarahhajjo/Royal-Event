import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Paper, Avatar, TextField, Stack, CircularProgress, Button, IconButton, useTheme } from '@mui/material';
import BusinessCenterOutlinedIcon  from '@mui/icons-material/BusinessCenterOutlined';
import EmailOutlinedIcon           from '@mui/icons-material/EmailOutlined';
import PhoneIphoneOutlinedIcon     from '@mui/icons-material/PhoneIphoneOutlined';
import VerifiedUserOutlinedIcon    from '@mui/icons-material/VerifiedUserOutlined';
import StarIcon                    from '@mui/icons-material/Star';
import EditIcon                    from '@mui/icons-material/Edit';
import SaveIcon                    from '@mui/icons-material/Save';
import CancelIcon                  from '@mui/icons-material/Cancel';
import QrCodeScannerOutlinedIcon   from '@mui/icons-material/QrCodeScannerOutlined';
import CloudUploadOutlinedIcon     from '@mui/icons-material/CloudUploadOutlined';

import { useSelector, useDispatch } from 'react-redux';
import { fetchMyProfile, fetchFreelancerQrCode, uploadFreelancerQrCode, updateMyProfile } from './../freelancerProfileSlice';
import dayjs from 'dayjs';

import Sidebar from '../components/layout/Sidebar.jsx';
import Header from '../components/layout/Header.jsx';

// 👑 تحديث الدالة لتدعم متغيرات البيئة (Vite)
const fixImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith('http')) return img;

    // استخدام متغير البيئة أو الرابط المحلي كاحتياط
    const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

    let cleanPath = img.startsWith('/') ? img : `/${img}`;
    if (cleanPath.includes('/uploads/') && !cleanPath.includes('/storage/')) {
        cleanPath = cleanPath.replace('/uploads/', '/storage/uploads/');
    }
    if (!cleanPath.startsWith('/storage/')) {
        cleanPath = `/storage${cleanPath}`;
    }
    return `${BACKEND_URL}${cleanPath}`;
};

export default function MyProfilePage() {
    const theme  = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const dispatch = useDispatch();

    const { profileData, qrCodeUrl, status, isUploadingQr, error } = useSelector((state) => state.freelancerProfile);
    const qrFileInputRef = useRef(null);

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        brand_name: '',
        experience_years: ''
    });

    useEffect(() => {
        dispatch(fetchMyProfile());
        dispatch(fetchFreelancerQrCode());
    }, [dispatch]);

    const handleEditClick = () => {
        setFormData({
            brand_name: profileData?.provider?.brand_name || '',
            experience_years: profileData?.provider_details?.experience_years || ''
        });
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            await dispatch(updateMyProfile(formData)).unwrap();
            setIsEditing(false);
            dispatch(fetchMyProfile());
        } catch (err) {
            console.error("Failed to update profile:", err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleQrUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            await dispatch(uploadFreelancerQrCode(file)).unwrap();
            dispatch(fetchFreelancerQrCode());
        } catch (err) {
            console.error(err);
        } finally {
            if (qrFileInputRef.current) {
                qrFileInputRef.current.value = '';
            }
        }
    };

    // 👑 الستايل الزجاجي الموحد والمتكيف مع الثيم
    const glassSx = {
        background: isDark ? "rgba(15, 15, 20, 0.65)" : "rgba(250, 248, 245, 0.55)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid",
        borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
        borderRadius: "16px",
        boxShadow: isDark ? "0 8px 32px 0 rgba(0, 0, 0, 0.4)" : "0 8px 32px 0 rgba(130, 120, 110, 0.08)",
        p: 3,
    };

    if (status === 'loading') {
        return (
            <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}>
                <Sidebar />
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
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
            <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}>
                <Sidebar />
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Header title="My Profile" />
                    <Box sx={{ textAlign: 'center', py: 10, color: 'error.main' }}>
                        {error || "No profile data found."}
                    </Box>
                </Box>
            </Box>
        );
    }

    const user = profileData.user || {};
    const provider = profileData.provider || {};
    const providerDetails = profileData.provider_details || {};

    const fullName = user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A';
    const initial = fullName !== 'N/A' ? fullName.charAt(0).toUpperCase() : '?';
    const email = user.email || 'N/A';
    const phone = user.phone || 'Not Provided';
    const createdAt = user.created_at ? dayjs(user.created_at).format('MMM DD, YYYY') : 'N/A';

    const brandNameDisplay = provider.brand_name || 'N/A';
    const moderationStatus = provider.moderation_status || 'N/A';
    const providerType = provider.provider_type || 'Freelancer';
    const rating = provider.rating ?? 'N/A';

    const currentQrUrl = qrCodeUrl || provider.qr_url || provider.qr_code_url || null;

    const nationalId = providerDetails.national_id || 'N/A';
    const experienceYearsDisplay = providerDetails.experience_years ? `${providerDetails.experience_years} Years` : 'N/A';

    const isPhoneVerified = !!user.is_phone_verified;
    const isEmailVerified = !!user.is_email_verified;

    const industryCategories = provider.categories && provider.categories.length > 0
        ? provider.categories.map(c => c.name_en || c.name_ar || 'Unknown').join(' • ')
        : 'N/A';

    const gold  = theme.palette.primary.main;
    const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
    const inputBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)';

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
        <Box
            dir="ltr"
            sx={{
                display: 'flex',
                height: '100vh',
                overflow: 'hidden',
                backgroundImage: isDark
                    ? 'linear-gradient(to bottom, rgba(15, 15, 20, 0.75), rgba(15, 15, 20, 0.95)), url("/images/image_58ec0a.jpg")'
                    : 'linear-gradient(to bottom, rgba(240, 235, 225, 0.4), rgba(255, 255, 255, 0.85)), url("/images/image_58ec0a.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                backgroundRepeat: 'no-repeat',
                color: theme.palette.text.primary,
            }}
        >
            <Sidebar activeItem="My Profile" />

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
                <Header title="My Profile" user={{ name: fullName, role: providerType, avatar: '' }} />

                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        overflowY: 'auto',
                        px: { xs: 3, md: 4, lg: 5 },
                        py: 3.5,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Box sx={{ ...glassSx, p: { xs: 3, md: 4, lg: 5 }, display: 'flex', flexDirection: 'column', gap: 4, maxWidth: '1152px', mx: 'auto', width: '100%' }}>

                        {/* رأس الصفحة وأزرار التعديل */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, borderBottom: '1px solid', borderColor: border, pb: 3 }}>
                            <Box>
                                <Typography sx={{ fontFamily: "'Cinzel', serif", fontSize: '2.2rem', fontWeight: 700, color: gold, mb: 0.5 }}>
                                    My Profile
                                </Typography>
                                <Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.secondary, fontWeight: 400 }}>
                                    Manage your credentials, personal details, and account status.
                                </Typography>
                            </Box>

                            {!isEditing ? (
                                <Button
                                    variant="contained"
                                    startIcon={<EditIcon />}
                                    onClick={handleEditClick}
                                    sx={{ backgroundColor: gold, color: isDark ? '#000' : '#fff', fontWeight: 'bold', '&:hover': { backgroundColor: isDark ? '#b38f40' : '#8c6b30' } }}
                                >
                                    Edit Profile
                                </Button>
                            ) : (
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<CancelIcon />}
                                        onClick={handleCancelEdit}
                                        disabled={isSaving}
                                        sx={{ color: theme.palette.text.secondary, borderColor: border }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                        onClick={handleSaveProfile}
                                        disabled={isSaving}
                                        sx={{ backgroundColor: gold, color: isDark ? '#000' : '#fff', fontWeight: 'bold', '&:hover': { backgroundColor: isDark ? '#b38f40' : '#8c6b30' } }}
                                    >
                                        Save Changes
                                    </Button>
                                </Box>
                            )}
                        </Box>

                        <Box sx={{ display: 'flex', gap: 3.5, alignItems: 'flex-start', flexDirection: { xs: 'column', md: 'row' }, width: '100%' }}>

                            {/* ── العمود الأيسر ── */}
                            <Box sx={{ width: { xs: '100%', md: '33%' }, flexShrink: 0 }}>
                                <Stack spacing={3}>
                                    <Paper elevation={0} sx={{ ...glassSx, bgcolor: isDark ? 'rgba(15,15,20,0.4)' : 'rgba(255,255,255,0.4)', boxShadow: 'none' }}>
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

                                    <Paper elevation={0} sx={{ ...glassSx, bgcolor: isDark ? 'rgba(15,15,20,0.4)' : 'rgba(255,255,255,0.4)', boxShadow: 'none' }}>
                                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', color: theme.palette.text.secondary, mb: 2.5, textTransform: 'uppercase' }}>Verification & Status</Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.primary, fontWeight: 500 }}>Identity Verification</Typography>
                                            <Box sx={{ border: `1px solid ${moderationStatus === 'approved' ? '#2ecc71' : '#e74c3c'}`, color: moderationStatus === 'approved' ? '#2ecc71' : '#e74c3c', px: 1.2, py: 0.25, borderRadius: 1, fontSize: '0.6rem', fontWeight: 700 }}>
                                                {moderationStatus === 'approved' ? 'APPROVED' : 'PENDING'}
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.primary, fontWeight: 500 }}>Joined Platform</Typography>
                                            <Typography sx={{ fontSize: '0.8rem', color: theme.palette.text.secondary }}>{createdAt}</Typography>
                                        </Box>
                                    </Paper>

                                    {/* قسم الـ Payment QR Code */}
                                    <Paper elevation={0} sx={{ ...glassSx, bgcolor: isDark ? 'rgba(15,15,20,0.4)' : 'rgba(255,255,255,0.4)', boxShadow: 'none' }}>
                                        <CardHeader icon={QrCodeScannerOutlinedIcon} title="Payment QR Code" />
                                        <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary, mb: 2 }}>
                                            Upload your official payment QR Code to allow clients to pay seamlessly.
                                        </Typography>

                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{
                                                width: 140,
                                                height: 140,
                                                border: `2px dashed ${border}`,
                                                borderRadius: 2,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : '#ffffff',
                                                overflow: 'hidden',
                                                position: 'relative'
                                            }}>
                                                {isUploadingQr ? (
                                                    <CircularProgress size={30} sx={{ color: gold }} />
                                                ) : currentQrUrl ? (
                                                    <img
                                                        src={fixImageUrl(currentQrUrl)}
                                                        alt="Payment QR Code"
                                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                    />
                                                ) : (
                                                    <QrCodeScannerOutlinedIcon sx={{ fontSize: 40, color: theme.palette.text.secondary, opacity: 0.5 }} />
                                                )}
                                            </Box>

                                            <input
                                                type="file"
                                                accept="image/*"
                                                hidden
                                                ref={qrFileInputRef}
                                                onChange={handleQrUpload}
                                            />
                                            <Button
                                                variant="outlined"
                                                startIcon={<CloudUploadOutlinedIcon />}
                                                onClick={() => qrFileInputRef.current && qrFileInputRef.current.click()}
                                                disabled={isUploadingQr}
                                                sx={{
                                                    color: gold,
                                                    borderColor: border,
                                                    textTransform: 'none',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    '&:hover': { borderColor: gold, backgroundColor: isDark ? 'rgba(197,160,89,0.05)' : 'rgba(197,160,89,0.08)' }
                                                }}
                                            >
                                                {currentQrUrl ? 'Update QR Code' : 'Upload QR Code'}
                                            </Button>
                                        </Box>
                                    </Paper>

                                </Stack>
                            </Box>

                            {/* ── العمود الأيمن ── */}
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Stack spacing={3}>
                                    <Paper elevation={0} sx={{ ...glassSx, bgcolor: isDark ? 'rgba(15,15,20,0.4)' : 'rgba(255,255,255,0.4)', boxShadow: 'none' }}>
                                        <CardHeader icon={BusinessCenterOutlinedIcon} title="Professional Credentials" />

                                        <Box sx={{ mb: 2.5 }}>
                                            <FieldLabel>Brand / Stage Name</FieldLabel>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                name="brand_name"
                                                value={isEditing ? formData.brand_name : brandNameDisplay}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                sx={inp}
                                            />
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: 2.5, mb: 2.5, flexDirection: { xs: 'column', sm: 'row' } }}>
                                            <Box sx={{ flex: 1 }}>
                                                <FieldLabel>National ID</FieldLabel>
                                                <TextField fullWidth size="small" value={nationalId} disabled sx={inp} />
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <FieldLabel>Experience Years</FieldLabel>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    name="experience_years"
                                                    type="number"
                                                    value={isEditing ? formData.experience_years : experienceYearsDisplay.replace(' Years', '')}
                                                    onChange={handleChange}
                                                    disabled={!isEditing}
                                                    sx={inp}
                                                />
                                            </Box>
                                        </Box>

                                        <Box>
                                            <FieldLabel>Expertise Categories</FieldLabel>
                                            <TextField fullWidth size="small" value={industryCategories} disabled sx={inp} />
                                        </Box>
                                    </Paper>

                                    <Paper elevation={0} sx={{ ...glassSx, bgcolor: isDark ? 'rgba(15,15,20,0.4)' : 'rgba(255,255,255,0.4)', boxShadow: 'none' }}>
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

                                </Stack>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}