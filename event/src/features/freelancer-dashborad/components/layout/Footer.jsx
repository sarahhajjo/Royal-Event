import React from "react";
import { Box, Typography, Link, Stack, Divider } from "@mui/material";

const Footer = () => (
    <Box sx={{ mt: 4, pb: 3 }}>
        <Divider sx={{ borderColor: "divider", mb: 3 }} />
        <Stack spacing={1} alignItems="center">
            <Typography
                variant="body2"
                sx={{ color: "primary.main", fontFamily: "'Cinzel', serif", fontSize: "0.8rem" }}
            >
                Royal Events
            </Typography>
            <Stack direction="row" spacing={3}>
                {["Terms of Service", "Privacy Policy", "Community Standards"].map((item) => (
                    <Link
                        key={item}
                        href="#"
                        underline="hover"
                        sx={{ color: "text.secondary", fontSize: "0.72rem", fontFamily: "'Raleway', sans-serif" }}
                    >
                        {item}
                    </Link>
                ))}
            </Stack>
            <Typography variant="caption" sx={{ color: "text.secondary", opacity: 0.4 }}>
                © 2024 Royal Events. All Rights Reserved.
            </Typography>
        </Stack>
    </Box>
);

export default Footer;