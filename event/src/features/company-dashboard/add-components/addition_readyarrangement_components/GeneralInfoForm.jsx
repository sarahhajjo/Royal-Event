import React from 'react';
import {
    TextField, RadioGroup, FormControlLabel, Radio, Box,
    Typography, useTheme, Select, MenuItem, Autocomplete
} from '@mui/material';

const generateWorldCurrencies = () => {
    try {
        const currencyCodes = Intl.supportedValuesOf('currency');
        const currencyNames = new Intl.DisplayNames(['en'], { type: 'currency' });
        return currencyCodes.map(code => ({
            code: code,
            label: currencyNames.of(code) || code
        })).sort((a, b) => a.code.localeCompare(b.code));
    } catch (error) {
        return [
            { code: 'SAR', label: 'Saudi Riyal' },
            { code: 'USD', label: 'US Dollar' },
            { code: 'EUR', label: 'Euro' },
            { code: 'AED', label: 'United Arab Emirates Dirham' },
        ];
    }
};

const currencies = generateWorldCurrencies();

// 💡 استقبال editMode و originalData
const GeneralInfoForm = ({ formData, setFormData, categories, districts, editMode, originalData }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // 💡 دالة التلوين الذكية
    const getFieldStyle = (fieldKey, currentValue) => {
        let borderColor = isDark ? 'rgba(78, 70, 57, 0.3)' : 'rgba(179, 140, 69, 0.35)';
        if (editMode && originalData) {
            const isModified = String(currentValue || '') !== String(originalData[fieldKey] || '');
            borderColor = isModified ? '#FFC107' : '#4CAF50';
        }

        return {
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)',
            color: theme.palette.text.primary,
            borderRadius: '4px',
            '& .MuiOutlinedInput-root': {
                border: `1px solid ${borderColor}`,
                transition: 'border-color 0.3s ease',
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: 'transparent' },
                '&.Mui-focused': {
                    border: `1px solid ${editMode ? borderColor : (isDark ? '#c5a059' : '#b38c45')}`,
                    boxShadow: isDark ? '0 0 8px rgba(197, 160, 89, 0.2)' : '0 0 8px rgba(179, 140, 69, 0.25)'
                }
            },
            '& .MuiInputBase-input': { padding: '8px 12px', fontSize: '0.75rem' },
            '& .MuiSelect-select': { padding: '8px 12px', fontSize: '0.75rem' }
        };
    };

    const CustomLabel = ({ children }) => (
        <Typography sx={{ color: theme.palette.primary.main, fontSize: '0.75rem', fontWeight: 'bold', mb: 0.5 }}>
            {children}
        </Typography>
    );

    return (
        <Box sx={{ bgcolor: isDark? '#261d19' : '#E5D9B8', display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                <Box sx={{ flex: 1 }}>
                    <CustomLabel>EVENT CATEGORY</CustomLabel>
                    <Select
                        displayEmpty
                        fullWidth
                        value={formData.category_id || ''}
                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                        sx={getFieldStyle('category_id', formData.category_id)}
                    >
                        <MenuItem value="" disabled>
                            <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>Select Category...</Typography>
                        </MenuItem>
                        {categories && categories.length > 0 ? (
                            categories.map(cat => {
                                // 💡 استخراج الاسم الصحيح للـ Category
                                const catName = typeof cat.name === 'object' ? (cat.name?.en || cat.name?.ar) : cat.name;
                                return (
                                    <MenuItem key={cat.id} value={cat.id}>
                                        {catName || `Category ${cat.id}`}
                                    </MenuItem>
                                );
                            })
                        ) : (
                            <MenuItem disabled>No Categories Found</MenuItem>
                        )}
                    </Select>
                </Box>

                <Box sx={{ flex: 1 }}>
                    <CustomLabel>DISTRICT</CustomLabel>
                    <Select
                        displayEmpty
                        fullWidth
                        value={formData.district_id || ''}
                        onChange={(e) => setFormData({ ...formData, district_id: e.target.value })}
                        sx={getFieldStyle('district_id', formData.district_id)}
                    >
                        <MenuItem value="" disabled>
                            <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>Select District...</Typography>
                        </MenuItem>
                        {districts && districts.length > 0 ? (
                            districts.map(dist => {
                                // 💡 استخراج الاسم الصحيح للـ District
                                const distName = typeof dist.name === 'object' ? (dist.name?.en || dist.name?.ar) : dist.name;
                                return (
                                    <MenuItem key={dist.id} value={dist.id}>
                                        {distName || `District ${dist.id}`}
                                    </MenuItem>
                                );
                            })
                        ) : (
                            <MenuItem disabled>No Districts Found</MenuItem>
                        )}
                    </Select>
                </Box>

                <Box sx={{ flex: 1.5 }}>
                    <CustomLabel>ARRANGEMENT TITLE</CustomLabel>
                    <TextField fullWidth placeholder="e.g. Golden Hour..." value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} sx={getFieldStyle('title', formData.title)} />
                </Box>
            </Box>

            <CustomLabel>DESCRIPTION</CustomLabel>
            <TextField fullWidth multiline rows={3} placeholder="Describe the exclusive nature..." value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} sx={getFieldStyle('description', formData.description)} />

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', width: '100%' }}>
                <Box sx={{ flex: 1 }}>
                    <CustomLabel>BOOKING PRICE</CustomLabel>
                    <TextField fullWidth type="number" placeholder="0.00" value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} sx={getFieldStyle('price', formData.price)} />
                </Box>

                <Box sx={{ flex: 1 }}>
                    <CustomLabel>CURRENCY</CustomLabel>
                    <Autocomplete
                        options={currencies}
                        getOptionLabel={(option) => `${option.code} - ${option.label}`}
                        value={currencies.find(c => c.code === formData.currency) || null}
                        onChange={(event, newValue) => {
                            setFormData({ ...formData, currency: newValue ? newValue.code : '' });
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Search currency..."
                                sx={{
                                    ...getFieldStyle('currency', formData.currency),
                                    '& .MuiOutlinedInput-root': {
                                        ...getFieldStyle('currency', formData.currency)['& .MuiOutlinedInput-root'],
                                        padding: '1.5px 8px',
                                    }
                                }}
                            />
                        )}
                        componentsProps={{
                            paper: { sx: { bgcolor: isDark ? '#261d19' : '#fff', color: theme.palette.text.primary, border: isDark ? '1px solid rgba(197, 160, 89, 0.3)' : '1px solid rgba(179, 140, 69, 0.3)', fontSize: '0.75rem' } }
                        }}
                    />
                </Box>

                <RadioGroup row value={formData.price_type || 'fixed'} onChange={e => setFormData({...formData, price_type: e.target.value})} sx={{ color: theme.palette.text.primary, mb: 1, flexShrink: 0 }}>
                    <FormControlLabel value="per_hour" control={<Radio size="small" sx={{ color: editMode && originalData?.price_type !== formData.price_type ? '#FFC107' : (editMode ? '#4CAF50' : theme.palette.primary.main) }} />} label="Hourly" sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.75rem' } }} />
                    <FormControlLabel value="fixed" control={<Radio size="small" sx={{ color: editMode && originalData?.price_type !== formData.price_type ? '#FFC107' : (editMode ? '#4CAF50' : theme.palette.primary.main) }} />} label="Fixed" sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.75rem' } }} />
                </RadioGroup>

                <Box sx={{ flex: 1 }}>
                    <CustomLabel>CAPACITY (GUESTS)</CustomLabel>
                    <TextField fullWidth type="number" placeholder="Max guests" value={formData.capacity || ''} onChange={e => setFormData({...formData, capacity: e.target.value})} sx={getFieldStyle('capacity', formData.capacity)} />
                </Box>
            </Box>
        </Box>
    );
};

export default GeneralInfoForm;