import React, { useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Typography,
} from "@mui/material";
import { T } from "../Theme";

/**
 * RejectReasonDialog — pops up before a reject is confirmed, since the
 * backend requires a reason with every rejection.
 *
 * Props:
 *   open      – boolean
 *   itemTitle – title of the item being rejected (shown for context)
 *   onClose   – () => void
 *   onConfirm – (reason: string) => void
 */
export default function RejectReasonDialog({ open, itemTitle, onClose, onConfirm }) {
    const [reason, setReason] = useState("");

    const handleClose = () => {
        setReason("");
        onClose();
    };

    const handleConfirm = () => {
        if (!reason.trim()) return;
        onConfirm(reason.trim());
        setReason("");
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 700, color: T.textPrimary }}>
                Reject request
            </DialogTitle>
            <DialogContent>
                {itemTitle && (
                    <Typography sx={{ color: T.textMuted, fontSize: "0.85rem", mb: 2 }}>
                        You're rejecting <b>{itemTitle}</b>. Please provide a reason —
                        it will be shared with the submitter.
                    </Typography>
                )}
                <TextField
                    autoFocus
                    fullWidth
                    multiline
                    minRows={3}
                    placeholder="e.g. Missing required documentation"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            fontSize: "0.85rem",
                            "& fieldset": { borderColor: T.inputBorder },
                            "&:hover fieldset": { borderColor: T.gold },
                            "&.Mui-focused fieldset": { borderColor: T.gold },
                        },
                    }}
                />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5 }}>
                <Button onClick={handleClose} sx={{ color: T.textMuted }}>
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirm}
                    disabled={!reason.trim()}
                    variant="contained"
                    sx={{
                        bgcolor: "#C0392B",
                        boxShadow: "none",
                        "&:hover": { bgcolor: "#a5301f", boxShadow: "none" },
                    }}
                >
                    Confirm rejection
                </Button>
            </DialogActions>
        </Dialog>
    );
}
