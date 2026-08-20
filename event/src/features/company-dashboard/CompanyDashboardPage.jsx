import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // 💡 استيراد أدوات التوجيه
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme, alpha } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import Snackbar from '@mui/material/Snackbar';

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
import MyCalendarPage from "./MyCalender/Mycalendardashboard.jsx";
import JobManagementPage from "./JobOfferAplicants/JobManagementPage.jsx";
import FreelancerProfileView from "./JobOfferAplicants/FreelancerProfileView.jsx";
import JobApplicantsPage from "./JobApplicants/JobApplicantsPage.jsx";
import CompanyProfileSettings from './componyProfileSettings/CompanyProfileSettings.jsx';
import RequestPage from './Request-components/RequestPage.jsx';

import dashboardBg from '../../assets/sidebar-bg.jpg';

import { requestForToken, onMessageListener } from '../../services/firebase.js';
import { addNotification, clearToast } from '../../notificationSlice.js';
import { Slide } from "@mui/material";

// 💡 استيراد الألوان الموحدة الخاصة بالنظام
import {
    GOLD, BROWN_TEXT, MUTED_TEXT,
    LIGHT_CARD, DARK_CARD_BACKGROUND,
    DARK_CARD_SHADOW
} from '../../utils/colorConstants.js';

// ─── 💡 1. خريطة الروابط (Routes Mapping) ───
const tabToPath = {
    'dashboard': '/company-dashboard',
    'profile': '/company-dashboard/profile',
    'add_product': '/company-dashboard/addition/product',
    'add_arrangement': '/company-dashboard/addition/arrangement',
    'add_hall': '/company-dashboard/addition/hall',
    'my_catalog': '/company-dashboard/catalog',
    'job_offers': '/company-dashboard/job-offers',
    'my_offers': '/company-dashboard/my-services',
    'job_applicants': '/company-dashboard/job-applicants',
    'request': '/company-dashboard/requests',
    'my_calendar': '/company-dashboard/calendar'
};

// إنشاء خريطة عكسية لقراءة التبويب من الرابط
const pathToTab = Object.keys(tabToPath).reduce((acc, key) => {
    acc[tabToPath[key]] = key;
    return acc;
}, {});

function CompanyDashboardPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState('dashboard');
    const [arrangementToEdit, setArrangementToEdit] = useState(null);
    const [selectedHallId,        setSelectedHallId]        = useState(null);
    const [selectedProductId,     setSelectedProductId]     = useState(null);
    const [selectedArrangementId, setSelectedArrangementId] = useState(null);
    const [highlightedBookingId, setHighlightedBookingId]   = useState(null);

    const [productToEdit, setProductToEdit] = useState(null);
    const [hallToEdit, setHallToEdit] = useState(null);

    const theme  = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const dispatch = useDispatch();
    const { latestToast } = useSelector((state) => state.notifications || {});
    const { selectedFreelancer } = useSelector((state) => state.jobManagement || {});

    // ─── 💡 2. مزامنة الـ URL مع التبويبات ───
    useEffect(() => {
        const currentPath = location.pathname.replace(/\/$/, "");

        // إذا كان الرابط هو بروفايل الفريلانسر، لا نغير التبويب النشط لكي يبقى التحديد في الـ Sidebar
        if (currentPath === '/company-dashboard/applicant-profile') return;

        const matchedTab = pathToTab[currentPath] || 'dashboard';
        setActiveTab(matchedTab);
    }, [location.pathname]);

    // ─── 💡 3. مراقبة الدخول لحساب الفريلانسر ───
    useEffect(() => {
        if (selectedFreelancer) {
            navigate('/company-dashboard/applicant-profile'); // الذهاب لبروفايل الفريلانسر
        } else {
            const currentPath = location.pathname.replace(/\/$/, "");
            // إذا تم إلغاء تحديد الفريلانسر (مثلاً ضغط زر رجوع)، نرجعه لمسار التبويب الحالي
            if (currentPath === '/company-dashboard/applicant-profile') {
                navigate(tabToPath[activeTab] || '/company-dashboard');
            }
        }
    }, [selectedFreelancer, navigate, activeTab]);

    useEffect(() => {
        requestForToken();
        const listenForMessages = async () => {
            try {
                const payload = await onMessageListener();
                dispatch(addNotification({
                    title: payload.notification?.title || 'إشعار جديد',
                    body: payload.notification?.body || '',
                    time: new Date().toISOString()
                }));
                listenForMessages();
            } catch (err) {
                console.log('Failed to listen for messages', err);
            }
        };
        listenForMessages();
    }, [dispatch]);

    const handleCloseToast = () => dispatch(clearToast());
    function SlideTransition({ children, ...props }) { return <Slide {...props} direction="left">{children}</Slide>; }

    const interactiveClickEffect = {
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 12px 20px ${alpha(GOLD, isDark ? 0.08 : 0.12)}` },
        '&:active': { transform: 'scale(0.96) translateY(0)', transition: 'all 0.05s ease' },
    };

    const isHallDetail        = activeTab === 'my_catalog' && selectedHallId        !== null;
    const isProductDetail     = activeTab === 'my_catalog' && selectedProductId     !== null;
    const isArrangementDetail = activeTab === 'my_catalog' && selectedArrangementId !== null;
    const isDetailMode        = isHallDetail || isProductDetail || isArrangementDetail;

    const handleTabChange = (tab) => {
        setHighlightedBookingId(null);

        if (tab !== 'my_catalog') {
            setSelectedHallId(null);
            setSelectedProductId(null);
            setSelectedArrangementId(null);
        }
        if (tab !== 'add_product') setProductToEdit(null);
        if (tab !== 'add_hall') setHallToEdit(null);
        if (tab !== 'add_arrangement') setArrangementToEdit(null);

        // 💡 4. تغيير مسار الرابط بدلاً من تغيير الـ State مباشرة
        const path = tabToPath[tab] || '/company-dashboard';
        navigate(path);
    };

    const handleViewRequest = (request) => {
        const listingId = request.listing?.id || request.listing_id;
        const listingType = request.listing?.listing_type;

        if (!listingId) return;

        setSelectedHallId(null);
        setSelectedProductId(null);
        setSelectedArrangementId(null);

        if (listingType === 'package') setSelectedArrangementId(listingId);
        else if (listingType === 'hall') setSelectedHallId(listingId);
        else if (listingType === 'physical_product') setSelectedProductId(listingId);

        setHighlightedBookingId(request.id);
        handleTabChange('my_catalog');
    };

    return (
        <Box sx={{
            width: '100vw', height: '100vh',
            backgroundColor: isDark ? '#0e1418' : '#fdfbf7',
            backgroundImage: isDark
                ? `linear-gradient(180deg, rgba(6, 10, 18, 0.5) 0%, rgba(6, 10, 18, 0.8) 100%), url(${dashboardBg})`
                : `linear-gradient(180deg, rgba(255, 252, 245, 0.5) 0%, rgba(230, 205, 150, 0.85) 100%), url(${dashboardBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            display: 'flex', overflow: 'hidden', boxSizing: 'border-box', transition: 'background-color 0.3s ease',
        }}>
            <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden', position: 'relative' }}>
                <TopNavbar onProfileClick={() => handleTabChange('profile')} />

                {isDetailMode ? (
                    <Box sx={{ flex: 1, overflow: 'auto', position: 'relative' }}>
                        <MyCatalogPage
                            externalHallId={selectedHallId}
                            externalProductId={selectedProductId}
                            externalArrangementId={selectedArrangementId}
                            externalHighlightedBookingId={highlightedBookingId}
                            onClearHall={()        => setSelectedHallId(null)}
                            onClearProduct={()     => setSelectedProductId(null)}
                            onClearArrangement={() => setSelectedArrangementId(null)}
                            onEditProduct={(product) => { setProductToEdit(product); handleTabChange('add_product'); }}
                            onEditHall={(hall) => { setHallToEdit(hall); handleTabChange('add_hall'); }}
                            onEditArrangement={(arr) => { setArrangementToEdit(arr); handleTabChange('add_arrangement'); }}
                        />
                    </Box>
                ) : (
                    <Box sx={{
                        flex: 1, p: 5, display: 'flex', flexDirection: 'column', gap: 3.5,
                        overflowY: 'auto', overflowX: 'hidden', width: '100%', boxSizing: 'border-box', minWidth: 0,
                        position: 'relative'
                    }}>
                        {activeTab === 'profile' && <Box className="animate-fade-in" sx={{ width: '100%', position: 'relative', zIndex: 1 }}><CompanyProfileSettings /></Box>}

                        {activeTab === 'dashboard' && (
                            <>
                                <Box className="animate-fade-in" sx={{ textAlign: 'left', position: 'relative', zIndex: 1 }}>
                                    <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: isDark ? GOLD : BROWN_TEXT, fontWeight: 50, m: 0 }}>
                                        Welcome back, <Box component="span" variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: isDark ? GOLD : BROWN_TEXT, fontWeight: 50, m: 0 }}>Executive Partner</Box>
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.76)' : MUTED_TEXT, fontSize: '14px', fontWeight: 500, maxWidth: '760px' }}>
                                        Elevating standard event coordination to a fine art. Your portfolio of exclusive reserves is performing at peak efficiency today.
                                    </Typography>
                                </Box>
                                <Box className="animate-fade-in" sx={{ animationDelay: '100ms', width: '100%', position: 'relative', zIndex: 1 }}><CompanyStatsCards /></Box>
                                <Box className="animate-fade-in" sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3.5, alignItems: 'stretch', animationDelay: '200ms', position: 'relative', zIndex: 1 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, flex: 1, minWidth: 0 }}>
                                        <Box sx={{ '& > div': interactiveClickEffect }}><PendingAdminApproval /></Box>
                                        <Box sx={{ '& > div, & .MuiListItemButton-root': interactiveClickEffect }}><TopPerformingServices /></Box>
                                    </Box>
                                    <Box sx={{ '& > div, & .MuiPaper-root': interactiveClickEffect }}><RecentActivityList /></Box>
                                </Box>
                            </>
                        )}

                        {activeTab === 'add_product' && <Box className="animate-fade-in" sx={{ width: '100%', position: 'relative', zIndex: 1 }}><AddProductPage editData={productToEdit} onBack={() => handleTabChange('my_catalog')} /></Box>}
                        {activeTab === 'add_arrangement' && <Box className="animate-fade-in" sx={{ width: '100%', p: 4, position: 'relative', zIndex: 1 }}><ArrangementPage editData={arrangementToEdit} onBack={() => handleTabChange('my_catalog')} /></Box>}
                        {activeTab === 'add_hall' && <Box className="animate-fade-in" sx={{ width: '100%', p: 4, position: 'relative', zIndex: 1 }}><PublishHallPage editData={hallToEdit} onBack={() => handleTabChange('my_catalog')} /></Box>}

                        {activeTab === 'my_catalog' && !isDetailMode && (
                            <Box className="animate-fade-in" sx={{ width: '100%', p: 4, position: 'relative', zIndex: 1 }}>
                                <MyCatalogPage
                                    onSelectHall={(id)        => setSelectedHallId(id)}
                                    onSelectProduct={(id)     => setSelectedProductId(id)}
                                    onSelectArrangement={(id) => setSelectedArrangementId(id)}
                                    onEditProduct={(product) => { setProductToEdit(product); handleTabChange('add_product'); }}
                                    onEditHall={(hall) => { setHallToEdit(hall); handleTabChange('add_hall'); }}
                                    onEditArrangement={(arr) => { setArrangementToEdit(arr); handleTabChange('add_arrangement'); }}
                                />
                            </Box>
                        )}

                        {activeTab === 'job_offers' && <Box className="animate-fade-in" sx={{ width: '100%', p: 4, position: 'relative', zIndex: 1 }}><CreateJobOfferPage /></Box>}
                        {activeTab === 'my_offers' && <Box className="animate-fade-in" sx={{ width: '100%', p: 0, position: 'relative', zIndex: 1 }}><JobApplicantsPage /></Box>}

                        {activeTab === 'job_applicants' && (
                            <Box className="animate-fade-in" sx={{ width: '100%', p: 0, position: 'relative', zIndex: 1 }}>
                                {selectedFreelancer ? <FreelancerProfileView /> : <JobManagementPage />}
                            </Box>
                        )}

                        {activeTab === 'request' && <Box className="animate-fade-in" sx={{ width: '100%', position: 'relative', zIndex: 1 }}><RequestPage onViewRequest={handleViewRequest} /></Box>}
                        {activeTab === 'my_calendar' && <Box className="animate-fade-in" sx={{ width: '100%', p: 0, position: 'relative', zIndex: 1 }}><MyCalendarPage /></Box>}
                    </Box>
                )}
            </Box>

            <Snackbar
                open={!!latestToast} autoHideDuration={6000} onClose={handleCloseToast}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }} TransitionComponent={SlideTransition}
                sx={{ top: { xs: 80, sm: 90 }, right: { xs: 20, sm: 30 } }}
            >
                <Box
                    sx={{
                        display: 'flex', alignItems: 'center', gap: 2.5,
                        background: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
                        backdropFilter: 'blur(16px)',
                        borderLeft: `4px solid ${GOLD}`,
                        borderRadius: '12px',
                        boxShadow: isDark ? DARK_CARD_SHADOW : `0 10px 40px ${alpha(GOLD, 0.15)}`,
                        p: 2.5, minWidth: '320px', maxWidth: '450px',
                        cursor: 'pointer', transition: 'transform 0.2s ease', '&:hover': { transform: 'translateY(-2px)' }
                    }}
                    onClick={handleCloseToast}
                >
                    <Box sx={{ backgroundColor: alpha(GOLD, 0.15), borderRadius: '50%', p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${alpha(GOLD, 0.3)}` }}>
                        <Typography sx={{ fontSize: '20px' }}>🛎️</Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 700, color: isDark ? '#ffffff' : BROWN_TEXT, mb: 0.5, fontFamily: "'Playfair Display', serif", fontSize: '1.1rem' }}>{latestToast?.title}</Typography>
                        <Typography sx={{ color: isDark ? 'rgba(255,255,255,0.7)' : MUTED_TEXT, fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', lineHeight: 1.5, fontWeight: 400 }}>{latestToast?.body}</Typography>
                    </Box>
                </Box>
            </Snackbar>
        </Box>
    );
}

export default CompanyDashboardPage;