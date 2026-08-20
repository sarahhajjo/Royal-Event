import React from 'react';
import {
    TextField, RadioGroup, FormControlLabel, Radio, Box,
    Typography, useTheme, Select, MenuItem, Autocomplete
} from '@mui/material';

import {
    GOLD, BROWN_TEXT, MUTED_TEXT,
    LIGHT_CARD, LIGHT_INPUT, LIGHT_BORDER,
    DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_CARD_SHADOW,
    DARK_CARD_HOVER_SHADOW, DARK_SURFACE_BG
} from '../../../../utils/colorConstants';

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

const GeneralInfoForm = ({ formData, setFormData, categories, districts, editMode, originalData }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const getFieldStyle = (fieldKey, currentValue) => {
        let borderColor = isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`;
        if (editMode && originalData) {
            const isModified = String(currentValue || '') !== String(originalData[fieldKey] || '');
            borderColor = isModified ? '#FFC107' : '#4CAF50';
        }

        return {
            backgroundColor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT,
            color: isDark ? '#ffffff' : BROWN_TEXT,
            borderRadius: '4px',
            backdropFilter: 'blur(8px)', // 💡 تغبيش خفيف لحقول الإدخال
            '& .MuiOutlinedInput-root': {
                border: borderColor.includes('solid') ? borderColor : `1px solid ${borderColor}`,
                transition: 'border-color 0.3s ease',
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: 'transparent' },
                '&.Mui-focused': {
                    border: `1px solid ${editMode ? borderColor : GOLD}`,
                    boxShadow: isDark ? '0 0 8px rgba(197, 160, 89, 0.2)' : '0 0 8px rgba(179, 140, 69, 0.25)'
                }
            },
            '& .MuiInputBase-input': { padding: '8px 12px', fontSize: '0.75rem', color: isDark ? '#ffffff' : BROWN_TEXT },
            '& .MuiSelect-select': { padding: '8px 12px', fontSize: '0.75rem', color: isDark ? '#ffffff' : BROWN_TEXT }
        };
    };

    const CustomLabel = ({ children }) => (
        <Typography sx={{ color: GOLD, fontSize: '0.75rem', fontWeight: 'bold', mb: 0.5 }}>
            {children}
        </Typography>
    );

    // 💡 الحل الجذري للقوائم المنسدلة: جعل الـ MenuList شفافاً بالكامل
    const glassMenuProps = {
        PaperProps: {
            sx: {
                bgcolor: 'transparent !important',
                background: isDark ? `${DARK_CARD_BACKGROUND} !important` : `${LIGHT_CARD} !important`,
                border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
                color: isDark ? '#ffffff' : BROWN_TEXT,
                backdropFilter: 'blur(24px) !important',
                WebkitBackdropFilter: 'blur(24px) !important', // لدعم متصفح سفاري
                backgroundImage: 'none !important',
                boxShadow: isDark ? DARK_CARD_SHADOW : '0 18px 40px rgba(130, 100, 40, 0.15)',
            }
        },
        MenuListProps: {
            sx: {
                // 💡 هذا السطر هو الذي سيحل مشكلة اللون الصلب!
                backgroundColor: 'transparent !important',
                p: 1, // مسافة داخلية صغيرة لترتيب العناصر
                '& .MuiMenuItem-root': {
                    borderRadius: '6px', // جعل حواف الخيارات دائرية وأنيقة
                    mb: 0.5,
                    transition: 'all 0.2s ease',
                    '&.Mui-selected': {
                        backgroundColor: isDark ? 'rgba(197, 160, 89, 0.25) !important' : 'rgba(197, 160, 89, 0.15) !important',
                        fontWeight: 'bold',
                        color: GOLD
                    },
                    '&:hover': {
                        backgroundColor: isDark ? 'rgba(197, 160, 89, 0.15)' : 'rgba(197, 160, 89, 0.1)',
                        transform: 'translateX(4px)' // تأثير حركة خفيف عند التمرير
                    }
                }
            }
        }
    };

    return (
        <Box sx={{
            background: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
            borderRadius: '18px',
            border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
            boxShadow: isDark ? DARK_CARD_SHADOW : '0 18px 40px rgba(130, 100, 40, 0.10)',
            backdropFilter: 'blur(20px)', // 💡 تغبيش قوي لخلفية الكرت بالكامل
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: isDark ? DARK_CARD_HOVER_SHADOW : '0 20px 44px rgba(130, 100, 40, 0.2)',
                borderColor: isDark ? 'rgba(197, 160, 89, 0.22)' : 'rgba(197, 160, 89, 0.7)'
            }
        }}>
            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                <Box sx={{ flex: 1 }}>
                    <CustomLabel>EVENT CATEGORY</CustomLabel>
                    <Select
                        variant="outlined"
                        displayEmpty
                        fullWidth
                        value={formData.category_id || ''}
                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                        sx={getFieldStyle('category_id', formData.category_id)}
                        MenuProps={glassMenuProps} // 💡 تطبيق المربع الزجاجي المنسدل
                    >
                        <MenuItem value="" disabled>
                            <Typography sx={{ color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT, fontSize: '0.75rem' }}>Select Category...</Typography>
                        </MenuItem>
                        {categories && categories.length > 0 ? (
                            categories.map(cat => {
                                const catName = typeof cat.name === 'object' ? (cat.name?.en || cat.name?.ar) : cat.name;
                                return (
                                    <MenuItem key={cat.id} value={cat.id}>{catName || `Category ${cat.id}`}</MenuItem>
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
                        variant="outlined"
                        displayEmpty
                        fullWidth
                        value={formData.district_id || ''}
                        onChange={(e) => setFormData({ ...formData, district_id: e.target.value })}
                        sx={getFieldStyle('district_id', formData.district_id)}
                        MenuProps={glassMenuProps} // 💡 تطبيق المربع الزجاجي المنسدل
                    >
                        <MenuItem value="" disabled>
                            <Typography sx={{ color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT, fontSize: '0.75rem' }}>Select District...</Typography>
                        </MenuItem>
                        {districts && districts.length > 0 ? (
                            districts.map(dist => {
                                const distName = typeof dist.name === 'object' ? (dist.name?.en || dist.name?.ar) : dist.name;
                                return (
                                    <MenuItem key={dist.id} value={dist.id}>{distName || `District ${dist.id}`}</MenuItem>
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
                        // 💡 تطبيق المربع الزجاجي للـ Autocomplete
                        slotProps={{
                            paper: {
                                sx: {
                                    background: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
                                    color: isDark ? '#ffffff' : BROWN_TEXT,
                                    border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
                                    fontSize: '0.75rem',
                                    backdropFilter: 'blur(20px)',
                                    boxShadow: isDark ? DARK_CARD_SHADOW : '0 18px 40px rgba(130, 100, 40, 0.15)'
                                }
                            }
                        }}
                    />
                </Box>

                <RadioGroup row value={formData.price_type || 'fixed'} onChange={e => setFormData({...formData, price_type: e.target.value})} sx={{ color: isDark ? '#ffffff' : BROWN_TEXT, mb: 1, flexShrink: 0 }}>
                    <FormControlLabel value="per_hour" control={<Radio size="small" sx={{ color: editMode && originalData?.price_type !== formData.price_type ? '#FFC107' : (editMode ? '#4CAF50' : GOLD) }} />} label="Hourly" sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.75rem' } }} />
                    <FormControlLabel value="fixed" control={<Radio size="small" sx={{ color: editMode && originalData?.price_type !== formData.price_type ? '#FFC107' : (editMode ? '#4CAF50' : GOLD) }} />} label="Fixed" sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.75rem' } }} />
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