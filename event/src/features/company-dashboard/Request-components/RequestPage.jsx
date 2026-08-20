import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
    Box, Tabs, Tab, Typography, Alert, CircularProgress,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Button,
    FormControlLabel, Switch, Stack
} from '@mui/material';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import {
    STATUS_TABS,
    setActiveTab,
    selectActiveTab,
    selectFilteredRequests,
    selectRequestsLoadingStatus,
    selectRequestsError,
    fetchRequests,
    updateRequestStatus,
} from './RequestSlice';
import RequestCard from './component/RequestCard';
import { blockDate } from '../MyCalender/MyCalendarSlice.js';
import { useTheme, alpha } from '@mui/material/styles';

// 💡 الألوان الزجاجية والثوابت
import {
    GOLD, BROWN_TEXT, MUTED_TEXT,
    LIGHT_CARD, LIGHT_BORDER, LIGHT_INPUT,
    DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_SURFACE_BG
} from '../../../utils/colorConstants';

const TAB_LABELS = {
    pending: 'Pending Approval',
    accepted: 'Accepted (Unpaid)',
    confirmed: 'Confirmed (Paid)',
    completed: 'Completed',
    cancelled: 'Cancelled',
    rejected: 'Rejected',
};

const RequestPage = ({ onViewRequest }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const dispatch = useDispatch();

    const activeTab = useSelector(selectActiveTab);
    const requests = useSelector(selectFilteredRequests);
    const loadingStatus = useSelector(selectRequestsLoadingStatus);
    const error = useSelector(selectRequestsError);

    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [requestToReject, setRequestToReject] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
    const [requestToAccept, setRequestToAccept] = useState(null);
    const [addToCalendar, setAddToCalendar] = useState(true);
    const [isAccepting, setIsAccepting] = useState(false);

    useEffect(() => {
        if (loadingStatus === 'idle') {
            dispatch(fetchRequests());
        }
    }, [loadingStatus, dispatch]);

    const handleOpenAcceptDialog = (request) => {
        setRequestToAccept(request);
        setAddToCalendar(true);
        setAcceptDialogOpen(true);
    };

    const handleCloseAcceptDialog = () => {
        setAcceptDialogOpen(false);
        setRequestToAccept(null);
    };

    const submitAcceptRequest = async () => {
        if (!requestToAccept) return;
        setIsAccepting(true);

        try {
            await dispatch(updateRequestStatus({ id: requestToAccept.id, status: 'accepted' })).unwrap();

            if (addToCalendar) {
                const shift = requestToAccept.shift;
                const customerName = requestToAccept.customerName || 'Client';
                const eventName = requestToAccept.eventType || 'Booking';

                const calendarPayload = {
                    date: dayjs(requestToAccept.booked_date).format('YYYY-MM-DD'),
                    isAllDay: !shift,
                    shifts: shift ? [{ start: shift.start_time.substring(0, 5), end: shift.end_time.substring(0, 5) }] : [],
                    note: `${eventName} - ${customerName} (#${requestToAccept.orderId})`
                };

                await dispatch(blockDate(calendarPayload)).unwrap();
            }
            handleCloseAcceptDialog();
        } catch (err) {
            console.error("Failed to accept or add to calendar:", err);
        } finally {
            setIsAccepting(false);
        }
    };

    const handleOpenRejectDialog = (request) => {
        setRequestToReject(request);
        setRejectReason('');
        setRejectDialogOpen(true);
    };

    const handleCloseRejectDialog = () => {
        setRejectDialogOpen(false);
        setRequestToReject(null);
        setRejectReason('');
    };

    const submitRejectRequest = () => {
        if (requestToReject && rejectReason.trim() !== '') {
            dispatch(updateRequestStatus({ id: requestToReject.id, status: 'rejected', reason: rejectReason }))
                .unwrap().then(() => handleCloseRejectDialog()).catch((err) => console.error(err));
        }
    };

    const handleViewClick = (request) => {
        const listingId = request.listing?.id || request.listing_id;
        if (!listingId) return;
        if (onViewRequest) onViewRequest(request);
    };

    const dialogPaperProps = {
        sx: {
            background: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
            backdropFilter: 'blur(16px)',
            border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
            borderRadius: 3,
            minWidth: { xs: '90vw', sm: 400 },
            backgroundImage: 'none'
        }
    };

    return (
        <Box sx={{ px: { xs: 2, md: 0.1 }, py: 5 , mt:-6 }}>

            {/* ── 💡 الترويسة المحدثة (العنوان مع المعين والنص الوصفي) ── */}
            <Box sx={{ mb: 4, textAlign: 'left' }}>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1, mb: 1 }}>
                        <Box
                            sx={{
                                width: 14,
                                height: 14,
                                // 💡 بني بالفاتح، وذهبي بالداكن
                                border: `2px solid ${isDark ? theme.palette.primary.main : BROWN_TEXT}`,
                                transform: 'rotate(45deg)',
                                boxShadow: `0 0 10px ${isDark ? theme.palette.primary.main + '40' : 'rgba(74, 59, 50, 0.2)'}`,
                                flexShrink: 0
                            }}
                        />

                        <Typography
                            variant="h3"
                            sx={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '2.5rem',
                                // 💡 بني بالفاتح، وذهبي بالداكن
                                color: isDark ? theme.palette.primary.main : BROWN_TEXT,
                                fontWeight: 50,
                                m: 0
                            }}
                        >
                            Request Status Section
                        </Typography>
                    </Box>

                <Typography
                    variant="body2"
                    sx={{
                        color: isDark ? 'rgba(255,255,255,0.7)' : BROWN_TEXT,
                        fontWeight: 500,
                        lineHeight: 1.6,
                        letterSpacing: '0.02em',
                        maxWidth: 700
                    }}
                >
                    Manage and track all your incoming booking and service requests seamlessly.
                </Typography>
            </Box>

            {/* ── 💡 التبويبات (Tabs) ── */}
            <Tabs
                value={activeTab}
                onChange={(_, value) => dispatch(setActiveTab(value))}
                textColor="inherit"
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                    mb: 4,
                    borderBottom: '1px solid',
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : LIGHT_BORDER,
                    minHeight: 0,
                    '& .MuiTabs-indicator': { backgroundColor: isDark ? GOLD : BROWN_TEXT, height: 2 },
                    '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, minWidth: 'auto', minHeight: 0, py: 1.5, mr: 4 },
                    '& .Mui-selected': { color: isDark ? `${GOLD} !important` : `${BROWN_TEXT} !important`, fontWeight: 800 },
                }}
            >
                {STATUS_TABS.map((tab) => (
                    <Tab key={tab} value={tab} label={TAB_LABELS[tab]} />
                ))}
            </Tabs>

            {loadingStatus === 'loading' && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress sx={{ color: isDark ? GOLD : BROWN_TEXT }} />
                </Box>
            )}

            {loadingStatus === 'failed' && (
                <Alert severity="error" sx={{ mb: 3, bgcolor: alpha('#ef5350', 0.1), color: '#ef5350', border: `1px solid ${alpha('#ef5350', 0.3)}` }}>
                    {error || 'Error loading requests'}
                </Alert>
            )}

            {loadingStatus !== 'loading' && requests.length === 0 && (
                <Typography sx={{ color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT, fontStyle: 'italic' }}>No requests found in this category.</Typography>
            )}

            <Box sx={{ maxWidth: 760 }}>
                {requests.map((request) => (
                    <RequestCard
                        key={request.id}
                        request={request}
                        onView={() => handleViewClick(request)}
                        onAccept={handleOpenAcceptDialog}
                        onReject={handleOpenRejectDialog}
                    />
                ))}
            </Box>

            {/* ── 💡 نافذة (Dialog) قبول الحجز ── */}
            <Dialog open={acceptDialogOpen} onClose={!isAccepting ? handleCloseAcceptDialog : undefined} PaperProps={dialogPaperProps}>
                <DialogTitle sx={{ color: '#4caf50', fontWeight: 700, fontFamily: "'Playfair Display', serif", fontSize: '1.5rem' }}>
                    Accept Booking Request
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 3, color: isDark ? 'rgba(255,255,255,0.7)' : BROWN_TEXT }}>
                        You are about to accept order #{requestToAccept?.orderId}. The customer will be notified to proceed with the payment.
                    </DialogContentText>

                    <Box sx={{ p: 2, background: isDark ? DARK_SURFACE_BG : LIGHT_INPUT, borderRadius: 2, border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}` }}>
                        <FormControlLabel
                            control={<Switch checked={addToCalendar} onChange={(e) => setAddToCalendar(e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: GOLD }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: GOLD } }} />}
                            label={
                                <Box>
                                    <Typography sx={{ fontWeight: 600, color: isDark ? '#ffffff' : BROWN_TEXT, fontSize: '0.95rem' }}>
                                        Add to MyCalendar
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT }}>
                                        Automatically block this date & time in your schedule.
                                    </Typography>
                                </Box>
                            }
                            sx={{ m: 0, width: '100%', display: 'flex', justifyContent: 'space-between', flexDirection: 'row-reverse' }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseAcceptDialog} sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT }} disabled={isAccepting}>
                        Cancel
                    </Button>
                    <Button onClick={submitAcceptRequest} variant="contained" disabled={isAccepting} sx={{ bgcolor: '#4caf50', color: '#fff', fontWeight: 'bold', '&:hover':{bgcolor: '#388e3c'} }}>
                        {isAccepting ? <CircularProgress size={24} color="inherit" /> : 'Confirm & Accept'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── 💡 نافذة (Dialog) طلب سبب الرفض ── */}
            <Dialog open={rejectDialogOpen} onClose={handleCloseRejectDialog} PaperProps={dialogPaperProps}>
                <DialogTitle sx={{ color: '#ef5350', fontWeight: 700, fontFamily: "'Playfair Display', serif", fontSize: '1.5rem' }}>
                    Reject Request
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2, color: isDark ? 'rgba(255,255,255,0.7)' : BROWN_TEXT }}>
                        Please provide a reason for rejecting order #{requestToReject?.orderId || requestToReject?.id?.substring(0, 8)}. This will be sent to the customer.
                    </DialogContentText>
                    <TextField
                        autoFocus margin="dense" label="Cancellation Reason" type="text" fullWidth multiline rows={3} variant="outlined"
                        value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT,
                                color: isDark ? '#ffffff' : BROWN_TEXT,
                                '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.1)' : LIGHT_BORDER },
                                '&:hover fieldset': { borderColor: '#ef5350' },
                                '&.Mui-focused fieldset': { borderColor: '#ef5350' },
                            },
                            '& .MuiInputLabel-root': { color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#ef5350' }
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseRejectDialog} sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT }}>Cancel</Button>
                    <Button onClick={submitRejectRequest} variant="contained" disabled={rejectReason.trim() === ''} sx={{ bgcolor: '#ef5350', color: '#fff', fontWeight: 'bold', '&:hover':{bgcolor: '#d32f2f'} }}>
                        Confirm Reject
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

RequestPage.propTypes = { onViewRequest: PropTypes.func };

export default RequestPage;