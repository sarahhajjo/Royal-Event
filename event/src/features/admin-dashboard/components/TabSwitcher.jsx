import React from "react";
import { Box, Typography } from "@mui/material";

// T هو كائن الألوان الخاص بك (يمكنك تمرير الألوان كـ props إذا أردت)
const T = {
    gold: "#8a6f28",
    textPrimary: "#1C1712",
    textMuted: "#7A6F5E",
};

export default function TabSwitcher({ tabs, activeTab, onTabChange }) {
    return (
        <Box sx={{ display: "flex", gap: 4, mb: 3 }}>
            {tabs.map((tab) => (
                <Typography
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    sx={{
                        cursor: "pointer",
                        fontSize: "1.1rem",
                        fontWeight: activeTab === tab ? 700 : 400,
                        color: activeTab === tab ? T.textPrimary : T.textMuted,
                        borderBottom: activeTab === tab ? `2px solid ${T.gold}` : "none",
                        pb: 0.5,
                        transition: "all 0.2s",
                        "&:hover": { color: T.textPrimary }
                    }}
                >
                    {tab}
                </Typography>
            ))}
        </Box>
    );
}