import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PaymentIcon from '@mui/icons-material/Payment';
import StarIcon from '@mui/icons-material/Star';
import BusinessIcon from '@mui/icons-material/Business';
import FilterListIcon from '@mui/icons-material/FilterList';

const getIcon = (type) => {
    switch(type) {
        case 'person': return <PersonIcon fontSize="medium" />;
        case 'payment': return <PaymentIcon fontSize="medium" />;
        case 'star': return <StarIcon fontSize="medium" />;
        default: return <BusinessIcon fontSize="medium" />;
    }
};

const RecentActivity = ({ activities, onViewFullLog }) => {
    const theme = useTheme();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography sx={{ color: theme.palette.text.primary, fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.1em' }}>
                    RECENT ACTIVITY
                </Typography>
                <FilterListIcon sx={{ color: theme.palette.text.secondary, fontSize: 26 }} />
            </Box>

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {activities.map((act, i) => (
                    <Box key={act.id} sx={{ display: 'flex', gap: 2.5, position: 'relative' }}>
                        {i !== activities.length - 1 && (
                            <Box sx={{ position: 'absolute', left: '24px', top: '50px', bottom: '-25px', width: '2px', bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
                        )}

                        <Box sx={{ width: 50, height: 50, borderRadius: '50%', bgcolor: "rgba(212, 175, 55, 0.1)", display: 'flex', justifyContent: 'center', alignItems: 'center', color: "primary.main", flexShrink: 0, zIndex: 1 }}>
                            {getIcon(act.iconType)}
                        </Box>

                        <Box sx={{ pt: 0.5 }}>
                            <Typography sx={{ color: theme.palette.text.primary, fontSize: '1.05rem', lineHeight: 1.6 }}
                                        dangerouslySetInnerHTML={{ __html: act.message.replace(/\*\*(.*?)\*\*/g, `<strong style="color: ${theme.palette.primary.main}">$1</strong>`) }}
                            />
                            <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.85rem', mt: 1, fontWeight: 600, textTransform: 'uppercase' }}>
                                {act.timeAgo}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>

            <Button fullWidth onClick={onViewFullLog} sx={{
                mt: 4,
                color: theme.palette.text.primary,
                border: "1px solid",
                borderColor: theme.palette.mode === 'dark' ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)",
                py: 1.5,
                fontSize: '0.9rem',
                fontWeight: 700,
                "&:hover": { bgcolor: theme.palette.mode === 'dark' ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)" }
            }}>
                VIEW FULL LOG
            </Button>
        </Box>
    );
};

export default RecentActivity;