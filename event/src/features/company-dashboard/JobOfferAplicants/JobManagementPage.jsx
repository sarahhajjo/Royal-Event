import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { fetchJobsWithApplications } from './jobManagementSlice'; // تأكدي من المسار
import JobOfferCard from './components/JobOfferCard'; // تأكدي من المسار

export default function JobManagementPage() {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // استخراج اللون الذهبي بناءً على الثيم
    const gold = isDark ? '#c5a059' : '#b38c45';

    const { jobs, loading } = useSelector((state) => state.jobManagement);

    useEffect(() => {
        dispatch(fetchJobsWithApplications());
    }, [dispatch]);

    // 💡 التعديل 1: حساب عدد الوظائف الفعّالة (Active) فقط
    const activeJobsCount = jobs.filter(job => Boolean(job.is_active)).length;

    // تجميع الوظائف حسب اسم الخدمة (Group By Service)
    const groupedJobs = jobs.reduce((groups, job) => {
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
                <CircularProgress sx={{ color: gold }} />
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

                        <Box
                            component="svg"
                            viewBox="0 0 24 24"
                            sx={{
                                width: { xs: '28px', sm: '36px' },
                                height: { xs: '28px', sm: '36px' },
                                fill: 'none',
                                stroke: gold,
                                strokeWidth: 1.2,
                            }}
                        >
                            <path d="M12 2.5L21.5 12L12 21.5L2.5 12Z" />
                        </Box>

                        <Typography
                            sx={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: { xs: '2rem', sm: '2.5rem' },
                                fontWeight: 500,
                                color: gold,
                                lineHeight: 1.2,
                            }}
                        >
                            Job Management
                        </Typography>

                        <Box sx={{ bgcolor: 'rgba(197, 160, 89, 0.1)', border: `1px solid rgba(197, 160, 89, 0.3)`, px: 1.5, py: 0.5, borderRadius: 4, ml: { sm: 1 } }}>
                            {/* 💡 التعديل 2: عرض الرقم المصّفى بدلاً من jobs.length */}
                            <Typography sx={{ color: gold, fontSize: '0.75rem', fontWeight: 'bold' }}>
                                ⚡ {activeJobsCount} Active Offers
                            </Typography>
                        </Box>
                    </Box>

                    <Typography
                        variant="body2"
                        sx={{
                            color: isDark ? '#9a8f80' : '#7A6F5E',
                            fontWeight: 300,
                            letterSpacing: '0.02em',
                        }}
                    >
                        Review active listings, monitor applicants, and manage your elite staffing pipeline.
                    </Typography>
                </Box>

                {/* ── Render Grouped Jobs ── */}
                {Object.keys(groupedJobs).map((serviceName) => (
                    <Box key={serviceName} sx={{ mb: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', color: gold }}>
                                {serviceName}
                            </Typography>
                            <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(197, 160, 89, 0.2)' }} />
                        </Box>

                        {groupedJobs[serviceName].map(job => (
                            <JobOfferCard key={job.id} job={job} />
                        ))}
                    </Box>
                ))}

                {jobs.length === 0 && (
                    <Typography sx={{ color: isDark ? '#9a8f80' : '#7A6F5E', textAlign: 'center', mt: 5 }}>
                        You haven't posted any job offers yet.
                    </Typography>
                )}
            </Box>
        </Box>
    );
}