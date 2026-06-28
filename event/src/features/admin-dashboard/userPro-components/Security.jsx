import React, { useState } from "react";
import { Box, Typography, Divider, IconButton } from "@mui/material";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { T, typography } from "../Theme";

const Security = ({ security }) => {
    const [showPw, setShowPw] = useState(false);

    return (
        <Box
            sx={{
                border: `1.5px solid ${T.border}`,
                borderRadius: "14px",
                p: 4,                  // ← أوسع
                backgroundColor: T.cardBg,
                width: "100%",         // ← يملأ الـ flex item
                boxSizing: "border-box",
            }}
        >
            {/* ── Header ── */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3.5 }}>
                <SecurityOutlinedIcon sx={{ color: T.gold, fontSize: 20 }} />
                <Typography sx={{ ...typography.sectionLabel, color: T.textPrimary, letterSpacing: 2.5 }}>
                    Security
                </Typography>
            </Box>

            {/* ── Password ── */}
            <Box sx={{ mb: 3 }}>
                <Typography sx={{ ...typography.colHeader, mb: 1 }}>PASSWORD</Typography>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1.5 }}>
                    <Typography
                        sx={{
                            fontSize: "1.05rem",
                            color: T.textPrimary,
                            letterSpacing: showPw ? 0 : 3,
                            lineHeight: 1,
                        }}
                    >
                        {showPw ? (security?.password || "") : "••••••••••••••••"}
                    </Typography>
                    <IconButton
                        size="small"
                        onClick={() => setShowPw((v) => !v)}
                        sx={{ color: T.goldLabel, ml: 1, "&:hover": { color: T.gold } }}
                    >
                        {showPw
                            ? <VisibilityOffOutlinedIcon fontSize="small" />
                            : <VisibilityOutlinedIcon fontSize="small" />
                        }
                    </IconButton>
                </Box>
                <Divider sx={{ borderColor: T.border }} />
            </Box>

            {/* ── Last Changed ── */}
            <Box>
                <Typography sx={{ ...typography.colHeader, mb: 1 }}>LAST CHANGED</Typography>
                <Typography sx={{ fontSize: "0.97rem", fontWeight: 700, color: T.textPrimary }}>
                    {security?.lastChanged || "—"}
                </Typography>
            </Box>
        </Box>
    );
};

export default Security;