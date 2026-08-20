import React, { useEffect, useState, useRef } from 'react';
import {
    Box, Typography, Paper, Button, Avatar,
    IconButton, TextField, MenuItem, Stack, CircularProgress,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Select
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon                    from '@mui/icons-material/Edit';
import BusinessCenterOutlinedIcon  from '@mui/icons-material/BusinessCenterOutlined';
import ArticleOutlinedIcon         from '@mui/icons-material/ArticleOutlined';
import VpnKeyOutlinedIcon          from '@mui/icons-material/VpnKeyOutlined';
import SaveOutlinedIcon            from '@mui/icons-material/SaveOutlined';
import VerifiedUserOutlinedIcon    from '@mui/icons-material/VerifiedUserOutlined';
import DeleteOutlinedIcon          from '@mui/icons-material/DeleteOutlined';
import SettingsOutlinedIcon        from '@mui/icons-material/SettingsOutlined';
import ReportProblemOutlinedIcon   from '@mui/icons-material/ReportProblemOutlined';
import QrCodeScannerOutlinedIcon   from '@mui/icons-material/QrCodeScannerOutlined';
import CloudUploadOutlinedIcon     from '@mui/icons-material/CloudUploadOutlined';

import { useSelector, useDispatch } from 'react-redux';
import {
    fetchProviderProfile,
    fetchServicesThunk,
    addServiceThunk,
    updateServiceThunk,
    deleteServiceThunk,
    fetchQrCodeThunk,
    updateProviderProfileThunk
} from './providerProfileSlice';
import dayjs from 'dayjs';
import providerService from '../../../services/companyService/providerService.js';

// 💡 استدعاء الألوان الموحدة
import {
    GOLD, BROWN_TEXT, MUTED_TEXT,
    LIGHT_CARD, LIGHT_INPUT, LIGHT_BORDER,
    DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_CARD_SHADOW,
    DARK_CARD_HOVER_SHADOW, DARK_SURFACE_BG, DARK_SURFACE_BORDER
} from '../../../utils/colorConstants';

export default function CompanyProfileSettings() {
    const theme  = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const dispatch = useDispatch();

    const { profile, companyServices = [], qrCodeUrl, loading, updateLoading } = useSelector((state) => state.providerProfile || {});

    const [serviceDialog, setServiceDialog] = useState({ open: false, mode: 'add', id: null, name: '', description: '' });
    const [errorDialog, setErrorDialog] = useState({ open: false, message: '' });
    const [actionLoading, setActionLoading] = useState(false);
    const [isUploadingQr, setIsUploadingQr] = useState(false);
    const qrFileInputRef = useRef(null);

    const [editData, setEditData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        settings_language: '',
        settings_theme: '',
        brand_name: ''
    });

    useEffect(() => {
        dispatch(fetchProviderProfile());
        dispatch(fetchServicesThunk());
        dispatch(fetchQrCodeThunk());
    }, [dispatch]);

    useEffect(() => {
        if (profile?.data) {
            const user = profile.data.user || {};
            const provider = profile.data.provider || {};
            setEditData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                phone: user.phone || '',
                email: user.email || '',
                settings_language: user.settings_language || 'en',
                settings_theme: user.settings_theme || 'light',
                brand_name: provider.brand_name || ''
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handlePublishChanges = async () => {
        try {
            const payload = { ...editData };
            if (!payload.phone || payload.phone.trim() === '') {
                delete payload.phone;
            }
            await dispatch(updateProviderProfileThunk(payload)).unwrap();
            setErrorDialog({ open: true, message: "Profile updated successfully!" });
        } catch (error) {
            setErrorDialog({ open: true, message: error });
        }
    };

    const handleOpenAddService = () => setServiceDialog({ open: true, mode: 'add', id: null, name: '', description: '' });
    const handleOpenEditService = (service) => setServiceDialog({ open: true, mode: 'edit', id: service.id, name: service.name, description: service.description || '' });

    const handleSaveService = async () => {
        if (!serviceDialog.name.trim()) return;
        setActionLoading(true);
        try {
            if (serviceDialog.mode === 'add') {
                await dispatch(addServiceThunk({ name: serviceDialog.name, description: serviceDialog.description })).unwrap();
            } else {
                await dispatch(updateServiceThunk({ id: serviceDialog.id, data: { name: serviceDialog.name, description: serviceDialog.description } })).unwrap();
            }
            setServiceDialog({ ...serviceDialog, open: false });
        } catch (error) { setErrorDialog({ open: true, message: error }); } finally { setActionLoading(false); }
    };

    const handleDeleteService = async (id) => {
        try { await dispatch(deleteServiceThunk(id)).unwrap(); }
        catch (error) { setErrorDialog({ open: true, message: error }); }
    };

    const handleQrUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploadingQr(true);
        try {
            await providerService.uploadCompanyQrCode(file);
            await dispatch(fetchQrCodeThunk()).unwrap();
        } catch (error) {
            setErrorDialog({ open: true, message: 'Failed to upload QR Code. Please try again.' });
        } finally {
            setIsUploadingQr(false);
            if (qrFileInputRef.current) qrFileInputRef.current.value = '';
        }
    };

    if (loading && !profile) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress sx={{ color: GOLD }} />
            </Box>
        );
    }

    const { data } = profile || {};
    const user = data?.user || {};
    const provider = data?.provider || {};
    const providerDetails = data?.provider_details || {};
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A';
    const initial = fullName.charAt(0).toUpperCase();
    const isVerified = provider.is_verified;
    const createdAt = provider.created_at ? dayjs(provider.created_at).format('MMM DD, YYYY') : 'N/A';

    const moderationStatus = provider.moderation_status || '';
    const providerType = provider.provider_type || '';
    const isPhoneVerified = user.is_phone_verified;
    const isEmailVerified = user.is_email_verified;

    const taxNumber = providerDetails.tax_number || '';
    const registrationNo = providerDetails.registration_no || '';
    const districtId = providerDetails.district_id || '';
    const addressDetails = providerDetails.address_details || '';
    const industryCategories = provider.categories ? provider.categories.map(c => c.name_en).join(', ') : '';
    const rejectionReason = provider.rejection_reason || 'No current rejections or notices. Your account is in good standing.';

    // 💡 الستايل الموحد للكروت الزجاجية
    const glassCardSx = {
        background: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
        border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
        borderRadius: 3,
        p: 3,
        backdropFilter: 'blur(16px)',
        boxShadow: isDark ? DARK_CARD_SHADOW : '0 18px 40px rgba(130, 100, 40, 0.10)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
            boxShadow: isDark ? DARK_CARD_HOVER_SHADOW : '0 20px 44px rgba(130, 100, 40, 0.2)',
            borderColor: isDark ? 'rgba(197, 160, 89, 0.22)' : 'rgba(197, 160, 89, 0.7)'
        }
    };

    // 💡 الستايل الموحد لحقول الإدخال
    const inp = {
        '& .MuiOutlinedInput-root': {
            backgroundColor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT,
            color: isDark ? '#ffffff' : BROWN_TEXT,
            borderRadius: 1.5,
            border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
            transition: 'border-color 0.3s ease',
            '& fieldset': { borderColor: 'transparent' },
            '&:hover fieldset': { borderColor: 'transparent' },
            '&.Mui-focused fieldset': { borderColor: 'transparent' },
            '&.Mui-focused': { border: `1px solid ${GOLD}` }
        },
        '& .MuiInputBase-input': { fontSize: '0.88rem', padding: '10px 14px' },
        '& .MuiSelect-select': { padding: '10px 14px', fontSize: '0.88rem' },
        '& .Mui-disabled': {
            WebkitTextFillColor: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT,
            opacity: 1
        }
    };

    // 💡 الستايل الموحد للقوائم المنسدلة
    const glassMenuProps = {
        PaperProps: {
            sx: {
                bgcolor: 'transparent !important',
                background: isDark ? `${DARK_CARD_BACKGROUND} !important` : `${LIGHT_CARD} !important`,
                border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
                color: isDark ? '#ffffff' : BROWN_TEXT,
                backdropFilter: 'blur(24px) !important',
                WebkitBackdropFilter: 'blur(24px) !important',
                backgroundImage: 'none !important',
                boxShadow: isDark ? DARK_CARD_SHADOW : '0 18px 40px rgba(130, 100, 40, 0.15)',
            }
        },
        MenuListProps: {
            sx: {
                backgroundColor: 'transparent !important',
                p: 1,
                '& .MuiMenuItem-root': {
                    borderRadius: '6px',
                    mb: 0.5,
                    transition: 'all 0.2s ease',
                    '&.Mui-selected': {
                        backgroundColor: isDark ? 'rgba(197, 160, 89, 0.25) !important' : 'rgba(197, 160, 89, 0.15) !important',
                        fontWeight: 'bold',
                        color: GOLD
                    },
                    '&:hover': {
                        backgroundColor: isDark ? 'rgba(197, 160, 89, 0.15)' : 'rgba(197, 160, 89, 0.1)',
                    }
                }
            }
        }
    };

    const FieldLabel = ({ children }) => (
        <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, mb: 0.75, display: 'block' }}>
            {children}
        </Typography>
    );

    const CardHeader = ({ icon: Icon, title, iconColor }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Icon sx={{ color: iconColor || GOLD, fontSize: 20 }} />
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: isDark ? '#ffffff' : BROWN_TEXT }}>{title}</Typography>
        </Box>
    );

    return (
        <Box sx={{ width: '100%', maxWidth: 1100, mx: 'auto', p: { xs: 2, md: 3 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    {/* 💡 تم تغيير اللون إلى الأبيض بالداكن والبني بالفاتح، مع زيادة حجم وسماكة الخط */}
                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 500, color: isDark ? '#ffffff' : BROWN_TEXT, mb: 0.5 }}>
                        Company Profile
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: isDark ? 'rgba(255,255,255,0.7)' : BROWN_TEXT, fontWeight: 500, lineHeight: 1.6, maxWidth: 480 }}>
                        Manage your elite credentials and organizational identity within the Aurelian Reserve ecosystem.
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={updateLoading ? <CircularProgress size={16} sx={{ color: GOLD }} /> : <SaveOutlinedIcon />}
                    onClick={handlePublishChanges}
                    disabled={updateLoading}
                    sx={{
                        borderColor: GOLD, color: GOLD, fontWeight: 600, textTransform: 'none', fontSize: '0.82rem', px: 2.5, py: 1, borderRadius: 2, letterSpacing: '0.05em',
                        '&:hover': { backgroundColor: 'rgba(197,160,89,0.1)', borderColor: GOLD },
                    }}>
                    {updateLoading ? 'Publishing...' : 'Publish Changes'}
                </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start', flexDirection: { xs: 'column', md: 'row' }, width: '100%' }}>
                <Box sx={{ width: { xs: '100%', md: '33%' }, flexShrink: 0 }}>
                    <Stack spacing={2.5}>
                        <Paper elevation={0} sx={glassCardSx}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                                <Box sx={{ position: 'relative', mb: 1.5 }}>
                                    <Avatar sx={{ width: 96, height: 96, border: `1px solid ${GOLD}`, bgcolor: isDark ? 'rgba(197, 160, 89, 0.15)' : 'rgba(197, 160, 89, 0.1)', color: GOLD, fontSize: '2.5rem' }}>{initial}</Avatar>
                                    <IconButton size="small" sx={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, backgroundColor: GOLD, color: '#140e0c', '&:hover': { backgroundColor: '#b38c45' } }}><EditIcon sx={{ fontSize: 14 }} /></IconButton>
                                </Box>
                                <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: isDark ? '#ffffff' : BROWN_TEXT, mb: 0.3, textTransform: 'capitalize' }}>{fullName}</Typography>
                                <Typography sx={{ fontSize: '0.6rem', letterSpacing: '0.14em', color: GOLD, textTransform: 'uppercase', fontWeight: 600 }}>Primary Representative</Typography>
                            </Box>

                            <Stack spacing={2}>
                                <Box><FieldLabel>First Name</FieldLabel><TextField fullWidth size="small" name="first_name" value={editData.first_name} onChange={handleChange} sx={inp} /></Box>
                                <Box><FieldLabel>Last Name</FieldLabel><TextField fullWidth size="small" name="last_name" value={editData.last_name} onChange={handleChange} sx={inp} /></Box>
                                <Box><FieldLabel>Email Address</FieldLabel><TextField fullWidth size="small" name="email" value={editData.email} onChange={handleChange} sx={inp} /></Box>
                                <Box><FieldLabel>Contact Number</FieldLabel><TextField fullWidth size="small" name="phone" value={editData.phone} onChange={handleChange} sx={inp} /></Box>
                                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', cursor: 'pointer', mt: 1 }}>
                                    <VpnKeyOutlinedIcon sx={{ color: GOLD, fontSize: 17 }} />
                                    <Typography sx={{ fontSize: '0.72rem', color: GOLD, fontWeight: 600, textTransform: 'uppercase', textDecoration: 'underline' }}>Forgot Password?</Typography>
                                </Box>
                            </Stack>
                        </Paper>

                        <Paper elevation={0} sx={glassCardSx}>
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, mb: 2, textTransform: 'uppercase' }}>Verification Status</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.75 }}>
                                <Typography sx={{ fontSize: '0.85rem', color: isDark ? '#ffffff' : BROWN_TEXT, fontWeight: 500 }}>Document Review</Typography>
                                <Box sx={{ border: `1px solid ${isVerified ? GOLD : '#ef5350'}`, color: isVerified ? GOLD : '#ef5350', px: 1.2, py: 0.25, borderRadius: 1, fontSize: '0.58rem', fontWeight: 700 }}>{isVerified ? 'VERIFIED' : 'PENDING'}</Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography sx={{ fontSize: '0.85rem', color: isDark ? '#ffffff' : BROWN_TEXT, fontWeight: 500 }}>Profile Created</Typography>
                                <Typography sx={{ fontSize: '0.8rem', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT }}>{createdAt}</Typography>
                            </Box>
                        </Paper>

                        <Paper elevation={0} sx={glassCardSx}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, textTransform: 'uppercase' }}>Services Provided</Typography>
                                <Typography onClick={handleOpenAddService} sx={{ fontSize: '0.62rem', color: GOLD, fontWeight: 700, cursor: 'pointer', '&:hover':{textDecoration: 'underline'} }}>+ ADD NEW SERVICE</Typography>
                            </Box>
                            <Box component="ul" sx={{ m: 0, pl: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                {companyServices.length === 0 ? (
                                    <Typography sx={{ fontSize: '0.8rem', color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT }}>No services added yet.</Typography>
                                ) : (
                                    companyServices.map((s) => (
                                        <Box component="li" key={s.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                                <Typography sx={{ fontSize: '0.83rem', fontWeight: 500, color: isDark ? '#ffffff' : BROWN_TEXT }}>{s.name}</Typography>
                                                {s.description && <Typography sx={{ fontSize: '0.75rem', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT }}>- {s.description}</Typography>}
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 0.5, mt: '-2px' }}>
                                                <IconButton size="small" onClick={() => handleOpenEditService(s)} sx={{ p: '2px', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, '&:hover':{color: GOLD} }}><EditIcon sx={{ fontSize: 14 }} /></IconButton>
                                                <IconButton size="small" onClick={() => handleDeleteService(s.id)} sx={{ p: '2px', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, '&:hover':{color: '#ef5350'} }}><DeleteOutlinedIcon sx={{ fontSize: 15 }} /></IconButton>
                                            </Box>
                                        </Box>
                                    ))
                                )}
                            </Box>
                        </Paper>

                        <Paper elevation={0} sx={glassCardSx}>
                            <CardHeader icon={SettingsOutlinedIcon} title="Application Preferences" />
                            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <Box sx={{ flex: 1 }}>
                                    <FieldLabel>System Language</FieldLabel>
                                    <Select fullWidth size="small" name="settings_language" value={editData.settings_language} onChange={handleChange} sx={inp} MenuProps={glassMenuProps}>
                                        <MenuItem value="en">English (EN)</MenuItem>
                                        <MenuItem value="ar">Arabic (AR)</MenuItem>
                                    </Select>
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <FieldLabel>UI Theme</FieldLabel>
                                    <Select fullWidth size="small" name="settings_theme" value={editData.settings_theme} onChange={handleChange} sx={inp} MenuProps={glassMenuProps}>
                                        <MenuItem value="light">Light Mode</MenuItem>
                                        <MenuItem value="dark">Dark Mode</MenuItem>
                                    </Select>
                                </Box>
                            </Box>
                        </Paper>

                        <Paper elevation={0} sx={glassCardSx}>
                            <CardHeader icon={QrCodeScannerOutlinedIcon} title="Payment QR Code" />
                            <Typography sx={{ fontSize: '0.75rem', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, mb: 2 }}>
                                Upload your company's official payment QR Code to allow customers to pay seamlessly.
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ width: 140, height: 140, border: isDark ? DARK_CARD_BORDER : `1px dashed ${LIGHT_BORDER}`, borderRadius: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT, overflow: 'hidden', position: 'relative' }}>
                                    {isUploadingQr ? (
                                        <CircularProgress size={30} sx={{ color: GOLD }} />
                                    ) : qrCodeUrl ? (
                                        <img src={qrCodeUrl} alt="Company QR Code" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    ) : (
                                        <QrCodeScannerOutlinedIcon sx={{ fontSize: 40, color: isDark ? 'rgba(255,255,255,0.2)' : MUTED_TEXT }} />
                                    )}
                                </Box>
                                <input type="file" accept="image/*" hidden ref={qrFileInputRef} onChange={handleQrUpload} />
                                <Button
                                    variant="outlined" startIcon={<CloudUploadOutlinedIcon />} onClick={() => qrFileInputRef.current && qrFileInputRef.current.click()} disabled={isUploadingQr}
                                    sx={{ color: GOLD, border: `1px solid ${GOLD}`, textTransform: 'none', fontSize: '0.75rem', fontWeight: 600, '&:hover': { borderColor: GOLD, backgroundColor: 'rgba(197,160,89,0.1)' } }}
                                >
                                    {qrCodeUrl ? 'Update QR Code' : 'Upload QR Code'}
                                </Button>
                            </Box>
                        </Paper>
                    </Stack>
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack spacing={2.5}>
                        <Paper elevation={0} sx={glassCardSx}>
                            <CardHeader icon={BusinessCenterOutlinedIcon} title="Company Credentials" />
                            <Box sx={{ mb: 2 }}>
                                <FieldLabel>Official Company Name</FieldLabel>
                                <TextField fullWidth size="small" name="brand_name" value={editData.brand_name} onChange={handleChange} sx={inp} />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <Box sx={{ flex: 1 }}><FieldLabel>Tax Identification Number</FieldLabel><TextField fullWidth size="small" value={taxNumber} disabled sx={inp} /></Box>
                                <Box sx={{ flex: 1 }}><FieldLabel>Commercial Registration</FieldLabel><TextField fullWidth size="small" value={registrationNo} disabled sx={inp} /></Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <Box sx={{ flex: 1 }}><FieldLabel>District ID</FieldLabel><TextField fullWidth size="small" value={districtId} disabled sx={inp} /></Box>
                                <Box sx={{ flex: 1 }}><FieldLabel>Industry Category</FieldLabel><TextField fullWidth size="small" value={industryCategories} disabled sx={inp} /></Box>
                            </Box>
                        </Paper>

                        <Paper elevation={0} sx={glassCardSx}>
                            <CardHeader icon={VerifiedUserOutlinedIcon} title="Account Status" />
                            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <Box sx={{ flex: 1 }}><FieldLabel>Moderation Status</FieldLabel><TextField fullWidth size="small" value={moderationStatus} disabled sx={{ ...inp, '& .MuiInputBase-input': { textTransform: 'capitalize' } }} /></Box>
                                <Box sx={{ flex: 1 }}><FieldLabel>Provider Type</FieldLabel><TextField fullWidth size="small" value={providerType} disabled sx={{ ...inp, '& .MuiInputBase-input': { textTransform: 'capitalize' } }} /></Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <Box sx={{ flex: 1 }}><FieldLabel>Phone Verified</FieldLabel><Typography sx={{ fontSize: '0.85rem', color: isPhoneVerified ? GOLD : '#ef5350', fontWeight: 600 }}>{isPhoneVerified ? 'Yes' : 'No'}</Typography></Box>
                                <Box sx={{ flex: 1 }}><FieldLabel>Email Verified</FieldLabel><Typography sx={{ fontSize: '0.85rem', color: isEmailVerified ? GOLD : '#ef5350', fontWeight: 600 }}>{isEmailVerified ? 'Yes' : 'No'}</Typography></Box>
                            </Box>
                        </Paper>

                        <Paper elevation={0} sx={{ ...glassCardSx, ...(provider.rejection_reason ? { borderColor: '#ef5350' } : {}) }}>
                            <CardHeader icon={ReportProblemOutlinedIcon} title="Moderation Notice" iconColor={provider.rejection_reason ? '#ef5350' : GOLD} />
                            <FieldLabel>Rejection Reason</FieldLabel>
                            <TextField fullWidth multiline rows={provider.rejection_reason ? 3 : 1} value={rejectionReason} disabled sx={{ ...inp, '& .MuiInputBase-input': { padding: '12px 14px', WebkitTextFillColor: provider.rejection_reason ? '#ef5350 !important' : (isDark ? 'rgba(255,255,255,0.5) !important' : `${MUTED_TEXT} !important`) } }} />
                        </Paper>

                        <Paper elevation={0} sx={glassCardSx}>
                            <CardHeader icon={ArticleOutlinedIcon} title="Platform Presentation" />
                            <FieldLabel>Address Details</FieldLabel>
                            <TextField fullWidth multiline rows={5} value={addressDetails} disabled sx={{ ...inp, '& .MuiInputBase-input': { padding: '12px 14px' } }} />
                        </Paper>
                    </Stack>
                </Box>
            </Box>

            <Dialog open={serviceDialog.open} onClose={() => setServiceDialog({ ...serviceDialog, open: false })} PaperProps={{ sx: { ...glassCardSx, minWidth: '350px', p: 1, backgroundImage: 'none' } }}>
                <DialogTitle sx={{ color: GOLD, fontWeight: 'bold', fontFamily: "'Playfair Display', serif" }}>{serviceDialog.mode === 'add' ? 'Add New Service' : 'Edit Service'}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <Box><FieldLabel>Service Name</FieldLabel><TextField fullWidth size="small" value={serviceDialog.name} onChange={(e) => setServiceDialog({ ...serviceDialog, name: e.target.value })} sx={inp} placeholder="Enter service name" /></Box>
                    <Box><FieldLabel>Description (Optional)</FieldLabel><TextField fullWidth size="small" multiline rows={3} value={serviceDialog.description} onChange={(e) => setServiceDialog({ ...serviceDialog, description: e.target.value })} sx={inp} placeholder="Service details" /></Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setServiceDialog({ ...serviceDialog, open: false })} sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, textTransform: 'none' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveService} disabled={actionLoading || !serviceDialog.name.trim()} sx={{ bgcolor: GOLD, color: '#131110', textTransform: 'none', fontWeight: 600, px: 3, '&:hover': { bgcolor: '#b38c45' } }}>{actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Save'}</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={errorDialog.open} onClose={() => setErrorDialog({ open: false, message: '' })} PaperProps={{ sx: { ...glassCardSx, minWidth: '350px', textAlign: 'center', p: 1, backgroundImage: 'none' } }}>
                <DialogTitle sx={{ color: '#ef5350', fontWeight: 'bold', fontFamily: "'Playfair Display', serif", fontSize: '1.5rem' }}>Notice</DialogTitle>
                <DialogContent><DialogContentText sx={{ color: isDark ? '#ffffff' : BROWN_TEXT, fontSize: '1.05rem', mt: 1, fontWeight: 500, whiteSpace: 'pre-line' }}>{errorDialog.message}</DialogContentText></DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 2 }}><Button onClick={() => setErrorDialog({ open: false, message: '' })} variant="contained" sx={{ bgcolor: GOLD, color: '#131110', textTransform: 'none', fontWeight: 600, px: 4, '&:hover': { bgcolor: '#b38c45' } }}>OK</Button></DialogActions>
            </Dialog>
        </Box>
    );
}