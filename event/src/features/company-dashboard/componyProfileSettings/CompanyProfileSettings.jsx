import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Button, Avatar,
    IconButton, TextField, MenuItem, Stack, Divider, CircularProgress,
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

import { useSelector, useDispatch } from 'react-redux';
import { fetchProviderProfile } from './providerProfileSlice';
import dayjs from 'dayjs';

export default function CompanyProfileSettings() {
    const theme  = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const dispatch = useDispatch();

    const { profile, loading } = useSelector((state) => state.providerProfile || {});

    useEffect(() => {
        dispatch(fetchProviderProfile());
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
            '& fieldset':           { borderColor: border },
            '&:hover fieldset':     { borderColor: gold   },
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

    const CardHeader = ({ icon: Icon, title }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Icon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
            <Typography sx={{
                fontSize:   '0.95rem',
                fontWeight: 600,
                color:      theme.palette.text.primary,
            }}>
                {title}
            </Typography>
        </Box>
    );

    if (loading || !profile) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress color="primary" />
            </Box>
        );
    }

    const { data } = profile;
    const user = data?.user || {};

    const fullName = user.full_name || 'N/A';
    const initial = fullName.charAt(0).toUpperCase();
    const email = user.email || 'N/A';
    const phone = user.phone || 'N/A';
    const isVerified = data?.is_verified;
    const createdAt = data?.created_at ? dayjs(data.created_at).format('MMM DD, YYYY') : 'N/A';

    const brandName = data?.brand_name || '';
    const moderationStatus = data?.moderation_status || '';
    const providerType = data?.provider_type || '';
    const isPhoneVerified = user.is_phone_verified;
    const isEmailVerified = user.is_email_verified;


    return (
        <Box sx={{ width: '100%', maxWidth: 1100, mx: 'auto', p: { xs: 2, md: 3 } }}>

            <Box sx={{
                display:        'flex',
                justifyContent: 'space-between',
                alignItems:     'flex-start',
                mb:             4,
                flexWrap:       'wrap',
                gap:            2,
            }}>
                <Box>
                    <Typography sx={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize:   '2rem',
                        fontWeight: 400,
                        color:      gold,
                        mb:         0.5,
                    }}>
                        Company Profile
                    </Typography>
                    <Typography sx={{
                        fontSize:   '0.82rem',
                        color:      theme.palette.text.secondary,
                        fontWeight: 300,
                        lineHeight: 1.6,
                        maxWidth:   480,
                    }}>
                        Manage your elite credentials and organizational identity within the Aurelian Reserve ecosystem.
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<SaveOutlinedIcon />}
                    sx={{
                        borderColor:   gold,
                        color:         gold,
                        fontWeight:    600,
                        textTransform: 'none',
                        fontSize:      '0.82rem',
                        px:            2.5,
                        py:            1,
                        borderRadius:  2,
                        letterSpacing: '0.05em',
                        '&:hover': {
                            backgroundColor: isDark ? 'rgba(197,160,89,0.08)' : 'rgba(197,160,89,0.06)',
                            borderColor:     gold,
                        },
                    }}
                >
                    Publish Changes
                </Button>
            </Box>

            <Box sx={{
                display:   'flex',
                gap:       2.5,
                alignItems: 'flex-start',
                flexDirection: { xs: 'column', md: 'row' },
                width:     '100%',
            }}>

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
                                <Typography sx={{ fontSize: '0.62rem', color: gold, fontWeight: 700, cursor: 'pointer' }}>+ ADD NEW SERVICE</Typography>
                            </Box>
                            <Box component="ul" sx={{ m: 0, pl: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {['High-End Event Curation', 'Private Concierge Logistics', 'Strategic Event Branding', 'Luxury Resource Management'].map((s) => (
                                    <Typography component="li" key={s} sx={{ fontSize: '0.83rem', fontWeight: 500, color: theme.palette.text.primary }}>{s}</Typography>
                                ))}
                            </Box>
                        </Paper>
                    </Stack>
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack spacing={2.5}>
                        <Paper elevation={0} sx={card}>
                            <CardHeader icon={BusinessCenterOutlinedIcon} title="Company Credentials" />
                            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <Box sx={{ flex: 1 }}><FieldLabel>Official Company Name</FieldLabel><TextField fullWidth size="small" value={brandName} disabled sx={inp} /></Box>
                                <Box sx={{ flex: 1 }}><FieldLabel>Tax Identification Number</FieldLabel><TextField fullWidth size="small" defaultValue="" disabled sx={inp} /></Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <Box sx={{ flex: 1 }}><FieldLabel>Commercial Registration</FieldLabel><TextField fullWidth size="small" defaultValue="" disabled sx={inp} /></Box>
                                <Box sx={{ flex: 1 }}><FieldLabel>District</FieldLabel><TextField fullWidth size="small" defaultValue="" disabled sx={inp} /></Box>
                            </Box>
                            <Box><FieldLabel>Industry Category</FieldLabel><TextField fullWidth size="small" defaultValue="" disabled sx={inp} /></Box>
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

                        <Paper elevation={0} sx={card}>
                            <CardHeader icon={ArticleOutlinedIcon} title="Platform Presentation" />
                            <FieldLabel>Company Description</FieldLabel>
                            <TextField fullWidth multiline rows={5} defaultValue="" disabled sx={{ ...inp, '& .MuiInputBase-input': { padding: '12px 14px' } }} />
                        </Paper>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
}