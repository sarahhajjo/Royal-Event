import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Sidebar from './dashboard-components/Sidebar';
import TopNavbar from './dashboard-components/TopNavbar';
import CompanyStatsCards from './dashboard-components/CompanyStatsCards';
import PendingAdminApproval from './dashboard-components/PendingAdminApproval';
import RecentActivityList from './dashboard-components/RecentActivityList';
import TopPerformingServices from './dashboard-components/TopPerformingServices';

// 🚀 استيراد صفحة إضافة منتج مباشرةً هنا
import AddProductPage from './AddProductPage';

function CompanyDashboardPage() {
    // المحتوى الافتراضي لتبويبات النظام الملكي هو 'dashboard'
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <Box sx={{
            width: '100vw',
            height: '100vh',
            backgroundColor: '#140e0c',
            display: 'flex',
            overflow: 'hidden',
            boxSizing: 'border-box'
        }}>
            {/* السايدبار المنسدل الفاخر */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* الجناح الأيمن (النافبار + منطقة المحتوى المتغير) */}
            <Box sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                overflow: 'hidden'
            }}>
                <TopNavbar />

                {/* 🛑 منطقة المحتوى التفاعلي المحمية بالكامل من التمدد خارج حدود المتصفح 🛑 */}
                <Box sx={{
                    flex: 1,
                    p: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3.5,
                    overflowY: 'auto', // سكرول عمودي للصفحة بأكملها عند الطول
                    overflowX: 'hidden', // منع السكرول الأفقي المزعج للمتصفح
                    width: '100%',
                    boxSizing: 'border-box',
                    minWidth: 0 // كسر جمود الـ Flex Container لترويض أبعاد الصفحات الداخلية
                }}>

                    {/* 🔄 التنقل التفاعلي الذكي بين الأقسام */}
                    {activeTab === 'dashboard' && (
                        <>
                            <Box sx={{ textTransform: 'left', textAlign: 'left' }}>
                                <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontSize: '2.4rem', color: '#ffffff', mb: 1 }}>
                                    Welcome back, <Box component="span" sx={{ color: '#c5a059', fontWeight: 300 }}>Executive Partner</Box>
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#9a8f80', fontSize: '14px', fontWeight: 300 }}>
                                    Elevating standard event coordination to a fine art. Your portfolio of exclusive reserves is performing at peak efficiency today.
                                </Typography>
                            </Box>
                            <CompanyStatsCards />
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3.5, alignItems: 'stretch' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, flex: 1 }}>
                                    <PendingAdminApproval />
                                    <TopPerformingServices />
                                </Box>
                                <RecentActivityList />
                            </Box>
                        </>
                    )}

                    {/* 👑 عرض صفحة إضافة منتج مباشرة عند كبس زر الـ product الفرعي في السايدبار */}
                    {activeTab === 'add_product' && (
                        <AddProductPage />
                    )}

                    {/* واجهات الأقسام الفرعية المستقبلية قيد التطوير */}
                    {activeTab === 'add_arrangement' && (
                        <Typography sx={{ color: '#ffffff', textAlign: 'left' }}>Ready Arrangement Setup Page (قيد التطوير)</Typography>
                    )}

                    {activeTab === 'add_hall' && (
                        <Typography sx={{ color: '#ffffff', textAlign: 'left' }}>Hall for Rent Setup Page (قيد التطوير)</Typography>
                    )}

                    {/* بقية الأقسام والتبويبات الرئيسية للوحة التحكم */}
                    {['request_status', 'my_offers', 'job_offers', 'job_applicants'].includes(activeTab) && (
                        <Typography sx={{ color: '#ffffff', textAlign: 'left' }}>
                            {activeTab.replace('_', ' ').toUpperCase()} Content
                        </Typography>
                    )}

                </Box>
            </Box>
        </Box>
    );
}

export default CompanyDashboardPage;