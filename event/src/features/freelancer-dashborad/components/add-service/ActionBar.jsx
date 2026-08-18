import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const ActionBar = ({ onSaveDraft, onPublish, isSaving = false, isPublishing = false }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                position: "sticky",
                bottom: 0,
                zIndex: 10,
                // 👑 خلفية زجاجية متسقة تتفاعل مع الثيم (داكن / فاتح)
                bgcolor: theme.palette.mode === 'dark' ? "rgba(15, 15, 20, 0.75) !important" : "rgba(250, 248, 245, 0.85) !important",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderTop: "1px solid",
                borderColor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
                px: 4,
                py: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <InfoOutlinedIcon sx={{ fontSize: "0.9rem", color: theme.palette.text.secondary }} />
                <Typography sx={{ fontSize: "0.78rem", color: theme.palette.text.secondary, fontFamily: "'Raleway', sans-serif" }}>
                    Changes will be automatically saved as a draft
                </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1.5 }}>
                <Button
                    variant="outlined"
                    onClick={onSaveDraft}
                    disabled={isSaving}
                    sx={{
                        px: 3,
                        py: 1,
                        fontSize: "0.78rem",
                        borderColor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
                        color: theme.palette.text.primary,
                        "&:hover": {
                            borderColor: "primary.main",
                            bgcolor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)"
                        }
                    }}
                >
                    {isSaving ? "Saving..." : "Save as Draft"}
                </Button>
                <Button
                    variant="contained"
                    onClick={onPublish}
                    disabled={isPublishing}
                    sx={{ px: 3, py: 1, fontSize: "0.78rem" }}
                >
                    {isPublishing ? "Publishing..." : "Publish to Catalog"}
                </Button>
            </Box>
        </Box>
    );
};

ActionBar.displayName = "ActionBar";
export default ActionBar;