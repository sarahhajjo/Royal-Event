import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { MapPin, Mail, Loader2, CheckCircle2 } from "lucide-react";
import JobBadge from "./JobBadge";
import JobMetaItem from "./JobMetaItem";
import freelancerJobService from "../../../../services/freelancerService/freelancerJobService.js";

export default function JobListingCard({
                                           id,
                                           venue,
                                           title,
                                           badges = [],
                                           salary,
                                           currency = "SAR",
                                           startDate,
                                           experience,
                                           deadline,
                                           eventType,
                                           requirements,
                                           contactEmail,
                                           onApply,
                                       }) {
    const theme = useTheme();
    const navigate = useNavigate();

    const [isApplying, setIsApplying] = useState(false);
    const [applyStatus, setApplyStatus] = useState(null);

    const handleApplyClick = async () => {
        setIsApplying(true);
        setApplyStatus(null);
        try {
            await freelancerJobService.applyForJob(id);
            setApplyStatus('success');
            if (onApply) onApply(id);
        } catch (error) {
            console.error("Apply error:", error);
            setApplyStatus('error');
            alert(error.response?.data?.message || "حدث خطأ أثناء التقديم");
        } finally {
            setIsApplying(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: '12px',
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(15, 15, 20, 0.4)' : 'rgba(255, 255, 255, 0.35)',
                transition: 'all 0.3s ease',
                '&:hover': { borderColor: 'primary.main', bgcolor: theme.palette.mode === 'dark' ? 'rgba(15, 15, 20, 0.6)' : 'rgba(255, 255, 255, 0.6)' }
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: 3 }}>
                    <Box>
                        <Typography sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1.5, fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'primary.main' }}>
                            <MapPin size={13} />
                            {venue}
                        </Typography>
                        <Typography sx={{ fontSize: '1.2rem', fontWeight: 600, color: theme.palette.text.primary }}>
                            {title}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flex: 'none', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 1.5 }}>
                        {badges.map((badge) => (
                            <JobBadge key={badge.label} {...badge} />
                        ))}
                    </Box>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 2 }}>
                    <JobMetaItem label="Salary" value={salary} suffix={` ${currency} /`} highlight />
                    <JobMetaItem label="Start Date" value={startDate} />
                    <JobMetaItem label="Experience" value={experience} />
                    <JobMetaItem label="Deadline" value={deadline} />
                </Box>
                {eventType && (
                    <Typography sx={{ mt: -1, fontSize: '0.7rem', color: theme.palette.text.secondary }}>
                        {eventType}
                    </Typography>
                )}

                <Typography sx={{ borderTop: '1px solid', borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', pt: 2.5, fontSize: '0.85rem', lineHeight: 1.6, color: theme.palette.text.secondary }}>
                    <Box component="span" sx={{ fontWeight: 600, color: 'primary.main' }}>Requirements: </Box>
                    {requirements}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, pt: 1 }}>
                    <Button
                        onClick={handleApplyClick}
                        disabled={isApplying || applyStatus === 'success'}
                        variant="contained"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            borderRadius: '8px',
                            px: 3,
                            py: 0.9,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                        }}
                    >
                        {isApplying ? (
                            <>جاري التقديم... <Loader2 size={14} className="animate-spin" /></>
                        ) : applyStatus === 'success' ? (
                            <>تم بنجاح <CheckCircle2 size={14} /></>
                        ) : (
                            "Apply Now"
                        )}
                    </Button>

                    <Button
                        onClick={() => navigate(`/jobs/${id}`)}
                        variant="outlined"
                        sx={{
                            borderRadius: '8px',
                            borderColor: 'primary.main',
                            px: 3,
                            py: 0.8,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: 'primary.main',
                            '&:hover': { bgcolor: 'rgba(212,175,55,0.1)' }
                        }}
                    >
                        View Details
                    </Button>

                    {contactEmail && (
                        <Box
                            component="a"
                            href={`mailto:${contactEmail}`}
                            sx={{
                                ml: 'auto',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                fontSize: '0.85rem',
                                fontStyle: 'italic',
                                color: theme.palette.text.secondary,
                                textDecoration: 'none',
                                transition: 'color 0.2s',
                                '&:hover': { color: 'primary.main' }
                            }}
                        >
                            <Mail size={14} />
                            {contactEmail}
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}