import React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { T } from "../Theme";

const FILTERS = [
    { value: "all",        label: "All Requests" },
    { value: "company",    label: "Company Services" },
    { value: "freelancer", label: "Freelancer Services" },
    { value: "job",        label: "Job Offers" },
];

/**
 * ApprovalTabs — filter bar (All / Company / Freelancer / Job Offers)
 *
 * Props:
 *   activeFilter – current filter value
 *   onChange     – (value) => void
 */
export default function ApprovalTabs({ activeFilter, onChange }) {
    return (
        <Box sx={{ borderBottom: `1px solid ${T.border}`, mb: 3 }}>
            <Tabs
                value={activeFilter}
                onChange={(_, val) => onChange(val)}
                TabIndicatorProps={{ style: { backgroundColor: T.gold, height: 2 } }}
                sx={{ minHeight: 0 }}
            >
                {FILTERS.map((f) => (
                    <Tab
                        key={f.value}
                        value={f.value}
                        label={f.label}
                        disableRipple
                        sx={{
                            minHeight: 0,
                            px: 0,
                            mr: 4,
                            pb: 1.5,
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            letterSpacing: 1.3,
                            textTransform: "uppercase",
                            color: T.textMuted,
                            "&.Mui-selected": { color: T.gold },
                        }}
                    />
                ))}
            </Tabs>
        </Box>
    );
}
