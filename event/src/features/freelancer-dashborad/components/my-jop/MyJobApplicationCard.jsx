import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { MapPin, Mail, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ApplicationStatusBadge from "./ApplicationStatusBadge";
import JobBadge from "../job-opportunities/JobBadge.jsx";
import JobMetaItem from "../job-opportunities/JobMetaItem.jsx";

export default function MyJobApplicationCard({
                                                 id,
                                                 jobOfferId,
                                                 venue,
                                                 provider,
                                                 title,
                                                 timeCondition,
                                                 status,
                                                 salary,
                                                 currency = "SAR",
                                                 startDate,
                                                 experience,
                                                 deadline,
                                                 eventType,
                                                 requirements,
                                                 contactEmail,
                                                 onViewDetails,
                                             }) {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: 3 }}>
                <Box>
                    <Typography sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1.5, fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'primary.main' }}>
                        <MapPin size={13} />
                        {venue}
                    </Typography>
                    <Typography sx={{ fontSize: '1.2rem', fontWeight: 600, color: theme.palette.text.primary }}>
                        {title}
                    </Typography>
                    {provider && (
                        <Typography sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1.5, fontSize: '0.78rem', color: theme.palette.text.secondary }}>
                            <Building2 size={12} />
                            {provider}
                        </Typography>
                    )}
                </Box>

                <Box sx={{ display: 'flex', flex: 'none', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 1.5 }}>
                    {timeCondition && <JobBadge label={timeCondition} variant="outline" />}
                    <ApplicationStatusBadge status={status} />
                </Box>
            </Box>

            <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 2 }}>
                <JobMetaItem label="Salary" value={salary} suffix={`${currency} /`} highlight />
                <JobMetaItem label="Start Date" value={startDate} />
                <JobMetaItem label="Experience" value={experience} />
                <JobMetaItem label="Deadline" value={deadline} />
            </Box>
            {eventType && (
                <Typography sx={{ mt: 1, fontSize: '0.7rem', color: theme.palette.text.secondary }}>
                    {eventType}
                </Typography>
            )}

            <Typography sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', fontSize: '0.85rem', lineHeight: 1.6, color: theme.palette.text.secondary }}>
                <Box component="span" sx={{ fontWeight: 600, color: 'primary.main' }}>Requirements: </Box>
                {requirements}
            </Typography>

            <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
                <Button
                    onClick={() => navigate(`/jobs/${jobOfferId}`, { state: { applicationStatus: status } })}
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
    );
}