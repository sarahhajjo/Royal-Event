import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // تأكدي من إعداد axios مع baseURL للـ Laravel

export const fetchDirectory = createAsyncThunk('directory/fetch', async () => {
    const response = await axios.get('/api/admin/directory');
    return response.data;
});

const directorySlice = createSlice({
    name: 'directory',
    initialState: { users: [], status: 'idle' },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchDirectory.fulfilled, (state, action) => {
            state.users = action.payload;
        });
    },
});
export default directorySlice.reducer;