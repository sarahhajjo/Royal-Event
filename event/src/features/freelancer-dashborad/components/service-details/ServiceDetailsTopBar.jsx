import React from "react";
import { Box, Typography, Button, IconButton, useTheme } from "@mui/material";
import { ChevronLeft, Bell } from "lucide-react";
import StatusPill from "./StatusPill";

export default function ServiceDetailsTopBar({
                                               serviceId,
                                               status = "pending",
                                               statusLabel = "Pending Approval",
                                               onBack,
                                               onEditService,
                                             }) {
  const theme = useTheme();

  return (
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, sm: { alignItems: 'center', justifyContent: 'space-between' }, gap: 2, borderBottom: '1px solid', borderColor: theme.palette.divider, pb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
              onClick={onBack}
              aria-label="الرجوع للخلف"
              sx={{ color: theme.palette.text.secondary, borderRadius: '10px', '&:hover': { bgcolor: 'action.hover', color: theme.palette.text.primary } }}
          >
            <ChevronLeft size={20} />
          </IconButton>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: theme.palette.text.primary, fontFamily: "'Cinzel', serif" }}>Service Details</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <StatusPill label={statusLabel} variant={status} />
          <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary }}>Service ID: #{serviceId}</Typography>

          <IconButton
              aria-label="الإشعارات"
              sx={{ color: theme.palette.text.secondary, borderRadius: '10px', '&:hover': { bgcolor: 'action.hover', color: theme.palette.text.primary } }}
          >
            <Bell size={18} />
          </IconButton>

          <Button
              onClick={onEditService}
              variant="contained"
              sx={{ borderRadius: '10px', px: 3, py: 0.8, fontSize: '0.8rem', fontWeight: 700, textTransform: 'none' }}
          >
            Edit Service
          </Button>
        </Box>
      </Box>
  );
}