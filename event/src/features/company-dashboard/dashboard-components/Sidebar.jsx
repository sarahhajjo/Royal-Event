import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse'; // 🚀 مكوّن الاندفاع والنزول السلس من MUI

// الأيقونات المطلوبة
import GridViewIcon from '@mui/icons-material/GridView';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import GroupIcon from '@mui/icons-material/Group';
import HelpOutlineIcon from "@mui/icons-material/HelpOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

// أيقونات الأقسام الفرعية الجديدة من صورتكِ
import InventoryIcon from '@mui/icons-material/Inventory';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';

function Sidebar({ activeTab, setActiveTab }) {
    // 💡 حالة التحكم بفتح وإغلاق منسدلة الـ Addition
    const [isAdditionOpen, setIsAdditionOpen] = useState(false);

    const handleAdditionClick = () => {
        setIsAdditionOpen(!isAdditionOpen);
    };

    return (
        <Box sx={{ width: '260px', height: '100vh', backgroundColor: '#140e0c', borderRight: '1px solid rgba(78, 70, 57, 0.2)', display: 'flex', flexDirection: 'column', p: 3 }}>

            {/* Logo Section */}
            <Box sx={{ mb: 5, textAlign: 'left' }}>
                <Typography sx={{ color: '#c5a059', fontSize: '20px', fontWeight: 600, fontFamily: "'Playfair Display', serif", letterSpacing: '0.05em' }}>
                    Elite Events
                </Typography>
                <Typography sx={{ color: '#5a5043', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Premium Concierge
                </Typography>
            </Box>

            {/* Main Menu */}
            <List sx={{ flexGrow: 1, p: 0, textAlign: 'left' }}>

                {/* 1️⃣ زر الـ Dashboard الرئيسي */}
                <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                        onClick={() => setActiveTab('dashboard')}
                        sx={{
                            borderRadius: '8px',
                            backgroundColor: activeTab === 'dashboard' ? 'rgba(197, 160, 89, 0.1)' : 'transparent',
                            '&:hover': { backgroundColor: 'rgba(197, 160, 89, 0.05)' }
                        }}
                    >
                        <ListItemIcon sx={{ color: activeTab === 'dashboard' ? '#c5a059' : '#5a5043', minWidth: '40px' }}><GridViewIcon /></ListItemIcon>
                        <ListItemText primary="Dashboard" slotProps={{ primary: { sx: { color: activeTab === 'dashboard' ? '#eee0da' : '#9a8f80', fontSize: '14px' } }}} />
                    </ListItemButton>
                </ListItem>

                {/* 2️⃣ زر الـ Addition الرئيسي (الأب الحاضن للمنسدلة) */}
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                        onClick={handleAdditionClick}
                        sx={{
                            borderRadius: '8px',
                            backgroundColor: ['add_product', 'add_arrangement', 'add_hall'].includes(activeTab) ? 'rgba(197, 160, 89, 0.04)' : 'transparent',
                            '&:hover': { backgroundColor: 'rgba(197, 160, 89, 0.05)' }
                        }}
                    >
                        <ListItemIcon sx={{ color: '#5a5043', minWidth: '40px' }}><AddBoxIcon /></ListItemIcon>
                        <ListItemText primary="Addition" slotProps={{ primary: { sx: { color: '#9a8f80', fontSize: '14px' } }}} />
                        {isAdditionOpen ? <ExpandLess sx={{ color: '#5a5043', fontSize: '18px' }} /> : <ExpandMore sx={{ color: '#5a5043', fontSize: '18px' }} />}
                    </ListItemButton>
                </ListItem>

                {/* 🛑 القائمة المنسدلة الفرعية للأقسام الثلاثة 🛑 */}
                <Collapse in={isAdditionOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ pl: 2, mb: 1 }}>

                        {/* أ) إضافة منتج */}
                        <ListItemButton
                            onClick={() => setActiveTab('add_product')}
                            sx={{
                                borderRadius: '6px',
                                mb: 0.5,
                                backgroundColor: activeTab === 'add_product' ? 'rgba(197, 160, 89, 0.1)' : 'transparent',
                                '&:hover': { backgroundColor: 'rgba(197, 160, 89, 0.05)' }
                            }}
                        >
                            <ListItemIcon sx={{ color: activeTab === 'add_product' ? '#c5a059' : '#5a5043', minWidth: '35px' }}><InventoryIcon sx={{ fontSize: '18px' }} /></ListItemIcon>
                            <ListItemText primary="Product" slotProps={{ primary: { sx: { color: activeTab === 'add_product' ? '#eee0da' : '#9a8f80', fontSize: '13px' } }}} />
                        </ListItemButton>

                        {/* ب) إضافة تنسيق جاهز */}
                        <ListItemButton
                            onClick={() => setActiveTab('add_arrangement')}
                            sx={{
                                borderRadius: '6px',
                                mb: 0.5,
                                backgroundColor: activeTab === 'add_arrangement' ? 'rgba(197, 160, 89, 0.1)' : 'transparent',
                                '&:hover': { backgroundColor: 'rgba(197, 160, 89, 0.05)' }
                            }}
                        >
                            <ListItemIcon sx={{ color: activeTab === 'add_arrangement' ? '#c5a059' : '#5a5043', minWidth: '35px' }}><AutoAwesomeIcon sx={{ fontSize: '18px' }} /></ListItemIcon>
                            <ListItemText primary="Ready Arrangement" slotProps={{ primary: { sx: { color: activeTab === 'add_arrangement' ? '#eee0da' : '#9a8f80', fontSize: '13px' } }}} />
                        </ListItemButton>

                        {/* جـ) إضافة صالة للايجار */}
                        <ListItemButton
                            onClick={() => setActiveTab('add_hall')}
                            sx={{
                                borderRadius: '6px',
                                backgroundColor: activeTab === 'add_hall' ? 'rgba(197, 160, 89, 0.1)' : 'transparent',
                                '&:hover': { backgroundColor: 'rgba(197, 160, 89, 0.05)' }
                            }}
                        >
                            <ListItemIcon sx={{ color: activeTab === 'add_hall' ? '#c5a059' : '#5a5043', minWidth: '35px' }}><CorporateFareIcon sx={{ fontSize: '18px' }} /></ListItemIcon>
                            <ListItemText primary="Hall for Rent" slotProps={{ primary: { sx: { color: activeTab === 'add_hall' ? '#eee0da' : '#9a8f80', fontSize: '13px' } }}} />
                        </ListItemButton>

                    </List>
                </Collapse>

                {/* 3️⃣ بقية الأزرار الرئيسية لـ لوحة التحكم */}
                <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemButton onClick={() => setActiveTab('request_status')} sx={{ borderRadius: '8px', backgroundColor: activeTab === 'request_status' ? 'rgba(197, 160, 89, 0.1)' : 'transparent' }}>
                        <ListItemIcon sx={{ color: activeTab === 'request_status' ? '#c5a059' : '#5a5043', minWidth: '40px' }}><AutorenewIcon /></ListItemIcon>
                        <ListItemText primary="Request Status" slotProps={{ primary: { sx: { color: activeTab === 'request_status' ? '#eee0da' : '#9a8f80', fontSize: '14px' } }}} />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemButton onClick={() => setActiveTab('my_offers')} sx={{ borderRadius: '8px', backgroundColor: activeTab === 'my_offers' ? 'rgba(197, 160, 89, 0.1)' : 'transparent' }}>
                        <ListItemIcon sx={{ color: activeTab === 'my_offers' ? '#c5a059' : '#5a5043', minWidth: '40px' }}><LocalOfferIcon /></ListItemIcon>
                        <ListItemText primary="My Offers" slotProps={{ primary: { sx: { color: activeTab === 'my_offers' ? '#eee0da' : '#9a8f80', fontSize: '14px' } }}} />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemButton onClick={() => setActiveTab('job_offers')} sx={{ borderRadius: '8px', backgroundColor: activeTab === 'job_offers' ? 'rgba(197, 160, 89, 0.1)' : 'transparent' }}>
                        <ListItemIcon sx={{ color: activeTab === 'job_offers' ? '#c5a059' : '#5a5043', minWidth: '40px' }}><BusinessCenterIcon /></ListItemIcon>
                        <ListItemText primary="Job Offers" slotProps={{ primary: { sx: { color: activeTab === 'job_offers' ? '#eee0da' : '#9a8f80', fontSize: '14px' } }}} />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemButton onClick={() => setActiveTab('job_applicants')} sx={{ borderRadius: '8px', backgroundColor: activeTab === 'job_applicants' ? 'rgba(197, 160, 89, 0.1)' : 'transparent' }}>
                        <ListItemIcon sx={{ color: activeTab === 'job_applicants' ? '#c5a059' : '#5a5043', minWidth: '40px' }}><GroupIcon /></ListItemIcon>
                        <ListItemText primary="Job Applicants" slotProps={{ primary: { sx: { color: activeTab === 'job_applicants' ? '#eee0da' : '#9a8f80', fontSize: '14px' } }}} />
                    </ListItemButton>
                </ListItem>

            </List>

            {/* Bottom Section */}
            <Box sx={{ borderTop: '1px solid rgba(78, 70, 57, 0.1)', pt: 2, textAlign: 'left' }}>
                <List sx={{ p: 0 }}>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemButton sx={{ borderRadius: '8px' }}>
                            <ListItemIcon sx={{ color: '#5a5043', minWidth: '40px' }}><HelpOutlineIcon /></ListItemIcon>
                            <ListItemText primary="Help" slotProps={{ primary: { sx: { color: '#9a8f80', fontSize: '14px' } }}} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton sx={{ borderRadius: '8px' }}>
                            <ListItemIcon sx={{ color: '#5a5043', minWidth: '40px' }}><LogoutIcon /></ListItemIcon>
                            <ListItemText primary="Logout" slotProps={{ primary: { sx: { color: '#9a8f80', fontSize: '14px' } }}} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Box>
    );
}

export default Sidebar;