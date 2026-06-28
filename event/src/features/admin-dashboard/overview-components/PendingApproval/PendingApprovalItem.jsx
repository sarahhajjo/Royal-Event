import React from "react";
import { Box, Paper, Stack, Typography, Chip, Avatar } from "@mui/material";

const PendingApprovalItem = ({ icon, title, submittedAt, statusLabel }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid #E0D5BC",
                borderRadius: 2,
                bgcolor: "#FFFFFF",
                transition: "background 0.2s",
                "&:hover": { bgcolor: "#F3EDE0" }
            }}
        >
            <Stack direction="row" spacing={2.5} alignItems="center">
                <Avatar
                    variant="rounded"
                    sx={{ bgcolor: "#EDE5CE", color: "#8a6f28", width: 45, height: 45, borderRadius: "10px" }}
                >
                    {icon}
                </Avatar>
                <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#1C1712" }}>
                        {title}
                    </Typography>
                    <Typography sx={{ fontSize: "0.82rem", color: "#7A6F5E", mt: 0.3 }}>
                        {submittedAt}
                    </Typography>
                </Box>
            </Stack>

            <Chip
                label={statusLabel}
                variant="outlined"
                size="small"
                sx={{
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    fontSize: "0.7rem",
                    borderColor: "#8a6f28",
                    color: "#8a6f28",
                    borderRadius: 1,
                    bgcolor: "transparent",
                }}
            />
        </Paper>
    );
};

export default PendingApprovalItem;