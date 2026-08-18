import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const CalendarIcon = (props) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

export default function BookingScheduleCard({ bookedDate, shift, createdAtHuman }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box
            sx={{
                bgcolor: isDark ? 'rgba(15, 15, 20, 0.4)' : 'rgba(255, 255, 255, 0.4)',
                borderRadius: '12px',
                border: '1px solid',
                borderColor: theme.palette.divider,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%'
            }}
        >
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                    <Box sx={{ display: 'flex', color: 'primary.main' }}>
                        <CalendarIcon width={20} height={20} />
                    </Box>
                    <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: theme.palette.text.primary }}>
                        Schedule
                    </Typography>
                </Box>

                <Box
                    sx={{
                        position: 'relative',
                        pl: 2.5,
                        ml: 1,
                        borderLeft: '1px solid',
                        borderColor: theme.palette.divider,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2.5
                    }}
                >
                    <Box sx={{ position: 'relative' }}>
                        <Box
                            sx={{
                                position: 'absolute',
                                left: -21,
                                top: 6,
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                bgcolor: 'primary.main'
                            }}
                        />
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: theme.palette.text.primary }}>
                            {bookedDate}
                        </Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: theme.palette.text.secondary }}>
                            {shift ? `${shift.name} (${shift.start_time} - ${shift.end_time})` : "Event Day"}
                        </Typography>
                    </Box>

                    <Box sx={{ position: 'relative' }}>
                        <Box
                            sx={{
                                position: 'absolute',
                                left: -21,
                                top: 6,
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                bgcolor: theme.palette.text.secondary
                            }}
                        />
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: theme.palette.text.primary }}>
                            Created
                        </Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: theme.palette.text.secondary }}>
                            {createdAtHuman || "منذ فترة"}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}