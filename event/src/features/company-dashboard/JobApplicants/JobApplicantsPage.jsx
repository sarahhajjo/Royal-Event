import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Stack, Typography, CircularProgress, Alert, Pagination } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
    fetchContracts,
    selectContractsGroupedByJob,
    selectContractsLoading,
    selectContractsError,
    selectContractsPagination,
} from './JobApplicantsSlice';
import JobSummaryHeader from './Components/Jobsummaryheader';
import EmployeeContractCard from './Components/Employeecontractcard';

// استيراد صفحة البروفايل
import FreelancerProfileView from '../JobOfferAplicants/FreelancerProfileView';

// 💡 استيراد اللون الثابت الجديد للعناوين
import { GOLD, BROWN_TEXT, MUTED_TEXT, TITLE_TEXT_LIGHT } from '../../../utils/colorConstants';

const JobApplicantsPage = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const groups = useSelector(selectContractsGroupedByJob);
    const loading = useSelector(selectContractsLoading);
    const error = useSelector(selectContractsError);
    const pagination = useSelector(selectContractsPagination);

    const selectedFreelancer = useSelector((state) => state.jobManagement?.selectedFreelancer);

    useEffect(() => {
        dispatch(fetchContracts(1));
    }, [dispatch]);

    const handlePageChange = (_, page) => {
        dispatch(fetchContracts(page));
    };

    const totalHires = groups.reduce((sum, g) => sum + (g.contracts?.length || 0), 0);

    if (selectedFreelancer) {
        return (
            <Box sx={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                <FreelancerProfileView />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', maxWidth: 1150, mx: 'auto', mt: 0.4 }}>
            {/* ── Page Header ── */}
            <Box sx={{ mb: 5, textAlign: 'left' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>


                    {/* 💡 هذا هو العنوان الذي تم تعديل خطه ولونه ليطابق الصورة المرجعية */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1, mb: 1 }}>
                        <Box
                            sx={{
                                width: 14,
                                height: 14,
                                // 💡 بني بالفاتح، وذهبي بالداكن
                                border: `2px solid ${isDark ? theme.palette.primary.main : BROWN_TEXT}`,
                                transform: 'rotate(45deg)',
                                boxShadow: `0 0 10px ${isDark ? theme.palette.primary.main + '40' : 'rgba(74, 59, 50, 0.2)'}`,
                                flexShrink: 0
                            }}
                        />

                        <Typography
                            variant="h3"
                            sx={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '2.5rem',
                                // 💡 بني بالفاتح، وذهبي بالداكن
                                color: isDark ? theme.palette.primary.main : BROWN_TEXT,
                                fontWeight: 50,
                                m: 0
                            }}
                        >
                            My Services
                        </Typography>
                    </Box>
                    {!loading && !error && groups.length > 0 && (
                        <Box sx={{
                            bgcolor: isDark ? 'rgba(197, 160, 89, 0.1)' : 'rgba(74, 59, 50, 0.08)',
                            border: isDark ? `1px solid rgba(197, 160, 89, 0.3)` : `1px solid rgba(74, 59, 50, 0.2)`,
                            px: 1.5, py: 0.5,
                            borderRadius: 4,
                            ml: { sm: 1 }
                        }}>
                            <Typography sx={{ color: isDark ? GOLD : TITLE_TEXT_LIGHT, fontSize: '0.75rem', fontWeight: 700 }}>
                                ✔️ {totalHires} Hired in {groups.length} {groups.length === 1 ? 'Job' : 'Jobs'}
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Typography
                    variant="body2"
                    sx={{
                        color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT,
                        fontWeight: 400,
                        letterSpacing: '0.02em',
                        maxWidth: 700
                    }}
                >
                    A comprehensive overview of your hired elite candidates, organized by their respective job offers.
                </Typography>
            </Box>

            {loading && (
                <Stack sx={{ alignItems: 'center', py: 6 }}>
                    <CircularProgress sx={{ color: GOLD }} />
                </Stack>
            )}

            {!loading && error && (
                <Alert severity="error" sx={{ mb: 3, mt: 2 }}>
                    {error}
                </Alert>
            )}

            {!loading && !error && groups.length === 0 && (
                <Typography sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, mt: 3, fontStyle: 'italic' }}>
                    No accepted applicants yet.
                </Typography>
            )}

            {!loading && !error && (
                <Stack spacing={4}>
                    {groups.map(({ job, contracts }) => (
                        <Box key={job?.id || contracts[0]?.id}>
                            <JobSummaryHeader job={job} count={contracts.length} />
                            <Stack spacing={0}>
                                {contracts.map((contract) => (
                                    <EmployeeContractCard key={contract.id} contract={contract} />
                                ))}
                            </Stack>
                        </Box>
                    ))}
                </Stack>
            )}

            {pagination.lastPage > 1 && (
                <Stack sx={{ alignItems: 'center', mt: 4 }}>
                    <Pagination
                        count={pagination.lastPage}
                        page={pagination.currentPage}
                        onChange={handlePageChange}
                        sx={{
                            '& .MuiPaginationItem-root': { color: isDark ? '#ffffff' : BROWN_TEXT },
                            '& .Mui-selected': { bgcolor: `${GOLD} !important`, color: '#131110' }
                        }}
                    />
                </Stack>
            )}
        </Box>
    );
};

export default JobApplicantsPage;