import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import JobListingCard from "./JobListingCard";

export default function JobListingsSection({ title = "Available Positions", jobs = [], onApply, onViewDetails }) {
    const theme = useTheme();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {jobs.length === 0 ? (
                <Box sx={{ p: 5, textAlign: 'center', borderRadius: '12px', border: '1px dashed', borderColor: theme.palette.divider }}>
                    <Typography sx={{ fontSize: '0.9rem', color: theme.palette.text.secondary }}>
                        No matching positions right now
                    </Typography>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {jobs.map((job) => (
                        <JobListingCard
                            key={job.id}
                            id={job.id}
                            {...job}
                            onApply={() => onApply?.(job)}
                            onViewDetails={() => onViewDetails?.(job)}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
}