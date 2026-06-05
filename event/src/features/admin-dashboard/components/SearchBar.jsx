import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ onSearch }) => {
    return (
        <TextField
            fullWidth
            placeholder="SEARCH BY NAME"
            variant="standard"
            onChange={(e) => onSearch(e.target.value)}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#b38c45' }} />
                    </InputAdornment>
                ),
                sx: {
                    fontFamily: 'serif',
                    fontSize: '14px',
                    letterSpacing: '0.1em',
                    paddingBottom: '8px',
                    '&:before': { borderBottom: '1px solid #d1c5b4' },
                    '&:after': { borderBottom: '2px solid #b38c45' }
                }
            }}
            sx={{ mb: 4 }}
        />
    );
};

export default SearchBar;