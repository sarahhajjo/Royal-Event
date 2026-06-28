import React from "react";
import { Paper, Box, Typography, Stack, Chip, Divider, Button, Avatar } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BrushIcon from "@mui/icons-material/Brush";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PaletteIcon from "@mui/icons-material/Palette";

const STATUS_CONFIG = {
    "UNDER REVIEW":    { label: "UNDER REVIEW",    color: "#C9A84C" },
    "VERIFIED":        { label: "VERIFIED",        color: "#4CAF50" },
    "ACTION REQUIRED": { label: "ACTION REQUIRED", color: "#CF6679" },
};

const REQUEST_ICONS = [BrushIcon, AutoAwesomeIcon, PaletteIcon];

const RequestItem = ({ request, index }) => {
    const IconComponent = REQUEST_ICONS[index % REQUEST_ICONS.length];
    const statusCfg = STATUS_CONFIG[request.status] || STATUS_CONFIG["UNDER REVIEW"];

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                py: 3.5,
                px: 3.5,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2.5
            }}
        >
            <Avatar
                variant="rounded"
                sx={{
                    width: 56,
                    height: 56,
                    bgcolor: "rgba(201,168,76,0.08)",
                    border: "1px solid rgba(201,168,76,0.2)"
                }}
            >
                <IconComponent sx={{ fontSize: 28, color: "primary.main" }} />
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                    sx={{
                        color: "text.primary",
                        fontWeight: 700,
                        fontFamily: "'Cinzel', serif",
                        fontSize: "1.15rem",
                        mb: 0.8
                    }}
                    noWrap
                >
                    {request.title}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                    <AccessTimeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography sx={{ color: "text.secondary", fontSize: "0.88rem" }}>
                        {request.submittedAt}
                    </Typography>
                </Box>
            </Box>

            <Chip
                label={statusCfg.label}
                variant="outlined"
                sx={{
                    borderRadius: 1.5,
                    borderColor: statusCfg.color,
                    color: statusCfg.color,
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    height: 34,
                    px: 1
                }}
            />
        </Box>
    );
};

const PendingRequests = ({ requests = [], onViewAll }) => (
    <Paper elevation={0} sx={{ p: 4, height: "100%", bgcolor: "transparent" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "'Cinzel', serif", color: "text.primary" }}>
                    Pending Requests
                </Typography>
                <Chip
                    label="2 PENDING"
                    size="small"
                    sx={{
                        bgcolor: "rgba(201,168,76,0.15)",
                        color: "primary.main",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        height: 26
                    }}
                />
            </Box>
            <Button
                size="small"
                onClick={onViewAll}
                sx={{
                    color: "text.secondary",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    letterSpacing: "0.12em"
                }}
            >
                VIEW ALL
            </Button>
        </Box>
        <Stack spacing={2.5}>
            {requests.map((req, i) => <RequestItem key={req.id || i} request={req} index={i} />)}
        </Stack>
    </Paper>
);

export default PendingRequests;