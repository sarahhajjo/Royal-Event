import React from "react";
import { Box, Typography } from "@mui/material";
import { T, typography } from "../theme";

/**
 * QueueTabs
 * Top tab strip: Products / Ready Arrangements / Halls for Rent,
 * plus the "Total Pending" counter on the right.
 *
 * Props:
 *  - tabs: string[]
 *  - activeTab: string
 *  - onChange: (tab: string) => void
 *  - totalPending: number
 */
export default function QueueTabs({
                                      tabs = ["Products", "Ready Arrangements", "Halls for Rent"],
                                      activeTab,
                                      onChange,
                                      totalPending = 0,
                                  }) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: `1px solid ${T.border}`,
                px: 1,
                mb: 4,
            }}
        >
            <Box sx={{ display: "flex", gap: 4 }}>
                {tabs.map((tab) => {
                    const isActive = tab === activeTab;
                    return (
                        <Box
                            key={tab}
                            onClick={() => onChange?.(tab)}
                            sx={{
                                pb: 1.5,
                                cursor: "pointer",
                                borderBottom: isActive ? `2px solid ${T.gold}` : "2px solid transparent",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "0.78rem",
                                    fontWeight: 700,
                                    letterSpacing: 1.4,
                                    textTransform: "uppercase",
                                    color: isActive ? T.gold : T.textMuted,
                                    fontFamily: typography.fontFamily,
                                }}
                            >
                                {tab}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>

            <Typography
                sx={{
                    fontSize: "0.75rem",
                    color: T.textMuted,
                    fontFamily: typography.fontFamily,
                    pb: 1.5,
                }}
            >
                Total Pending: {totalPending}
            </Typography>
        </Box>
    );
}