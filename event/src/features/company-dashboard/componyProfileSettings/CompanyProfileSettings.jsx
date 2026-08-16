import React, { useEffect, useState, useRef } from 'react';
import {
    Box, Typography, Paper, Button, Avatar,
    IconButton, TextField, MenuItem, Stack, Divider, CircularProgress,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon                    from '@mui/icons-material/Edit';
import BusinessCenterOutlinedIcon  from '@mui/icons-material/BusinessCenterOutlined';
import ArticleOutlinedIcon         from '@mui/icons-material/ArticleOutlined';
import EmailOutlinedIcon           from '@mui/icons-material/EmailOutlined';
import PhoneIphoneOutlinedIcon     from '@mui/icons-material/PhoneIphoneOutlined';
import VpnKeyOutlinedIcon          from '@mui/icons-material/VpnKeyOutlined';
import SaveOutlinedIcon            from '@mui/icons-material/SaveOutlined';
import VerifiedUserOutlinedIcon    from '@mui/icons-material/VerifiedUserOutlined';
import GroupAddOutlinedIcon        from '@mui/icons-material/GroupAddOutlined';
import DeleteOutlinedIcon          from '@mui/icons-material/DeleteOutlined';
import SettingsOutlinedIcon        from '@mui/icons-material/SettingsOutlined';
import ReportProblemOutlinedIcon   from '@mui/icons-material/ReportProblemOutlined';
// 💡 استيراد أيقونات الـ QR
import QrCodeScannerOutlinedIcon   from '@mui/icons-material/QrCodeScannerOutlined';
import CloudUploadOutlinedIcon     from '@mui/icons-material/CloudUploadOutlined';

import { useSelector, useDispatch } from 'react-redux';
import {
    fetchProviderProfile,
    fetchServicesThunk,
    addServiceThunk,
    updateServiceThunk,
    deleteServiceThunk
} from './providerProfileSlice';
import dayjs from 'dayjs';
// 💡 استيراد الـ service لرفع الصورة
import providerService from '../../../services/companyService/providerService.js'; // تأكدي من مسار الاستيراد حسب مشروعك
const fixImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith('http')) return img;
    const BACKEND_URL = 'http://127.0.0.1:8000';
    let cleanPath = img.startsWith('/') ? img : `/${img}`;
    if (cleanPath.includes('/uploads/') && !cleanPath.includes('/storage/')) {
        cleanPath = cleanPath.replace('/uploads/', '/storage/uploads/');
    }
    if (!cleanPath.startsWith('/storage/')) {
        cleanPath = `/storage${cleanPath}`;
    }
    return `${BACKEND_URL}${cleanPath}`;
};
export default function CompanyProfileSettings() {
    const theme  = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const dispatch = useDispatch();

    const { profile, companyServices = [], loading } = useSelector((state) => state.providerProfile || {});

    const [serviceDialog, setServiceDialog] = useState({ open: false, mode: 'add', id: null, name: '', description: '' });
    const [errorDialog, setErrorDialog] = useState({ open: false, message: '' });
    const [actionLoading, setActionLoading] = useState(false);

    // 💡 حالات التحكم برفع الـ QR Code
    const [isUploadingQr, setIsUploadingQr] = useState(false);
    const qrFileInputRef = useRef(null);

    useEffect(() => {
        dispatch(fetchProviderProfile());
        dispatch(fetchServicesThunk());
    }, [dispatch]);

    const gold        = theme.palette.primary.main;
    const border      = isDark ? 'rgba(197,160,89,0.18)' : 'rgba(0,0,0,0.10)';
    const cardBg      = theme.palette.background.paper;
    const inputBg     = isDark ? 'rgba(0,0,0,0.28)' : 'rgba(0,0,0,0.02)';

    const card = {
        backgroundColor: cardBg,
        border:          `1px solid ${border}`,
        borderRadius:    3,
        p:               3,
    };

    const inp = {
        '& .MuiOutlinedInput-root': {
            backgroundColor: inputBg,
            borderRadius:    1.5,
            '& fieldset':            { borderColor: border },
            '&:hover fieldset':      { borderColor: gold  },
            '&.Mui-focused fieldset': { borderColor: gold },
        },
        '& .MuiInputBase-input': {
            fontSize: '0.88rem',
            color:    theme.palette.text.primary,
            padding:  '10px 14px',
        },
        '& .MuiSelect-select': {
            padding: '10px 14px',
            fontSize: '0.88rem',
        },
    };

    const FieldLabel = ({ children }) => (
        <Typography sx={{
            fontSize:      '0.6rem',
            fontWeight:    700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color:         theme.palette.text.secondary,
            mb:            0.75,
            display:       'block',
        }}>
            {children}
        </Typography>
    );

    const CardHeader = ({ icon: Icon, title, iconColor }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Icon sx={{ color: iconColor || theme.palette.text.secondary, fontSize: 20 }} />
            <Typography sx={{
                fontSize:   '0.95rem',
                fontWeight: 600,
                color:      theme.palette.text.primary,
            }}>
                {title}
            </Typography>
        </Box>
    );

    const handleOpenAddService = () => setServiceDialog({ open: true, mode: 'add', id: null, name: '', description: '' });

    const handleOpenEditService = (service) => {
        setServiceDialog({ open: true, mode: 'edit', id: service.id, name: service.name, description: service.description || '' });
    };

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
        } catch (error) {
            setErrorDialog({ open: true, message: error });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteService = async (id) => {
        try {
            await dispatch(deleteServiceThunk(id)).unwrap();
        } catch (error) {
            setErrorDialog({ open: true, message: error });
        }
    };

    // 💡 دالة التعامل مع اختيار ملف الـ QR
    const handleQrUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploadingQr(true);
        try {
            // 1. رفع الصورة للباك إند
            await providerService.uploadCompanyQrCode(file);

            // 2. 💡 إعادة جلب بيانات البروفايل فوراً لتحديث الصفحة وعرض الصورة
            await dispatch(fetchProviderProfile()).unwrap();

        } catch (error) {
            setErrorDialog({ open: true, message: 'Failed to upload QR Code. Please try again.' });
        } finally {
            setIsUploadingQr(false);
            if (qrFileInputRef.current) {
                qrFileInputRef.current.value = '';
            }
        }
    };
    if (loading || !profile) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress color="primary" />
            </Box>
        );
    }

    const { data } = profile;
    const user = data?.user || {};
    const provider = data?.provider || {};
    const providerDetails = data?.provider_details || {};
    const fullName = user.full_name || 'N/A';
    const initial = fullName.charAt(0).toUpperCase();
    const email = user.email || 'N/A';
    const phone = user.phone || 'N/A';
    const isVerified = provider.is_verified;
    const createdAt = provider.created_at ? dayjs(provider.created_at).format('MMM DD, YYYY') : 'N/A';

    const brandName = provider.brand_name || '';
    const moderationStatus = provider.moderation_status || '';
    const providerType = provider.provider_type || '';
    const isPhoneVerified = user.is_phone_verified;
    const isEmailVerified = user.is_email_verified;

    const taxNumber = providerDetails.tax_number || '';
    const registrationNo = providerDetails.registration_no || '';
    const districtId = providerDetails.district_id || '';
    const addressDetails = providerDetails.address_details || '';
    const industryCategories = provider.categories ? provider.categories.map(c => c.name_en).join(', ') : '';

    const settingsLanguage = user.settings_language === 'ar' ? 'Arabic (AR)' : user.settings_language === 'en' ? 'English (EN)' : (user.settings_language || 'N/A');
    const settingsTheme = user.settings_theme === 'dark' ? 'Dark Mode' : user.settings_theme === 'light' ? 'Light Mode' : (user.settings_theme || 'N/A');
    const rejectionReason = provider.rejection_reason || 'No current rejections or notices. Your account is in good standing.';

    // 💡 رابط صورة الـ QR من الباك إند (يُرجى التأكد من اسم الحقل القادم من الـ API، ربما يكون qr_image أو qr_code_url)
    // جلب الحقل أياً كان اسمه في هذا البرانش وتمريره لدالة معالجة الرابط
    // جلب الرابط مباشرة من حقل qr_code_url القادم من السيرفر
    const currentQrUrl = provider.qr_code_url || null;
    return (
        <Box sx={{ width: '100%', maxWidth: 1100, mx: 'auto', p: { xs: 2, md: 3 } }}>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 400, color: gold, mb: 0.5 }}>
                        Company Profile
                    </Typography>
                    <Typography sx={{ fontSize: '0.82rem', color: theme.palette.text.secondary, fontWeight: 300, lineHeight: 1.6, maxWidth: 480 }}>
                        Manage your elite credentials and organizational identity within the Aurelian Reserve ecosystem.
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<SaveOutlinedIcon />}
                    sx={{
                        borderColor: gold, color: gold, fontWeight: 600, textTransform: 'none',
                        fontSize: '0.82rem', px: 2.5, py: 1, borderRadius: 2, letterSpacing: '0.05em',
                        '&:hover': { backgroundColor: isDark ? 'rgba(197,160,89,0.08)' : 'rgba(197,160,89,0.06)', borderColor: gold },
                    }}
                >
                    Publish Changes
                </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start', flexDirection: { xs: 'column', md: 'row' }, width: '100%' }}>

                {/* العمود الأيسر */}
                <Box sx={{ width: { xs: '100%', md: '33%' }, flexShrink: 0 }}>
                    <Stack spacing={2.5}>
                        <Paper elevation={0} sx={card}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                                <Box sx={{ position: 'relative', mb: 1.5 }}>
                                    <Avatar sx={{ width: 96, height: 96, border: `2px solid ${gold}`, bgcolor: isDark ? '#2e2318' : '#e8dcc0', color: gold, fontSize: '2.5rem' }}>
                                        {initial}
                                    </Avatar>
                                    <IconButton size="small" sx={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, backgroundColor: gold, color: '#140e0c', '&:hover': { backgroundColor: '#b38c45' } }}>
                                        <EditIcon sx={{ fontSize: 14 }} />
                                    </IconButton>
                                </Box>
                                <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: theme.palette.text.primary, mb: 0.3, textTransform: 'capitalize' }}>{fullName}</Typography>
                                <Typography sx={{ fontSize: '0.6rem', letterSpacing: '0.14em', color: gold, textTransform: 'uppercase', fontWeight: 600 }}>Primary Representative</Typography>
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
                                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', py: 1.5, cursor: 'pointer' }}>
                                    <VpnKeyOutlinedIcon sx={{ color: gold, fontSize: 17 }} />
                                    <Typography sx={{ fontSize: '0.72rem', color: gold, fontWeight: 600, textTransform: 'uppercase', textDecoration: 'underline' }}>Forgot Password?</Typography>
                                </Box>
                            </Stack>
                        </Paper>

                        <Paper elevation={0} sx={card}>
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', color: theme.palette.text.secondary, mb: 2 }}>Verification Status</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.75 }}>
                                <Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.primary, fontWeight: 500 }}>Document Review</Typography>
                                <Box sx={{ border: `1px solid ${isVerified ? gold : '#b05050'}`, color: isVerified ? gold : '#b05050', px: 1.2, py: 0.25, borderRadius: 1, fontSize: '0.58rem', fontWeight: 700 }}>{isVerified ? 'VERIFIED' : 'PENDING'}</Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.primary, fontWeight: 500 }}>Profile Created</Typography>
                                <Typography sx={{ fontSize: '0.8rem', color: theme.palette.text.secondary }}>{createdAt}</Typography>
                            </Box>
                        </Paper>

                        <Paper elevation={0} sx={card}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', color: theme.palette.text.secondary }}>Services Provided</Typography>
                                <Typography onClick={handleOpenAddService} sx={{ fontSize: '0.62rem', color: gold, fontWeight: 700, cursor: 'pointer', '&:hover':{textDecoration: 'underline'} }}>+ ADD NEW SERVICE</Typography>
                            </Box>

                            <Box component="ul" sx={{ m: 0, pl: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                {companyServices.length === 0 ? (
                                    <Typography sx={{ fontSize: '0.8rem', color: theme.palette.text.secondary }}>No services added yet.</Typography>
                                ) : (
                                    companyServices.map((s) => (
                                        <Box component="li" key={s.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                                <Typography sx={{ fontSize: '0.83rem', fontWeight: 500, color: theme.palette.text.primary }}>
                                                    {s.name}
                                                </Typography>
                                                {s.description && (
                                                    <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary }}>
                                                        - {s.description}
                                                    </Typography>
                                                )}
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 0.5, mt: '-2px' }}>
                                                <IconButton size="small" onClick={() => handleOpenEditService(s)} sx={{ p: '2px', color: theme.palette.text.secondary, '&:hover':{color: gold} }}>
                                                    <EditIcon sx={{ fontSize: 14 }} />
                                                </IconButton>
                                                <IconButton size="small" onClick={() => handleDeleteService(s.id)} sx={{ p: '2px', color: theme.palette.text.secondary, '&:hover':{color: '#c0392b'} }}>
                                                    <DeleteOutlinedIcon sx={{ fontSize: 15 }} />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    ))
                                )}
                            </Box>
                        </Paper>

                        <Paper elevation={0} sx={card}>
                            <CardHeader icon={SettingsOutlinedIcon} title="Application Preferences" />
                            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <Box sx={{ flex: 1 }}>
                                    <FieldLabel>System Language</FieldLabel>
                                    <TextField fullWidth size="small" value={settingsLanguage} disabled sx={inp} />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <FieldLabel>UI Theme</FieldLabel>
                                    <TextField fullWidth size="small" value={settingsTheme} disabled sx={inp} />
                                </Box>
                            </Box>
                        </Paper>

                        {/* 💡 القسم الجديد: إعدادات الدفع ورفع الـ QR Code */}
                        <Paper elevation={0} sx={card}>
                            <CardHeader icon={QrCodeScannerOutlinedIcon} title="Payment QR Code" />
                            <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary, mb: 2 }}>
                                Upload your company's official payment QR Code to allow customers to pay seamlessly.
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                {/* مربع عرض الـ QR الحالي */}
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
                                        <img src={currentQrUrl} alt="Company QR Code" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    ) : (
                                        <QrCodeScannerOutlinedIcon sx={{ fontSize: 40, color: theme.palette.text.secondary, opacity: 0.5 }} />
                                    )}
                                </Box>

                                {/* زر اختيار ورفع الصورة */}
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

                {/* العمود الأيمن */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack spacing={2.5}>
                        <Paper elevation={0} sx={card}>
                            <CardHeader icon={BusinessCenterOutlinedIcon} title="Company Credentials" />
                            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <Box sx={{ flex: 1 }}><FieldLabel>Official Company Name</FieldLabel><TextField fullWidth size="small" value={brandName} disabled sx={inp} /></Box>
                                <Box sx={{ flex: 1 }}><FieldLabel>Tax Identification Number</FieldLabel><TextField fullWidth size="small" value={taxNumber} disabled sx={inp} /></Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <Box sx={{ flex: 1 }}><FieldLabel>Commercial Registration</FieldLabel><TextField fullWidth size="small" value={registrationNo} disabled sx={inp} /></Box>
                                <Box sx={{ flex: 1 }}><FieldLabel>District ID</FieldLabel><TextField fullWidth size="small" value={districtId} disabled sx={inp} /></Box>
                            </Box>
                            <Box><FieldLabel>Industry Category</FieldLabel><TextField fullWidth size="small" value={industryCategories} disabled sx={inp} /></Box>
                        </Paper>

                        <Paper elevation={0} sx={card}>
                            <CardHeader icon={VerifiedUserOutlinedIcon} title="Account Status" />
                            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
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
                                    <Typography sx={{ fontSize: '0.85rem', color: isPhoneVerified ? gold : '#b05050', fontWeight: 600 }}>{isPhoneVerified ? 'Yes' : 'No'}</Typography>
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <FieldLabel>Email Verified</FieldLabel>
                                    <Typography sx={{ fontSize: '0.85rem', color: isEmailVerified ? gold : '#b05050', fontWeight: 600 }}>{isEmailVerified ? 'Yes' : 'No'}</Typography>
                                </Box>
                            </Box>
                        </Paper>

                        <Paper elevation={0} sx={{ ...card, ...(provider.rejection_reason ? { borderColor: '#b05050' } : {}) }}>
                            <CardHeader icon={ReportProblemOutlinedIcon} title="Moderation Notice" iconColor={provider.rejection_reason ? '#b05050' : theme.palette.text.secondary} />
                            <FieldLabel>Rejection Reason</FieldLabel>
                            <TextField
                                fullWidth
                                multiline
                                rows={provider.rejection_reason ? 3 : 1}
                                value={rejectionReason}
                                disabled
                                sx={{
                                    ...inp,
                                    '& .MuiInputBase-input': {
                                        padding: '12px 14px',
                                        color: provider.rejection_reason ? '#b05050' : theme.palette.text.secondary
                                    }
                                }}
                            />
                        </Paper>

                        <Paper elevation={0} sx={card}>
                            <CardHeader icon={ArticleOutlinedIcon} title="Platform Presentation" />
                            <FieldLabel>Address Details</FieldLabel>
                            <TextField fullWidth multiline rows={5} value={addressDetails} disabled sx={{ ...inp, '& .MuiInputBase-input': { padding: '12px 14px' } }} />
                        </Paper>

                    </Stack>
                </Box>
            </Box>

            <Dialog open={serviceDialog.open} onClose={() => setServiceDialog({ ...serviceDialog, open: false })} PaperProps={{ sx: { bgcolor: isDark ? '#1c1512' : '#EFE4C9', border: `1px solid ${border}`, borderRadius: '12px', minWidth: '350px', p: 1 } }}>
                <DialogTitle sx={{ color: gold, fontWeight: 'bold', fontFamily: "'Playfair Display', serif" }}>
                    {serviceDialog.mode === 'add' ? 'Add New Service' : 'Edit Service'}
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <Box>
                        <FieldLabel>Service Name</FieldLabel>
                        <TextField fullWidth size="small" value={serviceDialog.name} onChange={(e) => setServiceDialog({ ...serviceDialog, name: e.target.value })} sx={inp} placeholder="Enter service name" />
                    </Box>
                    <Box>
                        <FieldLabel>Description (Optional)</FieldLabel>
                        <TextField fullWidth size="small" multiline rows={3} value={serviceDialog.description} onChange={(e) => setServiceDialog({ ...serviceDialog, description: e.target.value })} sx={inp} placeholder="Service details" />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setServiceDialog({ ...serviceDialog, open: false })} sx={{ color: theme.palette.text.secondary }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveService} disabled={actionLoading || !serviceDialog.name.trim()} sx={{ bgcolor: gold, color: theme.palette.background.default, textTransform: 'none', fontWeight: 600, px: 3, '&:hover': { bgcolor: '#b38c45' } }}>
                        {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={errorDialog.open} onClose={() => setErrorDialog({ open: false, message: '' })} PaperProps={{ sx: { bgcolor: isDark ? '#1c1512' : '#EFE4C9', border: `1px solid ${border}`, borderRadius: '12px', minWidth: '350px', textAlign: 'center', p: 1 } }}>
                <DialogTitle sx={{ color: '#c0392b', fontWeight: 'bold', fontFamily: "'Playfair Display', serif", fontSize: '1.5rem' }}>Notice</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: theme.palette.text.primary, fontSize: '1.05rem', mt: 1, fontWeight: 500, whiteSpace: 'pre-line' }}>
                        {errorDialog.message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button onClick={() => setErrorDialog({ open: false, message: '' })} variant="contained" sx={{ bgcolor: gold, color: theme.palette.background.default, textTransform: 'none', fontWeight: 600, px: 4, '&:hover': { bgcolor: '#b38c45' } }}>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
}