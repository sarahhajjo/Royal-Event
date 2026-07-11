import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

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

// 💡 استيراد دوال الفايربيز والـ Redux الخاصة بالإشعارات
import { requestForToken, onMessageListener } from '../../services/firebase.js';
import { addNotification, clearToast } from '../../notificationSlice.js';
import {Slide} from "@mui/material";

function CompanyDashboardPage() {
    const [activeTab, setActiveTab] = useState('dashboard');

    // ── Detail IDs ────────────────────────────────────────────────────────────
    const [selectedHallId,        setSelectedHallId]        = useState(null);
    const [selectedProductId,     setSelectedProductId]     = useState(null);
    const [selectedArrangementId, setSelectedArrangementId] = useState(null);

    const theme  = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // 💡 إعدادات الـ Redux للإشعارات
    const dispatch = useDispatch();
    const { latestToast } = useSelector((state) => state.notifications || {});

    // 💡 تفعيل الاستماع للإشعارات اللحظية
    useEffect(() => {
        // 1. طلب التوكن (سيطلب صلاحية المتصفح ويطبع التوكن في الكونسول لربطه مع الباك إند)
        requestForToken();

        // 2. الاستماع للإشعارات الواردة في المقدمة
        const listenForMessages = async () => {
            try {
                const payload = await onMessageListener();
                console.log('Received foreground message: ', payload);

                // إضافة الإشعار للـ Redux لتحديث العداد وإظهار الـ Snackbar
                dispatch(addNotification({
                    title: payload.notification?.title || 'إشعار جديد',
                    body: payload.notification?.body || '',
                    time: new Date().toISOString()
                }));

                // إعادة الاستماع للإشعار التالي
                listenForMessages();
            } catch (err) {
                console.log('Failed to listen for messages', err);
            }
        };

        listenForMessages();
    }, [dispatch]);

    const handleCloseToast = () => {
        dispatch(clearToast());
    };
    function SlideTransition({ children, ...props }) {
        return (
            <Slide {...props} direction="left">
                {children}
            </Slide>
        );
    }
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
    const isArrangementDetail = activeTab === 'my_catalog' && selectedArrangementId !== null;
    const isDetailMode        = isHallDetail || isProductDetail || isArrangementDetail;

    // ── Tab change: clear all IDs ─────────────────────────────────────────────
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab !== 'my_catalog') {
            setSelectedHallId(null);
            setSelectedProductId(null);
            setSelectedArrangementId(null);
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
                        flex: 1, p: 5, display: 'flex', flexDirection: 'column', gap: 3.5,
                        overflowY: 'auto', overflowX: 'hidden', width: '100%', boxSizing: 'border-box', minWidth: 0,
                    }}>
                        {activeTab === 'profile' && (
                            <Box className="animate-fade-in" sx={{ width: '100%' }}><CompanyProfileSettings /></Box>
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

            {/* 💡 المربع الثابت (Toast) للإشعارات اللحظية */}
            <Snackbar
                open={!!latestToast}
                autoHideDuration={6000}
                onClose={handleCloseToast}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                TransitionComponent={SlideTransition}
                sx={{ top: { xs: 80, sm: 90 }, right: { xs: 20, sm: 30 } }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2.5,
                        background: isDark
                            ? 'linear-gradient(145deg, #1c1512 0%, #2a201b 100%)'
                            : 'linear-gradient(145deg, #ffffff 0%, #fdfbf7 100%)',
                        borderLeft: isDark ? '4px solid #c5a059' : '4px solid #b38c45',
                        borderRadius: '12px',
                        boxShadow: isDark
                            ? '0 10px 40px rgba(0,0,0,0.6)'
                            : '0 10px 40px rgba(179,140,69,0.15)',
                        p: 2.5,
                        minWidth: '320px',
                        maxWidth: '450px',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease',
                        '&:hover': { transform: 'translateY(-2px)' }
                    }}
                    onClick={handleCloseToast}
                >
                    <Box sx={{
                        backgroundColor: isDark ? 'rgba(197, 160, 89, 0.15)' : 'rgba(179, 140, 69, 0.15)',
                        borderRadius: '50%',
                        p: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: isDark ? '1px solid rgba(197, 160, 89, 0.3)' : '1px solid rgba(179, 140, 69, 0.3)'
                    }}>
                        {/* يمكنك استيراد أيقونة مخصصة هنا، استخدمنا شعار إشعار قياسي للتوضيح */}
                        <Typography sx={{ fontSize: '20px' }}>🛎️</Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{
                            fontWeight: 700,
                            color: isDark ? '#ffffff' : '#2B211E',
                            mb: 0.5,
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '1.1rem'
                        }}>
                            {latestToast?.title}
                        </Typography>
                        <Typography sx={{
                            color: isDark ? '#9a8f80' : '#7A6F5E',
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.85rem',
                            lineHeight: 1.5,
                            fontWeight: 400
                        }}>
                            {latestToast?.body}
                        </Typography>
                    </Box>
                </Box>
            </Snackbar>
        </Box>
    );
}

export default CompanyDashboardPage;