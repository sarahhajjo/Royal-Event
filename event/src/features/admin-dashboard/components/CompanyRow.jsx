
import React from "react";
import { Box, Avatar, Typography, IconButton, Divider } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { T, typography, infoButtonSx, avatarBaseSx, rowWrapperSx } from "../Theme";

/**
 * CompanyRow
 * Props:
 *   company: { id, name, logoUrl?, logoLetter?, rep, email, phone }
 *   showDivider – boolean (default true)
 *   onInfo(id)
 */
export default function CompanyRow({ company, showDivider = true, onInfo }) {
    const { id, name, logoUrl, logoLetter, rep, email, phone } = company;

    return (
        <>
            <Box sx={rowWrapperSx}>
                {/* Logo */}
                <Avatar
                    src={logoUrl}
                    alt={name}
                    variant="rounded"
                    sx={{ ...avatarBaseSx, width: 52, height: 52 }}
                >
                    {!logoUrl && (logoLetter ?? name?.[0])}
                </Avatar>

                {/* Name + Rep */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ color: T.textPrimary, fontWeight: 700, fontSize: "0.97rem", lineHeight: 1.3 }}>
                        {name}
                    </Typography>
                    <Typography sx={{ ...typography.rowSub }}>
                        Rep: {rep}
                    </Typography>
                </Box>

                {/* Contact */}
                <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                    <Typography sx={{ ...typography.rowContact }}>{email}</Typography>
                    <Typography sx={{ ...typography.rowContact }}>{phone}</Typography>
                </Box>

                {/* Info */}
                <IconButton size="small" onClick={() => onInfo?.(id)} sx={infoButtonSx}>
                    <InfoOutlinedIcon sx={{ fontSize: 15 }} />
                </IconButton>
            </Box>

            {showDivider && <Divider sx={{ borderColor: T.border, mx: 3 }} />}
        </>
    );
}
















