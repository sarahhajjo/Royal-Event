import React from "react";
import { Box } from "@mui/material";

const STATUS_STYLES = {
  pending: { bgcolor: 'rgba(212, 175, 55, 0.1)', color: 'primary.main', borderColor: 'rgba(212, 175, 55, 0.3)' },
  approved: { bgcolor: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', borderColor: 'rgba(74, 222, 128, 0.3)' },
  rejected: { bgcolor: 'rgba(248, 113, 113, 0.1)', color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.3)' },
};

export default function StatusPill({ label = "Pending Approval", variant = "pending" }) {
  const currentStyle = STATUS_STYLES[variant] ?? STATUS_STYLES.pending;

  return (
      <Box
          component="span"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: '999px',
            border: '1px solid',
            borderColor: currentStyle.borderColor,
            bgcolor: currentStyle.bgcolor,
            color: currentStyle.color,
            px: 2,
            py: 0.5,
            fontSize: '0.65rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontFamily: "'Raleway', sans-serif"
          }}
      >
        {label}
      </Box>
  );
}