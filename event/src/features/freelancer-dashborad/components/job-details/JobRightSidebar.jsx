import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { Mail, ArrowRight, Package } from "lucide-react";

export default function JobRightSidebar({ salary, paymentSystem, contactEmail, equipmentProvided }) {
    const theme = useTheme();

    const sidebarCardSx = {
        borderRadius: '16px',
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(15, 15, 20, 0.4)' : 'rgba(255, 255, 255, 0.35)',
        p: { xs: 3, md: 4 },
        boxShadow: 'none'
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            {/* Financial & Perks Card */}
            <Box sx={sidebarCardSx}>
                <Typography sx={{ mb: 3, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', color: theme.palette.text.secondary, textTransform: 'uppercase' }}>
                    Financial & Perks
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.secondary }}>Proposed Salary</Typography>
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
                        <Typography sx={{ fontFamily: "'Cinzel', serif", fontSize: '2.2rem', fontWeight: 700, color: 'primary.main', lineHeight: 1 }}>
                            {salary}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary }}>
                            SAR {paymentSystem}
                        </Typography>
                    </Box>
                </Box>

                {equipmentProvided && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, borderRadius: '10px', border: '1px solid', borderColor: theme.palette.divider, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.5)', p: 2 }}>
                        <Package size={18} color={theme.palette.primary.main} />
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: theme.palette.text.primary }}>
                            Company Equipment Provided
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Inquiries Card */}
            <Box sx={sidebarCardSx}>
                <Typography sx={{ mb: 3, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', color: theme.palette.text.secondary, textTransform: 'uppercase' }}>
                    Inquiries
                </Typography>

                <Box
                    component="a"
                    href={`mailto:${contactEmail}`}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: theme.palette.divider,
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.5)',
                        p: 2.5,
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        '&:hover': { borderColor: 'primary.main', '& .arrow-icon': { transform: 'translateX(4px)' } }
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Mail size={20} color={theme.palette.primary.main} />
                        <Typography sx={{ mt: 1, fontSize: '0.75rem', color: theme.palette.text.secondary }}>Contact HR</Typography>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: theme.palette.text.primary }}>{contactEmail}</Typography>
                    </Box>
                    <ArrowRight
                        size={20}
                        color={theme.palette.text.secondary}
                        className="arrow-icon"
                        style={{ transition: 'transform 0.3s ease' }}
                    />
                </Box>
            </Box>
        </Box>
    );
}