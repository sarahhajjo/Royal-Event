import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
    Box, Tabs, Tab, Typography, Alert, CircularProgress,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Button
} from '@mui/material';
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

const TAB_LABELS = {
    pending: 'Pending Approval',
    accepted: 'Accepted (Unpaid)',
    confirmed: 'Confirmed (Paid)',
    completed: 'Completed',
    cancelled: 'Cancelled',
    rejected: 'Rejected',
};

const RequestPage = ({ onViewRequest }) => {
    const dispatch = useDispatch();
    const activeTab = useSelector(selectActiveTab);
    const requests = useSelector(selectFilteredRequests);
    const loadingStatus = useSelector(selectRequestsLoadingStatus);
    const error = useSelector(selectRequestsError);

    // 💡 حالات التحكم بنافذة الرفض (Dialog State)
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [requestToReject, setRequestToReject] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        if (loadingStatus === 'idle') {
            dispatch(fetchRequests());
        }
    }, [loadingStatus, dispatch]);

    const handleAcceptRequest = (request) => {
        dispatch(updateRequestStatus({ id: request.id, status: 'accepted' }))
            .unwrap()
            .then(() => console.log(`Request ${request.id} accepted successfully!`))
            .catch((err) => console.error("Failed to accept request:", err));
    };

    // 💡 فتح النافذة
    const handleOpenRejectDialog = (request) => {
        setRequestToReject(request);
        setRejectReason('');
        setRejectDialogOpen(true);
    };

    // 💡 إغلاق النافذة
    const handleCloseRejectDialog = () => {
        setRejectDialogOpen(false);
        setRequestToReject(null);
        setRejectReason('');
    };

    // 💡 إرسال الرفض مع السبب
    const submitRejectRequest = () => {
        if (requestToReject && rejectReason.trim() !== '') {
            dispatch(updateRequestStatus({
                id: requestToReject.id,
                status: 'rejected',
                reason: rejectReason
            }))
                .unwrap()
                .then(() => {
                    console.log(`Request ${requestToReject.id} rejected successfully!`);
                    handleCloseRejectDialog();
                })
                .catch((err) => {
                    console.error("Failed to reject request:", err);
                });
        }
    };

    // 💡 الدالة الجديدة المسؤولة عن زر View (لتمرير الـ Listing والتمرير مع الوميض للحجز)
    const handleViewClick = (request) => {
        const listingId = request.listing?.id || request.listing_id;
        if (!listingId) return;

        // إذا كنتِ تمررين بيانات الـ Highlight كـ Callback للأب الرئيسي (App.js أو الحاوية العليا)
        if (onViewRequest) {
            onViewRequest(request);
        }
    };

    return (
        <Box sx={{ px: { xs: 2, md: 6 }, py: 5 }}>
            <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700, mb: 3 }}>
                Request Status Section
            </Typography>

            <Tabs
                value={activeTab}
                onChange={(_, value) => dispatch(setActiveTab(value))}
                textColor="inherit"
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                    mb: 4,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    minHeight: 0,
                    '& .MuiTabs-indicator': { backgroundColor: 'primary.main', height: 2 },
                    '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, color: 'text.secondary', minWidth: 'auto', minHeight: 0, py: 1.5, mr: 4 },
                    '& .Mui-selected': { color: 'primary.main !important' },
                }}
            >
                {STATUS_TABS.map((tab) => (
                    <Tab key={tab} value={tab} label={TAB_LABELS[tab]} />
                ))}
            </Tabs>

            {loadingStatus === 'loading' && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress color="primary" />
                </Box>
            )}

            {loadingStatus === 'failed' && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error || 'Error loading requests'}
                </Alert>
            )}

            {loadingStatus !== 'loading' && requests.length === 0 && (
                <Typography color="text.secondary">No requests found in this category.</Typography>
            )}

            <Box sx={{ maxWidth: 760 }}>
                {requests.map((request) => (
                    <RequestCard
                        key={request.id}
                        request={request}
                        onView={() => handleViewClick(request)} // 💡 ربط زر View بالدالة الجديدة هنا
                        onAccept={handleAcceptRequest}
                        onReject={handleOpenRejectDialog}
                    />
                ))}
            </Box>

            {/* 💡 نافذة (Dialog) طلب سبب الرفض */}
            <Dialog
                open={rejectDialogOpen}
                onClose={handleCloseRejectDialog}
                PaperProps={{ sx: { bgcolor: 'background.paper', borderRadius: 3, minWidth: { xs: '90vw', sm: 400 } } }}
            >
                <DialogTitle sx={{ color: 'error.main', fontWeight: 700 }}>
                    Reject Request
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2, color: 'text.secondary' }}>
                        Please provide a reason for rejecting order #{requestToReject?.orderId || requestToReject?.id?.substring(0, 8)}. This will be sent to the customer.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Cancellation Reason"
                        type="text"
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': { borderColor: 'error.main' },
                            },
                            '& .MuiInputLabel-root.Mui-focused': { color: 'error.main' }
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseRejectDialog} sx={{ color: 'text.secondary' }}>Cancel</Button>
                    <Button
                        onClick={submitRejectRequest}
                        variant="contained"
                        color="error"
                        disabled={rejectReason.trim() === ''}
                    >
                        Confirm Reject
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

RequestPage.propTypes = {
    onViewRequest: PropTypes.func,
};

export default RequestPage;