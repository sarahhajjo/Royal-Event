// features/notificationsSlice.js (أو في المجلد المناسب للـ Layout)
import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        unreadCount: 0,
        notificationsList: [],
        latestToast: null // للإشعار المنبثق اللحظي
    },
    reducers: {
        addNotification: (state, action) => {
            state.unreadCount += 1;
            state.notificationsList.unshift(action.payload);
            state.latestToast = action.payload; // لتشغيل الـ Snackbar
        },
        clearToast: (state) => {
            state.latestToast = null;
        },
        markAllAsRead: (state) => {
            state.unreadCount = 0;
        }
    }
});

export const { addNotification, clearToast, markAllAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;