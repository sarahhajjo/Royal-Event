import React from "react";
import { Box, Typography, Button } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const ActionBar = ({ onSaveDraft, onPublish, isSaving = false, isPublishing = false }) => (
    <Box
        sx={{
            position: "sticky",
            bottom: 0,
            zIndex: 10,
            bgcolor: "background.paper",
            borderTop: "1px solid",
            borderColor: "divider",
            px: 3,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
        }}
    >
        {/* Left hint */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <InfoOutlinedIcon sx={{ fontSize: "0.9rem", color: "text.secondary" }} />
            <Typography sx={{ fontSize: "0.78rem", color: "text.secondary", fontFamily: "'Raleway', sans-serif" }}>
                Changes will be automatically saved as a draft
            </Typography>
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button
                variant="outlined"
                onClick={onSaveDraft}
                disabled={isSaving}
                sx={{ px: 2.5, py: 0.9, fontSize: "0.75rem" }}
            >
                {isSaving ? "Saving..." : "Save as Draft"}
            </Button>
            <Button
                variant="contained"
                onClick={onPublish}
                disabled={isPublishing}
                sx={{ px: 2.5, py: 0.9, fontSize: "0.75rem" }}
            >
                {isPublishing ? "Publishing..." : "Publish to Catalog"}
            </Button>
        </Box>
    </Box>
);

export default ActionBar;