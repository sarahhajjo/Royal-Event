import React, { useState } from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { MapPin, MoveRight, Loader2, CheckCircle2 } from "lucide-react";
import freelancerJobService from "../../../../services/freelancerService/freelancerJobService.js";
import JobBadge from "../job-opportunities/JobBadge.jsx";

export default function JobDetailsHeader({ jobId, title, venue, eventType, applicationStatus }) {
    const theme = useTheme();
    const [isApplying, setIsApplying] = useState(false);
    const [applyStatus, setApplyStatus] = useState(null);

    const handleApply = async () => {
        setIsApplying(true);
        setApplyStatus(null);
        try {
            await freelancerJobService.applyForJob(jobId);
            setApplyStatus('success');
        } catch (error) {
            console.error("Apply error:", error);
            setApplyStatus('error');
            alert(error.response?.data?.message || "حدث خطأ أثناء التقديم");
        } finally {
            setIsApplying(false);
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            md: { alignItems: 'center', justifyContent: 'space-between' },
            gap: 3,
            borderBottom: '1px solid',
            borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            pb: 3.5
        }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {eventType && (
                    <Box sx={{ width: 'max-content' }}>
                        <JobBadge label={eventType} variant="outline" />
                    </Box>
                )}
                <Typography sx={{ fontFamily: "'Cinzel', serif", fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 700, color: theme.palette.text.primary, letterSpacing: '-0.02em' }}>
                    {title}
                </Typography>
                <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontSize: '0.85rem', color: theme.palette.text.secondary }}>
                    <MapPin size={16} color={theme.palette.primary.main} />
                    {venue}
                </Typography>
            </Box>

            {applicationStatus ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderRadius: '10px', border: '1px solid', borderColor: 'rgba(212,175,55,0.5)', bgcolor: 'rgba(212,175,55,0.1)', px: 3, py: 1.5, fontWeight: 600, color: 'primary.main', fontSize: '0.85rem' }}>
                    Your Status: {applicationStatus}
                </Box>
            ) : (
                <Button
                    onClick={handleApply}
                    disabled={isApplying || applyStatus === 'success'}
                    variant="contained"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        borderRadius: '10px',
                        px: 3.5,
                        py: 1.5,
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        textTransform: 'none',
                    }}
                >
                    {isApplying ? (
                        <>جاري التقديم... <Loader2 size={18} className="animate-spin" /></>
                    ) : applyStatus === 'success' ? (
                        <>تم التقديم بنجاح <CheckCircle2 size={18} /></>
                    ) : (
                        <>Apply Now <MoveRight size={18} /></>
                    )}
                </Button>
            )}
        </Box>
    );
}