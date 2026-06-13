import React from "react";
import { Box, Avatar, Typography, IconButton, Divider } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { T, typography, infoButtonSx, avatarBaseSx, rowWrapperSx } from "../Theme";

/**
 * FreelancerRow
 * Props:
 *   freelancer: { id, name, avatarUrl?, avatarLetter?, contact, expertise }
 *   showDivider – boolean (default true)
 *   onInfo(id)
 */
export default function FreelancerRow({ freelancer, showDivider = true, onInfo }) {
    const { id, name, avatarUrl, avatarLetter, contact, expertise } = freelancer;

    return (
        <>
            <Box sx={rowWrapperSx}>
                {/* Portrait */}
                <Avatar
                    src={avatarUrl}
                    alt={name}
                    variant="rounded"
                    sx={{
                        ...avatarBaseSx,
                        width:        52,
                        height:       52,
                        borderRadius: "8px",
                        filter:       avatarUrl ? T.avatarFilter : "none",
                    }}
                >
                    {!avatarUrl && (avatarLetter ?? name?.[0])}
                </Avatar>

                {/* Identity */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ ...typography.rowName, color: T.textPrimary }}>
                        {name}
                    </Typography>
                    {contact && (
                        <Typography sx={{ ...typography.rowContact, mt: 0.2 }}>
                            {contact}
                        </Typography>
                    )}
                </Box>

                {/* Expertise */}
                <Box sx={{ textAlign: "right", flexShrink: 0, minWidth: 160 }}>
                    <Typography
                        sx={{
                            color:         T.goldLabel,
                            fontSize:      "0.62rem",
                            letterSpacing: 1.8,
                            textTransform: "uppercase",
                            fontWeight:    700,
                            lineHeight:    1.2,
                        }}
                    >
                        Expertise
                    </Typography>
                    <Typography sx={{ color: T.textPrimary, fontWeight: 500, fontSize: "0.9rem", mt: 0.2 }}>
                        {expertise}
                    </Typography>
                </Box>

                {/* Info */}
                <IconButton size="small" onClick={() => onInfo?.(id)} sx={{ ...infoButtonSx, ml: 1.5 }}>
                    <InfoOutlinedIcon sx={{ fontSize: 15 }} />
                </IconButton>
            </Box>

            {showDivider && <Divider sx={{ borderColor: T.border, mx: 3 }} />}
        </>
    );
}