import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import { useTheme, alpha } from '@mui/material/styles';

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

import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

// 💡 استيراد الألوان الموحدة
import {
    GOLD, BROWN_TEXT, MUTED_TEXT,
    LIGHT_CARD, LIGHT_BORDER, LIGHT_INPUT,
    DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_SURFACE_BG, DARK_SURFACE_BORDER
} from '../../../utils/colorConstants';

function Sidebar({ activeTab, setActiveTab }) {
    const [isAdditionOpen, setIsAdditionOpen] = useState(false);
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const handleAdditionClick = () => {
        setIsAdditionOpen(!isAdditionOpen);
    };

    const getButtonStyle = (tabKey) => {
        const isActive = activeTab === tabKey;
        return {
            borderRadius: '16px',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            background: isActive ? alpha(GOLD, 0.15) : 'transparent',
            border: isActive ? `1px solid ${alpha(GOLD, 0.3)}` : '1px solid transparent',

            '&:hover': {
                backgroundColor: isActive ? 'inherit' : (isDark ? DARK_SURFACE_BG : LIGHT_INPUT),
                transform: 'translateX(4px)',
                boxShadow: isActive ? `0 10px 24px ${alpha(GOLD, 0.15)}` : 'none'
            },
            '&:active': {
                transform: 'scale(0.96) translateX(2px)',
                transition: 'all 0.05s ease'
            }
        };
    };

    const getIconColor = (tabKey) => activeTab === tabKey ? GOLD : (isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT);
    const getTextColor = (tabKey) => activeTab === tabKey ? (isDark ? '#ffffff' : BROWN_TEXT) : (isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT);

    return (
        <Box sx={{
            width: '280px',
            height: '100vh',
            // 💡 تطبيق الخلفية الزجاجية
            background: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
            borderRight: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
            boxShadow: isDark ? '10px 0 30px rgba(0, 0, 0, 0.5)' : `10px 0 30px ${alpha(GOLD, 0.15)}`,
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            display: 'flex',
            flexDirection: 'column',
            p: 2.5,
            transition: 'all 0.3s ease'
        }}>

            <Box sx={{
                mb: 2.75, p: 2, borderRadius: '22px',
                background: isDark ? DARK_SURFACE_BG : LIGHT_INPUT,
                border: isDark ? DARK_SURFACE_BORDER : `1px solid ${alpha(LIGHT_BORDER, 0.5)}`
            }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 1.1 }}>
                    <Box sx={{
                        width: 58, height: 58, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#ffffff', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.03em',
                        background: 'linear-gradient(145deg, #4c8ea3 0%, #6cc0c2 100%)',
                        boxShadow: '0 10px 24px rgba(76, 142, 163, 0.35)', position: 'relative',
                        '&::after': { content: '""', position: 'absolute', right: 2, bottom: 2, width: 11, height: 11, borderRadius: '50%', backgroundColor: '#2fe0a4', border: isDark ? `2px solid ${theme.palette.background.paper}` : '2px solid #ffffff' }
                    }}>
                        EP
                    </Box>
                    <Box>
                        <Typography sx={{ color: isDark ? '#ffffff' : BROWN_TEXT, fontSize: '15px', fontWeight: 800, lineHeight: 1.2 }}>
                            Executive Partner
                        </Typography>
                        <Typography sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, fontSize: '11px', mt: 0.35, fontWeight: 600 }}>
                            partner@eliteevents.com
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {activeTab === 'profile' ? (
                <List sx={{ flexGrow: 1, p: 0, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                    <ListItem disablePadding sx={{ mb: 1.25 }}>
                        <ListItemButton
                            onClick={() => setActiveTab('dashboard')}
                            sx={{
                                borderRadius: '14px',
                                color: isDark ? '#ffffff' : BROWN_TEXT,
                                backgroundColor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT,
                                border: isDark ? DARK_SURFACE_BORDER : `1px solid ${alpha(LIGHT_BORDER, 0.5)}`,
                                '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : alpha(LIGHT_INPUT, 0.8) }
                            }}
                        >
                            <ListItemIcon sx={{ color: 'inherit', minWidth: '40px' }}><ArrowBackIcon fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Back to Dashboard" slotProps={{ primary: { sx: { fontSize: '13px', fontWeight: 700, fontFamily: "'Inter', sans-serif" } }}} />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton onClick={() => setActiveTab('profile')} sx={getButtonStyle('profile')}>
                            <ListItemIcon sx={{ color: getIconColor('profile'), minWidth: '40px' }}><PersonIcon /></ListItemIcon>
                            <ListItemText primary="Profile Informations" slotProps={{ primary: { sx: { color: getTextColor('profile'), fontSize: '14px', fontFamily: "'Inter', sans-serif", fontWeight: 700 } }}} />
                        </ListItemButton>
                    </ListItem>
                </List>
            ) : (
                <List sx={{ flexGrow: 1, p: 0, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => setActiveTab('dashboard')} sx={getButtonStyle('dashboard')}>
                            <ListItemIcon sx={{ color: getIconColor('dashboard'), minWidth: '40px' }}><GridViewIcon /></ListItemIcon>
                            <ListItemText primary="Dashboard" slotProps={{ primary: { sx: { color: getTextColor('dashboard'), fontSize: '14px', fontFamily: "'Inter', sans-serif", fontWeight: 700 } }}} />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton onClick={handleAdditionClick} sx={getButtonStyle('addition_parent')}>
                            <ListItemIcon sx={{ color: getIconColor('addition_parent'), minWidth: '40px' }}><AddBoxIcon /></ListItemIcon>
                            <ListItemText primary="Addition" slotProps={{ primary: { sx: { color: getTextColor('addition_parent'), fontSize: '14px', fontFamily: "'Inter', sans-serif", fontWeight: 700 } }}} />
                            {isAdditionOpen ? <ExpandLess sx={{ color: getIconColor('addition_parent'), fontSize: '18px' }} /> : <ExpandMore sx={{ color: getIconColor('addition_parent'), fontSize: '18px' }} />}
                        </ListItemButton>
                    </ListItem>

                    <Collapse in={isAdditionOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding sx={{ pl: 2.2, display: 'flex', flexDirection: 'column', gap: 0.65 }}>
                            <ListItemButton onClick={() => setActiveTab('add_product')} sx={getButtonStyle('add_product')}>
                                <ListItemIcon sx={{ color: getIconColor('add_product'), minWidth: '35px' }}><InventoryIcon sx={{ fontSize: '18px' }} /></ListItemIcon>
                                <ListItemText primary="Product" slotProps={{ primary: { sx: { color: getTextColor('add_product'), fontSize: '13px', fontFamily: "'Inter', sans-serif", fontWeight: 600 } }}} />
                            </ListItemButton>
                            <ListItemButton onClick={() => setActiveTab('add_arrangement')} sx={getButtonStyle('add_arrangement')}>
                                <ListItemIcon sx={{ color: getIconColor('add_arrangement'), minWidth: '35px' }}><AutoAwesomeIcon sx={{ fontSize: '18px' }} /></ListItemIcon>
                                <ListItemText primary="Ready Arrangement" slotProps={{ primary: { sx: { color: getTextColor('add_arrangement'), fontSize: '13px', fontFamily: "'Inter', sans-serif", fontWeight: 600 } }}} />
                            </ListItemButton>
                            <ListItemButton onClick={() => setActiveTab('add_hall')} sx={getButtonStyle('add_hall')}>
                                <ListItemIcon sx={{ color: getIconColor('add_hall'), minWidth: '35px' }}>
                                    <CorporateFareIcon sx={{ fontSize: '18px' }} />
                                </ListItemIcon>
                                <ListItemText primary="Hall for Rent" slotProps={{ primary: { sx: { color: getTextColor('add_hall'), fontSize: '13px', fontFamily: "'Inter', sans-serif", fontWeight: 600 } }}} />
                            </ListItemButton>
                        </List>
                    </Collapse>

                    <ListItem disablePadding>
                        <ListItemButton onClick={() => setActiveTab('my_catalog')} sx={getButtonStyle('my_catalog')}>
                            <ListItemIcon sx={{ color: getIconColor('my_catalog'), minWidth: '40px' }}><ViewListIcon /></ListItemIcon>
                            <ListItemText primary="My Catalog" slotProps={{ primary: { sx: { color: getTextColor('my_catalog'), fontSize: '14px', fontFamily: "'Inter', sans-serif", fontWeight: 700 } }}} />
                        </ListItemButton>
                    </ListItem>

                    {['request', 'my_offers', 'job_offers', 'job_applicants', 'my_calendar'].map((tab) => {
                        const icons = {
                            request: <AutorenewIcon />, request_status: <AutorenewIcon />, my_offers: <LocalOfferIcon />,
                            job_offers: <BusinessCenterIcon />, job_applicants: <GroupIcon />, my_calendar: <CalendarMonthIcon />
                        };
                        const labels = {
                            request: "Request", my_offers: "My Services",
                            job_offers: "Job Offers", job_applicants: "Job Applicants", my_calendar: "My Calendar"
                        };
                        return (
                            <ListItem disablePadding key={tab}>
                                <ListItemButton onClick={() => setActiveTab(tab)} sx={getButtonStyle(tab)}>
                                    <ListItemIcon sx={{ color: getIconColor(tab), minWidth: '40px' }}>{icons[tab]}</ListItemIcon>
                                    <ListItemText primary={labels[tab]} slotProps={{ primary: { sx: { color: getTextColor(tab), fontSize: '14px', fontFamily: "'Inter', sans-serif", fontWeight: 700 } }}} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            )}

            <Box sx={{ borderTop: isDark ? DARK_SURFACE_BORDER : `1px solid ${alpha(LIGHT_BORDER, 0.5)}`, pt: 2, textAlign: 'left', mt: 1 }}>
                <List sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 0.6 }}>
                    <ListItem disablePadding>
                        <ListItemButton sx={{ borderRadius: '14px', color: isDark ? 'rgba(255,255,255,0.7)' : BROWN_TEXT, '&:hover': { backgroundColor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT }, '&:active': { transform: 'scale(0.95)' } }}>
                            <ListItemIcon sx={{ color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT, minWidth: '40px' }}><HelpOutlineIcon /></ListItemIcon>
                            <ListItemText primary="Help" slotProps={{ primary: { sx: { fontSize: '14px', fontFamily: "'Inter', sans-serif", fontWeight: 700 } }}} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton sx={{ borderRadius: '14px', color: isDark ? 'rgba(255,255,255,0.7)' : BROWN_TEXT, '&:hover': { backgroundColor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT }, '&:active': { transform: 'scale(0.95)' } }}>
                            <ListItemIcon sx={{ color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT, minWidth: '40px' }}><LogoutIcon /></ListItemIcon>
                            <ListItemText primary="Logout" slotProps={{ primary: { sx: { fontSize: '14px', fontFamily: "'Inter', sans-serif", fontWeight: 700 } }}} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Box>
    );
}

export default Sidebar;