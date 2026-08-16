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

// 💡 1. استيراد صفحة البروفايل (حسب مسار صورتك)
import FreelancerProfileView from '../JobOfferAplicants/FreelancerProfileView';

const JobApplicantsPage = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const gold = isDark ? '#c5a059' : '#b38c45';

    const groups = useSelector(selectContractsGroupedByJob);
    const loading = useSelector(selectContractsLoading);
    const error = useSelector(selectContractsError);
    const pagination = useSelector(selectContractsPagination);

    // 💡 2. سحب حالة الفريلانسر المحدد لمعرفة ما إذا كان الزر قد تم ضغطه
    const selectedFreelancer = useSelector((state) => state.jobManagement?.selectedFreelancer);

    useEffect(() => {
        dispatch(fetchContracts(1));
    }, [dispatch]);

    const handlePageChange = (_, page) => {
        dispatch(fetchContracts(page));
    };

    const totalHires = groups.reduce((sum, g) => sum + (g.contracts?.length || 0), 0);

    // 💡 3. الشرط السحري: إذا تم الضغط على زر البروفايل، نعرض صفحة البروفايل فقط!
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
                            lineHeight: 1,
                        }}
                    >
                        My Offers
                    </Typography>

                    {!loading && !error && groups.length > 0 && (
                        <Box sx={{
                            bgcolor: 'rgba(197, 160, 89, 0.1)',
                            border: `1px solid rgba(197, 160, 89, 0.3)`,
                            px: 1.5, py: 0.5,
                            borderRadius: 4,
                            ml: { sm: 1 }
                        }}>
                            <Typography sx={{ color: gold, fontSize: '0.75rem', fontWeight: 'bold' }}>
                                ✔️ {totalHires} Hired in {groups.length} {groups.length === 1 ? 'Job' : 'Jobs'}
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Typography
                    variant="body2"
                    sx={{
                        color: isDark ? '#9a8f80' : '#7A6F5E',
                        fontWeight: 300,
                        letterSpacing: '0.02em',
                        maxWidth: 700
                    }}
                >
                    A comprehensive overview of your hired elite candidates, organized by their respective job offers.
                </Typography>
            </Box>

            {loading && (
                <Stack sx={{ alignItems: 'center', py: 6 }}>
                    <CircularProgress sx={{ color: gold }} />
                </Stack>
            )}

            {!loading && error && (
                <Alert severity="error" sx={{ mb: 3, mt: 2 }}>
                    {error}
                </Alert>
            )}

            {!loading && !error && groups.length === 0 && (
                <Typography sx={{ color: isDark ? '#9a8f80' : '#7A6F5E', mt: 3, fontStyle: 'italic' }}>
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
                            '& .MuiPaginationItem-root': { color: gold },
                            '& .Mui-selected': { bgcolor: `${gold} !important`, color: '#140e0c' }
                        }}
                    />
                </Stack>
            )}
        </Box>
    );
};

export default JobApplicantsPage;