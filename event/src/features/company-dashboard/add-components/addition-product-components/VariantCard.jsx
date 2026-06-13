import React, { useRef, useState } from 'react';
import {Paper, Box, Typography, alpha, Chip, Button, Switch, FormControlLabel, Autocomplete} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import CustomInputField from './CustomInputField.jsx';
import { StaticDatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { createFilterOptions } from '@mui/material/Autocomplete';
// 👈 تأكدي من ضبط مسار استيراد الخدمة حسب مشروعك
import additionService from '../../../../services/companyService/additionService';
import TextField from "@mui/material/TextField";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import currencyCodes from 'currency-codes'; // 👈 استيراد المكتبة

const VariantCard = ({ index, variantData, hasVariants, onUpdate, onUpdateFullObject, isSingle }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const fileInputRef = useRef(null);

    const [draftStart, setDraftStart] = useState(null);
    const [draftEnd, setDraftEnd] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const excludedDates = variantData?.excludedDates || [];
    const shiftRanges = variantData?.shiftRanges || [];
    const isAllDay = variantData?.isAllDay || false;
    const images = variantData?.images || [];
    const filter = createFilterOptions();

    const allCurrencies = currencyCodes.data.map(c => ({
        label: `${c.code} - ${c.currency}`,
        code: c.code
    }));

    const updateVariant = (updates) => {
        onUpdateFullObject(index, { ...variantData, ...updates });
    };

    // ─── منطق الروزنامة ───
    const handleDateClick = (clickedDate) => {
        if (!clickedDate) return;
        const dateStr = clickedDate.format('YYYY-MM-DD');
        const { startDate, endDate } = variantData;

        if (startDate && endDate && clickedDate.isAfter(startDate, 'day') && clickedDate.isBefore(endDate, 'day')) {
            const newExcluded = excludedDates.includes(dateStr) ? excludedDates.filter(d => d !== dateStr) : [...excludedDates, dateStr];
            updateVariant({ excludedDates: newExcluded });
            return;
        }

        if (!startDate || (startDate && endDate)) {
            updateVariant({ startDate: clickedDate, endDate: null, excludedDates: [] });
        } else if (startDate && !endDate) {
            if (clickedDate.isBefore(startDate, 'day')) {
                updateVariant({ startDate: clickedDate, endDate: null, excludedDates: [] });
            } else {
                updateVariant({ endDate: clickedDate });
            }
        }
    };

    const renderCustomDay = (dayProps) => {
        const { day, outsideCurrentMonth, disabled, ...other } = dayProps;
        if (outsideCurrentMonth) return <Box sx={{ flex: 1, height: '40px', m: '0 2px' }} />;

        const dateStr = day.format('YYYY-MM-DD');
        const isExcluded = excludedDates.includes(dateStr);
        const isStart = variantData.startDate && day.isSame(variantData.startDate, 'day');
        const isEnd = variantData.endDate && day.isSame(variantData.endDate, 'day');
        const isBetween = variantData.startDate && variantData.endDate && day.isAfter(variantData.startDate, 'day') && day.isBefore(variantData.endDate, 'day');
        const isToday = dayjs().isSame(day, 'day');

        let bgColor = 'transparent', borderStyle = 'none', textColor = isDark ? '#eee0da' : '#2B211E';

        if (disabled) { textColor = isDark ? alpha('#eee0da', 0.2) : alpha('#2B211E', 0.2); }
        else if (isStart || isEnd) { bgColor = theme.palette.primary.main; textColor = '#131110'; }
        else if (isBetween) {
            if (isExcluded) { borderStyle = `2px solid ${theme.palette.primary.main}`; textColor = theme.palette.primary.main; }
            else { bgColor = alpha(theme.palette.primary.main, 0.15); textColor = theme.palette.primary.main; }
        }
        if (isToday && !isStart && !isEnd && !isBetween) { borderStyle = `1px solid ${theme.palette.text.primary}`; }

        return (
            <Box sx={{ flex: 1, height: '40px', m: '0 2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box {...other} onClick={(e) => { e.stopPropagation(); e.preventDefault(); if (!disabled) handleDateClick(day); }}
                     sx={{ backgroundColor: bgColor, border: borderStyle, borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: disabled ? 'default' : 'pointer', color: textColor, opacity: disabled ? 0.6 : 1, fontSize: '0.85rem', '&:hover': { backgroundColor: disabled ? 'transparent' : (isStart || isEnd) ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.3) } }}
                >
                    {day.date()}
                </Box>
            </Box>
        );
    };

    // ─── منطق الشفتات ───
    const handleAddShift = () => {
        if (draftStart && draftEnd && draftStart.isValid() && draftEnd.isValid() && draftStart.isBefore(draftEnd)) {
            const newShift = { start: draftStart.format('HH:mm'), end: draftEnd.format('HH:mm'), startLabel: draftStart.format('hh:mm A'), endLabel: draftEnd.format('hh:mm A') };
            updateVariant({ shiftRanges: [...shiftRanges, newShift] });
            setDraftStart(null); setDraftEnd(null);
        }
    };

    const handleDeleteShift = (idx) => updateVariant({ shiftRanges: shiftRanges.filter((_, i) => i !== idx) });

    // ─── منطق الصور المؤقتة (الربط مع Backend) ───
    const handleFileChange = async (event) => {
        const newFiles = Array.from(event.target.files);
        if (newFiles.length === 0) return;

        setIsUploading(true);

        for (const file of newFiles) {
            // إنشاء رابط محلي للعرض الفوري (Blob)
            const localPreview = URL.createObjectURL(file);

            try {
                const response = await additionService.uploadTempImage(file);
                if (response && response.temp_path) {
                    // نحفظ كلاً من الرابط المحلي للـ Preview ومسار السيرفر للـ Payload
                    const newImageObj = {
                        preview: localPreview,
                        tempPath: response.temp_path
                    };

                    onUpdate(index, 'images', [...images, newImageObj]);
                }
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        }
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleDeleteImage = (imgIndex) => {
        const filteredImages = images.filter((_, i) => i !== imgIndex);
        onUpdate(index, 'images', filteredImages);
    };

    const smallInputStyle = {
        '& .MuiOutlinedInput-root': { height: '36px', minHeight: '36px' },
        '& .MuiOutlinedInput-input': { padding: '8px 12px', fontSize: '12px' }
    };

    const shiftInputStyle = {
        '& .MuiOutlinedInput-root': { height: '32px !important', minHeight: '32px !important', backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)', color: isDark ? '#eee0da' : '#2B211E', borderRadius: '4px', paddingRight: '4px !important' },
        '& fieldset': { borderColor: isDark ? 'rgba(78, 70, 57, 0.3)' : 'rgba(179, 140, 69, 0.35)', borderWidth: '1px !important' },
        '& .MuiOutlinedInput-input': { padding: '0px 8px !important', fontSize: '11px', lineHeight: '32px' },
        '& .MuiSvgIcon-root': { fontSize: '16px', color: isDark ? '#c5a059' : '#b38c45' }
    };

    return (
        <Paper
            sx={{
                p: 2.5,
                backgroundColor: isDark ? '#140e0c' : '#FAF0D5',
                border: isDark ? '1px solid #261d19' : '1px solid rgba(179, 140, 69, 0.2)',
                borderRadius: '8px',
                width: isSingle ? '100%' : '340px',
                minWidth: isSingle ? '100%' : '340px',
                boxSizing: 'border-box',
                flexShrink: 0,
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ color: isDark ? '#c5a059' : '#b38c45', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase' }}>
                    VARIANT {index + 1}
                </Typography>
                <FormControlLabel control={<Switch checked={isAllDay} size="small" onChange={(e) => updateVariant({ isAllDay: e.target.checked })} />} label={<Typography sx={{ fontSize: '10px', fontWeight: 'bold', color: theme.palette.text.secondary }}>ALL DAY</Typography>} sx={{ m: 0 }} />
            </Box>

            {/* 1. الروزنامة */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{
                    borderRadius: '6px', bgcolor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.4)',
                    display: 'flex', justifyContent: 'center', border: isDark ? '1px solid rgba(78, 70, 57, 0.3)' : '1px solid rgba(179, 140, 69, 0.35)',
                    width: '100%', boxSizing: 'border-box', py: 1,
                    '& .MuiPickersLayout-root': { width: '100%', minWidth: '100%', backgroundColor: 'transparent' },
                    '& .MuiPickersCalendarHeader-root': { mt: 0, mb: 1, pt: 1, pb: 0, minHeight: '30px', padding: '0 8px', width: '100%' },
                    '& .MuiDateCalendar-root': { width: '100%', height: 'auto', minHeight: '260px', pb: 1 },
                    '& .MuiDayCalendar-header': { width: '100%', justifyContent: 'space-between', px: 1 },
                    '& .MuiDayCalendar-weekDayLabel': { flex: 1, width: 'auto', margin: 0, textAlign: 'center' },
                    '& .MuiDayCalendar-monthContainer': { width: '100%', px: 1 },
                    '& .MuiDayCalendar-weekContainer': { width: '100%', justifyContent: 'space-between', margin: '4px 0' },
                    '& .MuiPickersCalendarHeader-label': { color: isDark ? '#eee0da' : '#2B211E', fontWeight: 'bold', fontSize: '13px' },
                    '& .MuiIconButton-root': { color: isDark ? '#c5a059' : '#b38c45' }
                }}>
                    <StaticDatePicker displayStaticWrapperAs="desktop" disablePast value={variantData?.startDate || null} onChange={() => { }} slots={{ day: renderCustomDay }} slotProps={{ actionBar: { actions: [] } }} sx={{ backgroundColor: 'transparent', '& .MuiPickersToolbar-root': { display: 'none' } }} />
                </Box>
            </LocalizationProvider>

            {/* 2. الشفتات وزر الإضافة */}
            {!isAllDay && (
                <Box>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                            <TimePicker label="" value={draftStart} onChange={setDraftStart} slotProps={{ textField: { placeholder: "Start", fullWidth: true, size: "small", sx: shiftInputStyle }, openPickerButton: { sx: { p: '4px' } } }} sx={{ flex: 1 }} />
                            <TimePicker label="" value={draftEnd} onChange={setDraftEnd} slotProps={{ textField: { placeholder: "End", fullWidth: true, size: "small", sx: shiftInputStyle }, openPickerButton: { sx: { p: '4px' } } }} sx={{ flex: 1 }} />
                            <Button variant="contained" onClick={handleAddShift} disabled={!draftStart || !draftEnd} sx={{ height: '32px', minWidth: '36px', backgroundColor: theme.palette.primary.main, fontSize: '16px', p: 0, lineHeight: 1 }}>+</Button>
                        </Box>
                    </LocalizationProvider>
                    {shiftRanges.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', p: 1, borderRadius: '4px', border: `1px dashed ${theme.palette.divider}`, maxHeight: '60px', overflowY: 'auto' }}>
                            {shiftRanges.map((range, idx) => (
                                <Chip key={idx} size="small" label={`${range.startLabel} - ${range.endLabel}`} onDelete={() => handleDeleteShift(idx)} sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, border: `1px solid ${theme.palette.primary.main}`, fontSize: '9px', height: '20px' }} deleteIcon={<CloseIcon style={{ fontSize: '12px' }} />} />
                            ))}
                        </Box>
                    )}
                </Box>
            )}

            {/* 3. صندوق رفع وإدارة الصور */}
            <Box sx={{
                border: isDark ? '1px dashed rgba(78, 70, 57, 0.6)' : '1px dashed rgba(179, 140, 69, 0.6)',
                borderRadius: '4px', p: 1,
                backgroundColor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.4)',
                display: 'flex', alignItems: 'center', minHeight: '75px',
                overflowX: 'auto', gap: 1,
                '&::-webkit-scrollbar': { height: '4px' },
                '&::-webkit-scrollbar-thumb': { backgroundColor: isDark ? 'rgba(197, 160, 89, 0.5)' : 'rgba(179, 140, 69, 0.5)', borderRadius: '4px' }
            }}>
                <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" multiple onChange={handleFileChange} />

                {images.length > 0 ? (
                    <>
                        {images.map((imgObj, imgIdx) => (
                            <Box key={imgIdx} sx={{
                                position: 'relative', width: '55px', height: '55px', flexShrink: 0,
                                borderRadius: '4px', overflow: 'hidden', border: `1px solid ${theme.palette.divider}`
                            }}>
                                {/* العرض من الرابط المحلي (Blob) مباشرة */}
                                <img
                                    src={imgObj.preview}
                                    alt={`variant-img-${imgIdx}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <Box
                                    onClick={(e) => { e.stopPropagation(); handleDeleteImage(imgIdx); }}
                                    sx={{
                                        position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(0,0,0,0.6)',
                                        borderRadius: '50%', cursor: 'pointer', width: '16px', height: '16px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: '0.2s', '&:hover': { bgcolor: 'error.main' }
                                    }}
                                >
                                    <CloseIcon sx={{ fontSize: '10px', color: '#fff' }} />
                                </Box>
                            </Box>
                        ))}

                        <Box onClick={() => fileInputRef.current.click()} sx={{ width: '55px', height: '55px', flexShrink: 0, border: '1px dashed #c5a059', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', transition: '0.2s', '&:hover': { borderColor: '#c5a059', backgroundColor: 'rgba(197, 160, 89, 0.1)' } }}>
                            <FileUploadIcon sx={{ color: '#c5a059', fontSize: 20 }} />
                        </Box>
                    </>
                ) : (
                    <Box onClick={() => fileInputRef.current.click()} sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <FileUploadIcon sx={{ color: isDark ? '#c5a059' : '#b38c45', fontSize: 24 }} />
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 'bold', fontSize: '10px', mt: 0.5 }}>
                            {isUploading ? "UPLOADING..." : "UPLOAD IMAGES"}
                        </Typography>
                    </Box>
                )}
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Box sx={{ flex: 1 }}><CustomInputField label="Price" type="number" value={variantData?.price || ''} onChange={(e) => onUpdate(index, 'price', e.target.value)} sx={smallInputStyle} /></Box>
                <Box sx={{ flex: 1 }}><CustomInputField label="Stock" type="number" value={variantData?.stock || ''} onChange={(e) => onUpdate(index, 'stock', e.target.value)} sx={smallInputStyle} /></Box>
            </Box>

            {hasVariants === 'yes' && (<CustomInputField label="Color Name" value={variantData?.color || ''} onChange={(e) => onUpdate(index, 'color', e.target.value)} sx={smallInputStyle} />)}

            {/* الحقول الجديدة: نوع السعر والعملة */}
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, mt: 1 }}>
                {/* 1. نوع السعر (Fixed / Hourly) */}
                <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 'bold', display: 'block', mb: 0.5 }}>PRICE TYPE</Typography>
                    <RadioGroup row value={variantData?.priceType || 'fixed'} onChange={(e) => updateVariant({ priceType: e.target.value })}>
                        <FormControlLabel value="fixed" control={<Radio size="small" />} label={<Typography sx={{fontSize:'12px'}}>Fixed</Typography>} />
                        <FormControlLabel value="hourly" control={<Radio size="small" />} label={<Typography sx={{fontSize:'12px'}}>Hourly</Typography>} />
                    </RadioGroup>
                </Box>

                {/* 2. اختيار العملة (بجانب النوع) */}
                <Box sx={{ flex: 1 }}>
                    <Autocomplete
                        filterOptions={(options, state) => filter(options, state)}
                        options={allCurrencies}
                        getOptionLabel={(option) => option.label}
                        value={allCurrencies.find(c => c.code === variantData?.currency) || null}
                        onChange={(event, newValue) => updateVariant({ currency: newValue ? newValue.code : '' })}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Currency"
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': { fontSize: '13px', height: '40px' },
                                    '& .MuiInputLabel-root': { fontSize: '13px' }
                                }}
                            />
                        )}
                    />
                </Box>
            </Box>
        </Paper>
    );
};

export default VariantCard;