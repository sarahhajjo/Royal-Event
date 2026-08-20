import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { fetchJobsWithApplications } from './jobManagementSlice';
import JobOfferCard from './components/JobOfferCard';

// 💡 استيراد ثوابت الألوان
import { GOLD, BROWN_TEXT, MUTED_TEXT, TITLE_TEXT_LIGHT } from '../../../utils/colorConstants';

export default function JobManagementPage() {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const { jobs, loading } = useSelector((state) => state.jobManagement);

    // 💡 1. إضافة State للتحكم بالتبويب النشط (الافتراضي: قيد المراجعة)
    const [activeStatusTab, setActiveStatusTab] = useState('pending');

    useEffect(() => {
        dispatch(fetchJobsWithApplications());
    }, [dispatch]);

    const activeJobsCount = jobs.filter(job => Boolean(job.is_active) && job.moderation_status === 'approved').length;

    // 💡 2. فلترة الوظائف بناءً على التبويب المختار فقط
    const filteredJobs = jobs.filter(job => {
        const status = job.moderation_status || 'pending';
        return status === activeStatusTab;
    });

    // 💡 3. تجميع الوظائف المفلترة حسب اسم الخدمة (كما في كودك الأصلي)
    const groupedJobs = filteredJobs.reduce((groups, job) => {
        const serviceName = job.service?.name || 'General Offers';
        if (!groups[serviceName]) {
            groups[serviceName] = [];
        }
        groups[serviceName].push(job);
        return groups;
    }, {});

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress sx={{ color: isDark ? GOLD : BROWN_TEXT }} />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '70vh',
                backgroundColor: 'transparent',
                width: '100%',
                boxSizing: 'border-box',
                mt: '0.3%',
            }}
        >
            <Box sx={{ maxWidth: '1000px', width: '100%' }}>

                {/* ── Page Header ── */}
                <Box sx={{ mb: 4, textAlign: 'left' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1, mb: 1 }}>
                            <Box
                                sx={{
                                    width: 14,
                                    height: 14,
                                    border: `2px solid ${isDark ? GOLD : BROWN_TEXT}`,
                                    transform: 'rotate(45deg)',
                                    boxShadow: `0 0 10px ${isDark ? alpha(GOLD, 0.4) : 'rgba(74, 59, 50, 0.2)'}`,
                                    flexShrink: 0
                                }}
                            />
                            <Typography
                                variant="h3"
                                sx={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: '2.5rem',
                                    color: isDark ? GOLD : BROWN_TEXT,
                                    fontWeight: 50,
                                    m: 0
                                }}
                            >
                                Job Management
                            </Typography>
                        </Box>

                        {/* عداد الوظائف النشطة والمقبولة */}
                        <Box sx={{
                            bgcolor: isDark ? alpha('#2ecc71', 0.1) : alpha('#2ecc71', 0.08),
                            border: `1px solid ${alpha('#2ecc71', 0.3)}`,
                            px: 1.5, py: 0.5, borderRadius: 4, ml: { sm: 1 }
                        }}>
                            <Typography sx={{ color: isDark ? '#2ecc71' : '#27ae60', fontSize: '0.75rem', fontWeight: 700 }}>
                                ⚡ {activeJobsCount} Active & Approved
                            </Typography>
                        </Box>
                    </Box>

                    <Typography
                        variant="body2"
                        sx={{
                            color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT,
                            fontWeight: isDark ? 300 : 500,
                            letterSpacing: '0.02em',
                        }}
                    >
                        Review active listings, monitor applicants, and manage your elite staffing pipeline.
                    </Typography>
                </Box>

                {/* ── 💡 4. شريط التبويبات (Tabs) مطابق لتصميم My Catalog ── */}
                <Box sx={{
                    display: 'flex',
                    borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : `1px solid ${alpha(BROWN_TEXT, 0.2)}`,
                    mb: 5,
                    width: '100%'
                }}>
                    {[
                        { id: 'pending', label: 'Pending' },
                        { id: 'approved', label: 'Approved' },
                        { id: 'rejected', label: 'Rejected' }
                    ].map((tab) => {
                        const isActive = activeStatusTab === tab.id;
                        return (
                            <Box
                                key={tab.id}
                                onClick={() => setActiveStatusTab(tab.id)}
                                sx={{
                                    flex: 1,
                                    textAlign: 'center',
                                    py: 1.5,
                                    cursor: 'pointer',
                                    color: isActive ? (isDark ? GOLD : BROWN_TEXT) : (isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT),
                                    fontWeight: isActive ? 700 : 600,
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: '1.1rem',
                                    borderBottom: isActive ? `2px solid ${isDark ? GOLD : BROWN_TEXT}` : '2px solid transparent',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        color: isDark ? GOLD : BROWN_TEXT,
                                        backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
                                    }
                                }}
                            >
                                {tab.label}
                            </Box>
                        );
                    })}
                </Box>

                {/* ── 5. عرض الوظائف حسب التجميع للتبويب المختار ── */}
                {Object.keys(groupedJobs).map((serviceName) => (
                    <Box key={serviceName} sx={{ mb: 6, animation: 'fadeIn 0.4s ease' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: isDark ? GOLD : TITLE_TEXT_LIGHT, fontWeight: isDark ? 400 : 600 }}>
                                {serviceName}
                            </Typography>
                            <Box sx={{ flex: 1, height: '1px', bgcolor: isDark ? alpha(GOLD, 0.2) : alpha(BROWN_TEXT, 0.2) }} />
                        </Box>

                        {groupedJobs[serviceName].map(job => (
                            <Box key={job.id} sx={{ mb: 3 }}>
                                {/* إظهار سبب الرفض إن وجد في تبويب الـ Rejected */}
                                {activeStatusTab === 'rejected' && job.rejection_reason && (
                                    <Box sx={{
                                        bgcolor: alpha('#e74c3c', 0.1),
                                        color: '#e74c3c',
                                        px: 2, py: 1, mb: 1,
                                        borderRadius: '8px',
                                        fontSize: '12.5px',
                                        fontWeight: 600,
                                        border: `1px solid ${alpha('#e74c3c', 0.3)}`
                                    }}>
                                        ⚠️ <strong>Reason for rejection:</strong> {job.rejection_reason}
                                    </Box>
                                )}
                                <JobOfferCard job={job} />
                            </Box>
                        ))}
                    </Box>
                ))}

                {/* رسالة في حال كان التبويب فارغاً */}
                {filteredJobs.length === 0 && (
                    <Box sx={{ textAlign: 'center', mt: 8, animation: 'fadeIn 0.4s ease' }}>
                        <Typography sx={{ color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT, fontSize: '1.1rem', fontFamily: "'Playfair Display', serif" }}>
                            No {activeStatusTab} job offers found.
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
}