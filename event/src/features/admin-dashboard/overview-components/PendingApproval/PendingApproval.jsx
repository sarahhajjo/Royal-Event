import React from "react";
import { Box, Stack, Typography, Chip } from "@mui/material";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import EmojiObjectsOutlinedIcon from "@mui/icons-material/EmojiObjectsOutlined";
import CelebrationOutlinedIcon from "@mui/icons-material/CelebrationOutlined";
import PendingApprovalItem from "./PendingApprovalItem"; // تأكد من المسار

const PendingApproval = () => {
    return (
        <Box>
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#1C1712" }}>
                    Pending Approval
                </Typography>
                <Chip label="3 PENDING" size="small" sx={{ bgcolor: "#E8C97A", color: "#1C1712", fontWeight: 700, fontSize: "0.7rem" }} />
            </Stack>

            <Stack spacing={2}>
                <PendingApprovalItem
                    icon={<BusinessOutlinedIcon />}
                    title="Grand Crystal Ballroom - Hall Listing"
                    submittedAt="Submitted: 2 hours ago"
                    statusLabel="UNDER REVIEW"
                />
                <PendingApprovalItem
                    icon={<EmojiObjectsOutlinedIcon />}
                    title="Luxury Crystal Chandelier - Product Add"
                    submittedAt="Submitted: 5 hours ago"
                    statusLabel="VERIFYING ASSETS"
                />
                <PendingApprovalItem
                    icon={<CelebrationOutlinedIcon />}
                    title="Royal Andalusia Palace - Ready Arrangement"
                    submittedAt="Submitted: Yesterday"
                    statusLabel="FINAL AUDIT"
                />
            </Stack>
        </Box>
    );
};

export default PendingApproval;