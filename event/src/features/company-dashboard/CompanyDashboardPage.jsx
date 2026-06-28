import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import Sidebar from './dashboard-components/Sidebar';
import TopNavbar from './dashboard-components/TopNavbar';
import CompanyStatsCards from './dashboard-components/CompanyStatsCards';
import PendingAdminApproval from './dashboard-components/PendingAdminApproval';
import RecentActivityList from './dashboard-components/RecentActivityList';
import TopPerformingServices from './dashboard-components/TopPerformingServices';
import AddProductPage from './add-components/AddProductPage.jsx';
import PublishHallPage from "./add-components/PublishHallPage.jsx";
import ArrangementPage from "./add-components/ArrangementPage.jsx";
import MyCatalogPage from "./MyCatalog-components/MyCatalogPage.jsx";
import CreateJobOfferPage from "./JobOffers-components/CreateJobOfferPage.jsx";
import CompanyProfileSettings from './componyProfileSettings/CompanyProfileSettings.jsx';

function CompanyDashboardPage() {
    const [activeTab, setActiveTab] = useState('dashboard');

    // ── Detail IDs ────────────────────────────────────────────────────────────
    const [selectedHallId,        setSelectedHallId]        = useState(null);
    const [selectedProductId,     setSelectedProductId]     = useState(null);
    const [selectedArrangementId, setSelectedArrangementId] = useState(null); // ✅ جديد

    const theme  = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const interactiveClickEffect = {
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: isDark
                ? '0 12px 20px rgba(197, 160, 89, 0.08)'
                : '0 12px 20px rgba(179, 140, 69, 0.12)',
        },
        '&:active': {
            transform: 'scale(0.96) translateY(0)',
            transition: 'all 0.05s ease',
        },
    };

    // ── Detail mode flags ─────────────────────────────────────────────────────
    const isHallDetail        = activeTab === 'my_catalog' && selectedHallId        !== null;
    const isProductDetail     = activeTab === 'my_catalog' && selectedProductId     !== null;
    const isArrangementDetail = activeTab === 'my_catalog' && selectedArrangementId !== null; // ✅
    const isDetailMode        = isHallDetail || isProductDetail || isArrangementDetail;       // ✅

    // ── Tab change: clear all IDs ─────────────────────────────────────────────
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab !== 'my_catalog') {
            setSelectedHallId(null);
            setSelectedProductId(null);
            setSelectedArrangementId(null); // ✅
        }
    };

    return (
        <Box sx={{
            width: '100vw',
            height: '100vh',
            backgroundColor: isDark ? '#140e0c' : '#FAF0D5',
            display: 'flex',
            overflow: 'hidden',
            boxSizing: 'border-box',
            transition: 'background-color 0.3s ease',
        }}>
            <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
                <TopNavbar onProfileClick={() => handleTabChange('profile')} />

                {/* ── Detail Mode: full-bleed بدون padding ── */}
                {isDetailMode ? (
                    <Box sx={{ flex: 1, overflow: 'auto', position: 'relative' }}>
                        <MyCatalogPage
                            externalHallId={selectedHallId}
                            externalProductId={selectedProductId}
                            externalArrangementId={selectedArrangementId}
                            onClearHall={()        => setSelectedHallId(null)}
                            onClearProduct={()     => setSelectedProductId(null)}
                            onClearArrangement={() => setSelectedArrangementId(null)}
                        />
                    </Box>
                ) : (
                    <Box sx={{
                        flex: 1,
                        p: 5,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3.5,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        width: '100%',
                        boxSizing: 'border-box',
                        minWidth: 0,
                    }}>

                        {activeTab === 'profile' && (
                            <Box className="animate-fade-in" sx={{ width: '100%' }}>
                                <CompanyProfileSettings />
                            </Box>
                        )}

                        {activeTab === 'dashboard' && (
                            <>
                                <Box className="animate-fade-in" sx={{ textAlign: 'left' }}>
                                    <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontSize: '2.4rem', color: isDark ? '#ffffff' : '#2B211E', mb: 1 }}>
                                        Welcome back,{' '}
                                        <Box component="span" sx={{ color: isDark ? '#c5a059' : '#b38c45', fontWeight: 300 }}>
                                            Executive Partner
                                        </Box>
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: isDark ? '#9a8f80' : '#7A6F5E', fontSize: '14px', fontWeight: 300 }}>
                                        Elevating standard event coordination to a fine art. Your portfolio of exclusive reserves is performing at peak efficiency today.
                                    </Typography>
                                </Box>
                                <Box className="animate-fade-in" sx={{ animationDelay: '100ms', width: '100%' }}>
                                    <CompanyStatsCards />
                                </Box>
                                <Box className="animate-fade-in" sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3.5, alignItems: 'stretch', animationDelay: '200ms' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, flex: 1 }}>
                                        <Box sx={{ '& > div': interactiveClickEffect }}><PendingAdminApproval /></Box>
                                        <Box sx={{ '& > div, & .MuiListItemButton-root': interactiveClickEffect }}><TopPerformingServices /></Box>
                                    </Box>
                                    <Box sx={{ '& > div, & .MuiPaper-root': interactiveClickEffect }}><RecentActivityList /></Box>
                                </Box>
                            </>
                        )}

                        {activeTab === 'add_product'     && <Box className="animate-fade-in" sx={{ width: '100%' }}><AddProductPage /></Box>}
                        {activeTab === 'add_arrangement' && <Typography className="animate-fade-in" sx={{ width: '100%', p: 4 }}><ArrangementPage /></Typography>}
                        {activeTab === 'add_hall'        && <Box className="animate-fade-in" sx={{ width: '100%', p: 4 }}><PublishHallPage /></Box>}

                        {activeTab === 'my_catalog' && !isDetailMode && (
                            <Box className="animate-fade-in" sx={{ width: '100%', p: 4 }}>
                                <MyCatalogPage
                                    onSelectHall={(id)        => setSelectedHallId(id)}
                                    onSelectProduct={(id)     => setSelectedProductId(id)}
                                    onSelectArrangement={(id) => setSelectedArrangementId(id)}
                                />
                            </Box>
                        )}

                        {activeTab === 'job_offers' && <Box className="animate-fade-in" sx={{ width: '100%', p: 4 }}><CreateJobOfferPage /></Box>}

                        {['request', 'request_status', 'my_offers', 'job_applicants'].includes(activeTab) && (
                            <Typography className="animate-fade-in" sx={{ color: isDark ? '#ffffff' : '#2B211E', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Playfair Display', serif", fontSize: '1.8rem' }}>
                                {activeTab.replace('_', ' ')} Content
                            </Typography>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default CompanyDashboardPage;