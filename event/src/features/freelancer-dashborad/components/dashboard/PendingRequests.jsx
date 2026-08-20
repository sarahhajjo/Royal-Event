import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';

const PendingRequests = ({ requests, onViewAll }) => {
    const theme = useTheme();

    return (
        <Box sx={{ p: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ color: theme.palette.text.primary, fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: "1.5rem" }}>
                        Pending Requests
                    </Typography>
                    <Box sx={{ bgcolor: "rgba(212, 175, 55, 0.15)", color: "primary.main", px: 2, py: 0.8, borderRadius: "12px", fontSize: "0.85rem", fontWeight: 700 }}>
                        {requests.length} PENDING
                    </Box>
                </Box>
                <Button onClick={onViewAll} sx={{ color: "primary.main", fontWeight: 700, fontSize: "0.9rem" }}>
                    VIEW ALL
                </Button>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {requests.map((item, idx) => (
                    <Box key={idx} sx={{
                        display: "flex", justifyContent: "space-between", alignItems: "center", p: 2.5,
                        bgcolor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
                        "&:hover": { borderColor: "primary.main", bgcolor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)" }
                    }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                            <Box sx={{ width: 50, height: 50, borderRadius: 2, bgcolor: "rgba(212, 175, 55, 0.1)", display: "flex", justifyContent: "center", alignItems: "center", color: "primary.main" }}>
                                <CreateIcon fontSize="medium" />
                            </Box>
                            <Box>
                                <Typography sx={{ fontWeight: 600, color: theme.palette.text.primary, fontSize: "1.1rem" }}>
                                    {item.title}
                                </Typography>
                                <Typography sx={{ color: theme.palette.text.secondary, fontSize: "0.9rem", mt: 0.5 }}>
                                    {item.submittedAt}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{
                            border: "1px solid", borderColor: "rgba(212, 175, 55, 0.4)", color: "primary.main", px: 2.5, py: 0.8, borderRadius: 1.5, fontSize: "0.8rem", fontWeight: 700
                        }}>
                            {item.status}
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default PendingRequests;