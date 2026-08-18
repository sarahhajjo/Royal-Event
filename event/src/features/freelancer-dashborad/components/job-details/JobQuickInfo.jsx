import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { Calendar, Clock, Briefcase, FileText } from "lucide-react";

const checkIsUrgent = (deadlineDate) => {
    if (!deadlineDate) return false;
    const today = new Date();
    const deadline = new Date(deadlineDate);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 3;
};

export default function JobQuickInfo({ startDate, deadline, experience, employmentType }) {
    const theme = useTheme();
    const isUrgent = checkIsUrgent(deadline);

    const infoCards = [
        { label: "Start Date", value: startDate, icon: <Calendar size={18} /> },
        { label: "Deadline", value: deadline, icon: <Clock size={18} />, highlight: isUrgent },
        { label: "Experience Level", value: experience, icon: <Briefcase size={18} /> },
        { label: "Employment Type", value: employmentType, icon: <FileText size={18} /> },
    ];

    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2.5 }}>
            {infoCards.map((card, index) => (
                <Box
                    key={index}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(15, 15, 20, 0.4)' : 'rgba(255, 255, 255, 0.35)',
                        p: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': { borderColor: 'primary.main' }
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: theme.palette.text.secondary }}>
                        {card.icon}
                        {card.highlight && (
                            <Box sx={{ borderRadius: '4px', bgcolor: 'rgba(239, 68, 68, 0.1)', px: 1, py: 0.3, fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.05em', color: '#f87171' }}>
                                URGENT
                            </Box>
                        )}
                    </Box>
                    <Box>
                        <Typography sx={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: theme.palette.text.secondary, fontFamily: "'Raleway', sans-serif" }}>
                            {card.label}
                        </Typography>
                        <Typography sx={{ mt: 0.5, fontSize: '0.9rem', fontWeight: 600, color: theme.palette.text.primary, fontFamily: "'Raleway', sans-serif" }}>
                            {card.value}
                        </Typography>
                    </Box>
                </Box>
            ))}
        </Box>
    );
}