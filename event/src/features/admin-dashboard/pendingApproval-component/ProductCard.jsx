import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { T, typography } from "../theme";
import StatusBadge from "./StatusBadge";
import ActionButtons from "./ActionButtons";

/**
 * ProductCard
 * One row in the approval queue: thumbnail, identity, meta fields,
 * description snippet, price, and action buttons.
 *
 * Expected `item` shape:
 * {
 *   id, type: "SERVICE"|"PRODUCT", location, image, title, ownerName,
 *   price, priceUnit, originalName, category, status,
 *   description
 * }
 */
export default function ProductCard({ item, onApprove, onReject, onViewDetails }) {
    const {
        type,
        location,
        image,
        title,
        ownerName,
        price,
        priceUnit,
        originalName,
        category,
        status,
        description,
    } = item;

    return (
        <Box
            sx={{
                bgcolor: T.cardBg,
                border: `1px solid ${T.border}`,
                borderRadius: "14px",
                p: 3,
                display: "flex",
                gap: 2.5,
                mb: 3,
            }}
        >
            {/* Thumbnail */}
            <Box
                component="img"
                src={image}
                alt={title}
                sx={{
                    width: 110,
                    height: 110,
                    borderRadius: "10px",
                    objectFit: "cover",
                    flexShrink: 0,
                    filter: T.avatarFilter,
                }}
            />

            {/* Identity + meta */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <StatusBadge type={type} location={location} />

                <Typography
                    sx={{
                        ...typography.rowName,
                        fontSize: "1.15rem",
                        color: T.textPrimary,
                        fontFamily: typography.fontFamily,
                    }}
                >
                    {title}
                </Typography>
                <Typography
                    sx={{
                        fontSize: "0.82rem",
                        fontStyle: "italic",
                        color: T.textMuted,
                        fontFamily: typography.fontFamily,
                        mb: 1.5,
                    }}
                >
                    {ownerName}
                </Typography>

                <Box sx={{ display: "flex", gap: 5, mb: 1.5 }}>
                    {category && (
                        <Box>
                            <Typography sx={{ ...typography.colHeader, fontFamily: typography.fontFamily }}>
                                Category
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "0.85rem",
                                    color: T.textPrimary,
                                    fontFamily: typography.fontFamily,
                                    mt: 0.3,
                                }}
                            >
                                {category}
                            </Typography>
                        </Box>
                    )}

                    {originalName && (
                        <Box>
                            <Typography sx={{ ...typography.colHeader, fontFamily: typography.fontFamily }}>
                                Original Name
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "0.85rem",
                                    color: T.textPrimary,
                                    fontFamily: typography.fontFamily,
                                    mt: 0.3,
                                    direction: "rtl",
                                }}
                            >
                                {originalName}
                            </Typography>
                        </Box>
                    )}

                    {status && (
                        <Box>
                            <Typography sx={{ ...typography.colHeader, fontFamily: typography.fontFamily }}>
                                Status
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "0.85rem",
                                    color: T.textPrimary,
                                    fontFamily: typography.fontFamily,
                                    mt: 0.3,
                                }}
                            >
                                {status}
                            </Typography>
                        </Box>
                    )}
                </Box>

                {description && (
                    <Box>
                        <Typography sx={{ ...typography.colHeader, fontFamily: typography.fontFamily, mb: 0.5 }}>
                            Description Snippet
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: "0.82rem",
                                lineHeight: 1.7,
                                color: T.textMuted,
                                fontFamily: typography.fontFamily,
                                direction: "rtl",
                                textAlign: "right",
                            }}
                        >
                            {description}
                        </Typography>
                    </Box>
                )}
            </Box>

            <Divider orientation="vertical" flexItem sx={{ borderColor: T.border }} />

            {/* Price + actions */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    minWidth: 170,
                    flexShrink: 0,
                }}
            >
                <Box sx={{ textAlign: "right", mb: 2 }}>
                    <Typography
                        sx={{
                            fontWeight: 800,
                            fontSize: "1.05rem",
                            color: T.textPrimary,
                            fontFamily: typography.fontFamily,
                        }}
                    >
                        {price}
                    </Typography>
                    {priceUnit && (
                        <Typography
                            sx={{
                                fontSize: "0.65rem",
                                fontWeight: 600,
                                letterSpacing: 1,
                                textTransform: "uppercase",
                                color: T.textMuted,
                                fontFamily: typography.fontFamily,
                            }}
                        >
                            {priceUnit}
                        </Typography>
                    )}
                </Box>

                <ActionButtons
                    onApprove={() => onApprove?.(item)}
                    onReject={() => onReject?.(item)}
                    onViewDetails={() => onViewDetails?.(item)}
                />
            </Box>
        </Box>
    );
}