import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import { useTheme } from '@mui/material/styles';

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
import ViewListIcon from '@mui/icons-material/ViewList';
import InventoryIcon from '@mui/icons-material/Inventory';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';

// 💡 1. استيراد أيقونات قسم البروفايل
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import {useNavigate} from "react-router-dom";

function Sidebar({ activeTab, setActiveTab }) {
    const [isAdditionOpen, setIsAdditionOpen] = useState(false);
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const navigate = useNavigate();

    const handleAdditionClick = () => {
        setIsAdditionOpen(!isAdditionOpen);
    };

    const getButtonStyle = (tabKey) => {
        const isActive = activeTab === tabKey;
        return {
            borderRadius: '8px',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            backgroundColor: isActive ? (isDark ? 'rgba(197, 160, 89, 0.1)' : 'rgba(179, 140, 69, 0.15)') : 'transparent',

            '&:hover': {
                backgroundColor: isActive ? (isDark ? 'rgba(197, 160, 89, 0.12)' : 'rgba(197, 160, 89, 0.2)') : (isDark ? 'rgba(197, 160, 89, 0.05)' : 'rgba(179, 140, 69, 0.06)'),
                transform: 'translateX(4px)'
            },
            '&:active': {
                transform: 'scale(0.96) translateX(2px)',
                transition: 'all 0.05s ease'
            }
        };
    };

    const getIconColor = (tabKey) => activeTab === tabKey ? (isDark ? '#c5a059' : '#b38c45') : (isDark ? '#5a5043' : '#a69985');
    const getTextColor = (tabKey) => activeTab === tabKey ? (isDark ? '#eee0da' : '#2B211E') : (isDark ? '#9a8f80' : '#7A6F5E');

    return (
        <Box sx={{
            width: '260px',
            height: '100vh',
            backgroundColor: isDark ? '#140e0c' : '#F4EACF',
            borderRight: isDark ? '1px solid rgba(78, 70, 57, 0.2)' : '1px solid rgba(179, 140, 69, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            p: 3,
            transition: 'all 0.3s ease'
        }}>

            {/* Logo Section */}
            <Box sx={{ mb: 5, textAlign: 'left' }}>
                <Typography sx={{ color: isDark ? '#c5a059' : '#b38c45', fontSize: '20px', fontWeight: 600, fontFamily: "'Playfair Display', serif", letterSpacing: '0.05em' }}>
                    Elite Events
                </Typography>
                <Typography sx={{ color: isDark ? '#5a5043' : '#7A6F5E', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Premium Concierge
                </Typography>
            </Box>

            {/* Main Menu - 💡 2. عرض شرطي للقائمة بناءً على التاب الحالي */}
            {activeTab === 'profile' ? (
                // ── قائمة البروفايل الخاصة ──
                <List sx={{ flexGrow: 1, p: 0, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <ListItem disablePadding sx={{ mb: 2 }}>
                        <ListItemButton onClick={() => setActiveTab('dashboard')} sx={{ borderRadius: '8px', color: isDark ? '#9a8f80' : '#7A6F5E', '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } }}>
                            <ListItemIcon sx={{ color: 'inherit', minWidth: '40px' }}><ArrowBackIcon fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Back to Dashboard" slotProps={{ primary: { sx: { fontSize: '13px', fontWeight: 600 } }}} />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton onClick={() => setActiveTab('profile')} sx={getButtonStyle('profile')}>
                            <ListItemIcon sx={{ color: getIconColor('profile'), minWidth: '40px' }}><PersonIcon /></ListItemIcon>
                            <ListItemText primary="Profile Informations" slotProps={{ primary: { sx: { color: getTextColor('profile'), fontSize: '14px', fontFamily: "'Inter', sans-serif", fontWeight: 500 } }}} />
                        </ListItemButton>
                    </ListItem>
                </List>
            ) : (
                // ── القائمة الرئيسية العادية ──
                <List sx={{ flexGrow: 1, p: 0, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {/* Dashboard */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => setActiveTab('dashboard')} sx={getButtonStyle('dashboard')}>
                            <ListItemIcon sx={{ color: getIconColor('dashboard'), minWidth: '40px' }}><GridViewIcon /></ListItemIcon>
                            <ListItemText primary="Dashboard" slotProps={{ primary: { sx: { color: getTextColor('dashboard'), fontSize: '14px', fontFamily: "'Inter', sans-serif" } }}} />
                        </ListItemButton>
                    </ListItem>

                    {/* Addition */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleAdditionClick} sx={getButtonStyle('addition_parent')}>
                            <ListItemIcon sx={{ color: isDark ? '#5a5043' : '#7A6F5E', minWidth: '40px' }}><AddBoxIcon /></ListItemIcon>
                            <ListItemText primary="Addition" slotProps={{ primary: { sx: { color: isDark ? '#9a8f80' : '#7A6F5E', fontSize: '14px', fontFamily: "'Inter', sans-serif" } }}} />
                            {isAdditionOpen ? <ExpandLess sx={{ color: isDark ? '#5a5043' : '#7A6F5E', fontSize: '18px' }} /> : <ExpandMore sx={{ color: isDark ? '#5a5043' : '#7A6F5E', fontSize: '18px' }} />}
                        </ListItemButton>
                    </ListItem>

                    <Collapse in={isAdditionOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding sx={{ pl: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <ListItemButton onClick={() => setActiveTab('add_product')} sx={getButtonStyle('add_product')}>
                                <ListItemIcon sx={{ color: getIconColor('add_product'), minWidth: '35px' }}><InventoryIcon sx={{ fontSize: '18px' }} /></ListItemIcon>
                                <ListItemText primary="Product" slotProps={{ primary: { sx: { color: getTextColor('add_product'), fontSize: '13px' } }}} />
                            </ListItemButton>
                            <ListItemButton onClick={() => setActiveTab('add_arrangement')} sx={getButtonStyle('add_arrangement')}>
                                <ListItemIcon sx={{ color: getIconColor('add_arrangement'), minWidth: '35px' }}><AutoAwesomeIcon sx={{ fontSize: '18px' }} /></ListItemIcon>
                                <ListItemText primary="Ready Arrangement" slotProps={{ primary: { sx: { color: getTextColor('add_arrangement'), fontSize: '13px' } }}} />
                            </ListItemButton>
                            <ListItemButton onClick={() => setActiveTab('add_hall')} sx={getButtonStyle('add_hall')}>
                                <ListItemIcon sx={{ color: getIconColor('add_hall'), minWidth: '35px' }}>
                                    <CorporateFareIcon sx={{ fontSize: '18px' }} />
                                </ListItemIcon>
                                <ListItemText primary="Hall for Rent" slotProps={{ primary: { sx: { color: getTextColor('add_hall'), fontSize: '13px' } }}} />
                            </ListItemButton>
                        </List>
                    </Collapse>

                    {/* My Catalog */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => setActiveTab('my_catalog')} sx={getButtonStyle('my_catalog')}>
                            <ListItemIcon sx={{ color: getIconColor('my_catalog'), minWidth: '40px' }}><ViewListIcon /></ListItemIcon>
                            <ListItemText primary="My Catalog" slotProps={{ primary: { sx: { color: getTextColor('my_catalog'), fontSize: '14px', fontFamily: "'Inter', sans-serif" } }}} />
                        </ListItemButton>
                    </ListItem>

                    {/* باقي الروابط العادية */}
                    {['request', 'request_status', 'my_offers', 'job_offers', 'job_applicants'].map((tab) => {
                        const icons = {
                            request: <AutorenewIcon />, request_status: <AutorenewIcon />, my_offers: <LocalOfferIcon />, job_offers: <BusinessCenterIcon />, job_applicants: <GroupIcon />
                        };
                        const labels = {
                            request: "Request", request_status: "Request Status", my_offers: "My Offers", job_offers: "Job Offers", job_applicants: "Job Applicants"
                        };
                        return (
                            <ListItem disablePadding key={tab}>
                                <ListItemButton onClick={() => setActiveTab(tab)} sx={getButtonStyle(tab)}>
                                    <ListItemIcon sx={{ color: getIconColor(tab), minWidth: '40px' }}>{icons[tab]}</ListItemIcon>
                                    <ListItemText primary={labels[tab]} slotProps={{ primary: { sx: { color: getTextColor(tab), fontSize: '14px', fontFamily: "'Inter', sans-serif" } }}} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            )}

            {/* Bottom Section */}
            <Box sx={{ borderTop: isDark ? '1px solid rgba(78, 70, 57, 0.1)' : '1px solid rgba(179, 140, 69, 0.2)', pt: 2, textAlign: 'left' }}>
                <List sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <ListItem disablePadding>
                        <ListItemButton sx={{ borderRadius: '8px', '&:active': { transform: 'scale(0.95)' } }}>
                            <ListItemIcon sx={{ color: isDark ? '#5a5043' : '#7A6F5E', minWidth: '40px' }}><HelpOutlineIcon /></ListItemIcon>
                            <ListItemText primary="Help" slotProps={{ primary: { sx: { color: isDark ? '#9a8f80' : '#7A6F5E', fontSize: '14px' } }}} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton sx={{ borderRadius: '8px', '&:active': { transform: 'scale(0.95)' } }}>
                            <ListItemIcon sx={{ color: isDark ? '#5a5043' : '#7A6F5E', minWidth: '40px' }}><LogoutIcon /></ListItemIcon>
                            <ListItemText primary="Logout" slotProps={{ primary: { sx: { color: isDark ? '#9a8f80' : '#7A6F5E', fontSize: '14px' } }}} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Box>
    );
}

export default Sidebar;