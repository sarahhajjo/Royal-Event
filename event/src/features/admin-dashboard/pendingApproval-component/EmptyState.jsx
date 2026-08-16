import React from "react";
import { Box, Typography } from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import { T } from "../Theme";

export default function EmptyState({ message = "No pending requests right now." }) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 10,
                color: T.textMuted,
            }}
        >
            <InboxOutlinedIcon sx={{ fontSize: 42, mb: 1.5, opacity: 0.6 }} />
            <Typography sx={{ fontSize: "0.9rem" }}>{message}</Typography>
        </Box>
    );
}
