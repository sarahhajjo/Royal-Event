import React from "react";
import { Box, Typography } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const PageBreadcrumb = ({ crumbs = [], title = "", subtitle = "" }) => (
    <Box sx={{ mb: 3 }}>
        {/* Breadcrumb trail */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}>
            {crumbs.map((crumb, i) => (
                <React.Fragment key={i}>
                    <Typography
                        sx={{
                            fontSize: "0.72rem",
                            fontFamily: "'Raleway', sans-serif",
                            color: crumb.onClick ? "primary.main" : "text.secondary",
                            cursor: crumb.onClick ? "pointer" : "default",
                            letterSpacing: "0.04em",
                            "&:hover": crumb.onClick ? { textDecoration: "underline" } : {},
                        }}
                        onClick={crumb.onClick}
                    >
                        {crumb.label}
                    </Typography>
                    {i < crumbs.length - 1 && (
                        <ChevronRightIcon sx={{ fontSize: "0.8rem", color: "text.secondary", opacity: 0.5 }} />
                    )}
                </React.Fragment>
            ))}
        </Box>

        {/* Page title */}
        <Typography
            sx={{
                fontFamily: "'Cinzel', serif",
                fontSize: { xs: "1.6rem", md: "2rem" },
                color: "primary.main",
                fontWeight: 600,
                lineHeight: 1.2,
                mb: 0.8,
            }}
        >
            {title}
        </Typography>

        {subtitle && (
            <Typography sx={{ fontSize: "0.85rem", color: "text.secondary", fontFamily: "'Raleway', sans-serif" }}>
                {subtitle}
            </Typography>
        )}
    </Box>
);

export default PageBreadcrumb;