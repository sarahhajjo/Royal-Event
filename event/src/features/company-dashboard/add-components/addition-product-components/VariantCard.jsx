import React, { useRef, useState } from 'react';
import { Paper, Box, Typography, alpha, Chip, Button, Switch, FormControlLabel, Autocomplete } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import CustomInputField from './CustomInputField.jsx';
import { StaticDatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { createFilterOptions } from '@mui/material/Autocomplete';
import additionService from '../../../../services/companyService/additionService';
import TextField from "@mui/material/TextField";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import currencyCodes from 'currency-codes';

import {
    GOLD, BROWN_TEXT, MUTED_TEXT,
    LIGHT_CARD, LIGHT_INPUT, LIGHT_BORDER,
    DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_CARD_SHADOW,
    DARK_CARD_HOVER_SHADOW, DARK_SURFACE_BG, DARK_SURFACE_BORDER
} from '../../../../utils/colorConstants';

const VariantCard = ({ index, variantData, originalVariant, onUpdate, onUpdateFullObject, isSingle, editMode }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const fileInputRef = useRef(null);

    const [draftStart, setDraftStart] = useState(null);
    const [draftEnd, setDraftEnd] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const isPriceModified = editMode && String(variantData?.price) !== String(originalVariant?.price);
    const isStockModified = editMode && String(variantData?.stock) !== String(originalVariant?.stock);
    const isColorModified = editMode && String(variantData?.color) !== String(originalVariant?.color);

    const excludedDates = variantData?.excludedDates || [];
    const shiftRanges = variantData?.shiftRanges || [];
    const isAllDay = variantData?.isAllDay || false;
    const images = variantData?.images || [];
    const selectionMode = variantData?.selectionMode || 'range';
    const filter = createFilterOptions();

    const allCurrencies = currencyCodes.data.map(c => ({ label: `${c.code} - ${c.currency}`, code: c.code }));

    const getSelectedDates = () => {
        if (!variantData?.startDate) return [];
        let dates = [];
        let curr = dayjs(variantData.startDate);
        const end = variantData.endDate ? dayjs(variantData.endDate) : curr;

        while (curr.isBefore(end, 'day') || curr.isSame(end, 'day')) {
            const dStr = curr.format('YYYY-MM-DD');
            if (!excludedDates.includes(dStr)) {
                dates.push(dStr);
            }
            curr = curr.add(1, 'day');
        }
        return dates;
    };

    const handleDateClick = (clickedDate) => {
        if (!clickedDate) return;
        const dateStr = clickedDate.format('YYYY-MM-DD');

        if (selectionMode === 'range') {
            const { startDate, endDate } = variantData;

            if (startDate && endDate &&
                (clickedDate.isSame(startDate, 'day') || clickedDate.isAfter(startDate, 'day')) &&
                (clickedDate.isSame(endDate, 'day') || clickedDate.isBefore(endDate, 'day'))) {

                let newExcluded = [...excludedDates];
                if (newExcluded.includes(dateStr)) {
                    newExcluded = newExcluded.filter(d => d !== dateStr);
                } else {
                    newExcluded.push(dateStr);
                }
                onUpdate(index, 'excludedDates', newExcluded);
                return;
            }

            if (!startDate || (startDate && endDate)) {
                onUpdateFullObject(index, { ...variantData, startDate: clickedDate, endDate: null, excludedDates: [] });
            } else if (startDate && !endDate) {
                if (clickedDate.isBefore(startDate, 'day')) {
                    onUpdateFullObject(index, { ...variantData, startDate: clickedDate, endDate: null, excludedDates: [] });
                } else {
                    onUpdate(index, 'endDate', clickedDate);
                }
            }
        } else {
            let currentSelected = getSelectedDates();

            if (currentSelected.includes(dateStr)) {
                currentSelected = currentSelected.filter(d => d !== dateStr);
            } else {
                currentSelected.push(dateStr);
            }

            if (currentSelected.length === 0) {
                onUpdateFullObject(index, { ...variantData, startDate: null, endDate: null, excludedDates: [] });
                return;
            }

            currentSelected.sort((a, b) => dayjs(a).valueOf() - dayjs(b).valueOf());
            const newStart = dayjs(currentSelected[0]);
            const newEnd = currentSelected.length > 1 ? dayjs(currentSelected[currentSelected.length - 1]) : null;

            const newExcluded = [];
            if (newEnd) {
                let curr = dayjs(newStart).add(1, 'day');
                while (curr.isBefore(newEnd, 'day')) {
                    const s = curr.format('YYYY-MM-DD');
                    if (!currentSelected.includes(s)) newExcluded.push(s);
                    curr = curr.add(1, 'day');
                }
            }

            onUpdateFullObject(index, { ...variantData, startDate: newStart, endDate: newEnd, excludedDates: newExcluded });
        }
    };

    const renderCustomDay = (dayProps) => {
        const { day, outsideCurrentMonth, disabled, ...other } = dayProps;
        if (outsideCurrentMonth) return <Box sx={{ flex: 1, height: '40px', m: '0 2px' }} />;

        const dateStr = day.format('YYYY-MM-DD');
        const isToday = dayjs().isSame(day, 'day');

        let bgColor = 'transparent', borderStyle = 'none', textColor = isDark ? '#ffffff' : BROWN_TEXT;

        if (disabled) {
            textColor = isDark ? 'rgba(255,255,255,0.2)' : alpha(BROWN_TEXT, 0.2);
        } else if (selectionMode === 'range') {
            const isStart = variantData.startDate && day.isSame(variantData.startDate, 'day');
            const isEnd = variantData.endDate && day.isSame(variantData.endDate, 'day');
            const isBetween = variantData.startDate && variantData.endDate && day.isAfter(variantData.startDate, 'day') && day.isBefore(variantData.endDate, 'day');
            const isExcluded = excludedDates.includes(dateStr);

            if (isExcluded && (isBetween || isStart || isEnd)) {
                borderStyle = `1px solid ${GOLD}`;
                textColor = GOLD;
                bgColor = 'transparent';
            } else if (isStart || isEnd) {
                bgColor = GOLD;
                textColor = '#131110';
            } else if (isBetween) {
                bgColor = alpha(GOLD, 0.15);
                textColor = GOLD;
            }
        } else {
            const currentSelected = getSelectedDates();
            const isSelected = currentSelected.includes(dateStr);
            const isExcluded = excludedDates.includes(dateStr);

            if (isSelected) {
                bgColor = GOLD;
                textColor = '#131110';
            } else if (isExcluded) {
                borderStyle = `1px solid ${GOLD}`;
                textColor = GOLD;
            }
        }

        if (isToday && bgColor === 'transparent' && borderStyle === 'none' && !disabled) {
            borderStyle = `1px solid ${isDark ? '#ffffff' : BROWN_TEXT}`;
        }

        return (
            <Box sx={{ flex: 1, height: '40px', m: '0 2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box {...other} onClick={(e) => { e.stopPropagation(); e.preventDefault(); if (!disabled) handleDateClick(day); }}
                     sx={{
                         backgroundColor: bgColor, border: borderStyle, borderRadius: '50%', width: '32px', height: '32px',
                         display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: disabled ? 'default' : 'pointer',
                         color: textColor, opacity: disabled ? 0.6 : 1, fontSize: '0.85rem',
                         '&:hover': { backgroundColor: disabled ? 'transparent' : (bgColor !== 'transparent' && borderStyle === 'none' ? GOLD : alpha(GOLD, 0.3)) }
                     }}
                >
                    {day.date()}
                </Box>
            </Box>
        );
    };

    const handleAddShift = () => {
        if (draftStart && draftEnd && draftStart.isValid() && draftEnd.isValid() && draftStart.isBefore(draftEnd)) {
            const newShift = { start: draftStart.format('HH:mm'), end: draftEnd.format('HH:mm'), startLabel: draftStart.format('hh:mm A'), endLabel: draftEnd.format('hh:mm A') };
            onUpdate(index, 'shiftRanges', [...shiftRanges, newShift]);
            setDraftStart(null); setDraftEnd(null);
        }
    };

    const handleDeleteShift = (idx) => onUpdate(index, 'shiftRanges', shiftRanges.filter((_, i) => i !== idx));

    const handleFileChange = async (event) => {
        const newFiles = Array.from(event.target.files);
        if (newFiles.length === 0) return;

        setIsUploading(true);
        let currentImages = [...images];

        for (const file of newFiles) {
            const localPreview = URL.createObjectURL(file);
            try {
                const response = await additionService.uploadTempImage(file);
                if (response && (response.path || response.temp_path)) {
                    currentImages.push({ preview: localPreview, tempPath: response.path || response.temp_path });
                }
            } catch (error) { console.error("Error uploading image:", error); }
        }

        onUpdate(index, 'images', currentImages);
        setIsUploading(false);
    };

    const handleDeleteImage = (imgIndex) => {
        onUpdate(index, 'images', images.filter((_, i) => i !== imgIndex));
    };

    const smallInputStyle = {
        '& .MuiOutlinedInput-root': { height: '36px', minHeight: '36px', backgroundColor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT },
        '& .MuiOutlinedInput-input': { padding: '8px 12px', fontSize: '12px' }
    };

    const shiftInputStyle = {
        '& .MuiOutlinedInput-root': { height: '32px !important', minHeight: '32px !important', backgroundColor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT, color: isDark ? '#ffffff' : BROWN_TEXT, borderRadius: '4px', paddingRight: '4px !important' },
        '& fieldset': { borderColor: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`, borderWidth: '1px !important' },
        '& .MuiOutlinedInput-input': { padding: '0px 8px !important', fontSize: '11px', lineHeight: '32px' },
        '& .MuiSvgIcon-root': { fontSize: '16px', color: GOLD }
    };

    // 💡 الحل الجذري لتلوين نوافذ اختيار الوقت
    const timePickerPopperProps = {
        popper: {
            sx: {
                '& .MuiPaper-root': {
                    bgcolor: 'transparent !important',
                    background: isDark ? `${DARK_CARD_BACKGROUND} !important` : `${LIGHT_CARD} !important`,
                    border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
                    color: isDark ? '#ffffff' : BROWN_TEXT,
                    backdropFilter: 'blur(24px) !important',
                    backgroundImage: 'none !important',
                    '& .MuiMultiSectionDigitalClockSection-root': {
                        borderRight: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`
                    },
                    '& .MuiMenuItem-root.Mui-selected': {
                        backgroundColor: isDark ? 'rgba(197, 160, 89, 0.25) !important' : 'rgba(197, 160, 89, 0.15) !important'
                    },
                    '& .MuiMenuItem-root:hover': {
                        backgroundColor: isDark ? 'rgba(197, 160, 89, 0.15)' : 'rgba(197, 160, 89, 0.1)'
                    }
                }
            }
        }
    };

    return (
        <Paper
            sx={{
                p: 2.5,
                background: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
                border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
                borderRadius: '18px',
                width: isSingle ? '100%' : '340px',
                minWidth: isSingle ? '100%' : '340px',
                boxSizing: 'border-box',
                flexShrink: 0,
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                backdropFilter: 'blur(16px)',
                boxShadow: isDark ? DARK_CARD_SHADOW : '0 18px 40px rgba(130, 100, 40, 0.10)',
                cursor: 'pointer',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: isDark ? DARK_CARD_HOVER_SHADOW : '0 20px 44px rgba(130, 100, 40, 0.2)',
                    borderColor: isDark ? 'rgba(197, 160, 89, 0.22)' : 'rgba(197, 160, 89, 0.7)'
                },
                '&:active': { transform: 'scale(0.98) translateY(-2px)', transition: 'all 0.05s ease' }
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ color: GOLD, fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    VARIANT {index + 1}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, mt: 1, width: '100%' }}>
                <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.58)' : MUTED_TEXT, fontWeight: 700, textTransform: 'uppercase', fontSize: '10px', whiteSpace: 'nowrap', letterSpacing: '0.08em' }}>
                    SELECTION MODE
                </Typography>
                <RadioGroup row sx={{ flexWrap: 'nowrap' }} value={selectionMode} onChange={(e) => onUpdateFullObject(index, { ...variantData, selectionMode: e.target.value, startDate: null, endDate: null, excludedDates: [], selectedDates: [] })}>
                    <FormControlLabel value="range" control={<Radio size="small" sx={{ color: GOLD, '&.Mui-checked': { color: GOLD }, p: 0.5 }} />} label={<Typography sx={{ fontSize: '11px', color: isDark ? '#ffffff' : BROWN_TEXT, whiteSpace: 'nowrap', fontFamily: "'Inter', sans-serif" }}>Date Range</Typography>} sx={{ m: 0, mr: 1.5 }} />
                    <FormControlLabel value="multiple" control={<Radio size="small" sx={{ color: GOLD, '&.Mui-checked': { color: GOLD }, p: 0.5 }} />} label={<Typography sx={{ fontSize: '11px', color: isDark ? '#ffffff' : BROWN_TEXT, whiteSpace: 'nowrap', fontFamily: "'Inter', sans-serif" }}>Multiple Days</Typography>} sx={{ m: 0 }} />
                </RadioGroup>
            </Box>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{
                    borderRadius: '14px', background: isDark ? DARK_SURFACE_BG : LIGHT_INPUT,
                    display: 'flex', justifyContent: 'center', border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
                    width: '100%', boxSizing: 'border-box', py: 1,
                    '& .MuiPickersLayout-root': { width: '100%', minWidth: '100%', backgroundColor: 'transparent' },
                    '& .MuiPickersCalendarHeader-root': { mt: 0, mb: 1, pt: 1, pb: 0, minHeight: '30px', padding: '0 8px', width: '100%' },
                    '& .MuiDateCalendar-root': { width: '100%', height: 'auto', minHeight: '260px', pb: 1 },
                    '& .MuiDayCalendar-header': { width: '100%', justifyContent: 'space-between', px: 1 },
                    '& .MuiDayCalendar-weekDayLabel': { flex: 1, width: 'auto', margin: 0, textAlign: 'center' },
                    '& .MuiDayCalendar-monthContainer': { width: '100%', px: 1 },
                    '& .MuiDayCalendar-weekContainer': { width: '100%', justifyContent: 'space-between', margin: '4px 0' },
                    '& .MuiPickersCalendarHeader-label': { color: isDark ? '#ffffff' : BROWN_TEXT, fontWeight: 700, fontSize: '13px', fontFamily: "'Inter', sans-serif" },
                    '& .MuiIconButton-root': { color: GOLD }
                }}>
                    <StaticDatePicker displayStaticWrapperAs="desktop" disablePast value={selectionMode === 'range' ? (variantData?.startDate || null) : null} onChange={() => { }} slots={{ day: renderCustomDay }} slotProps={{ actionBar: { actions: [] } }} sx={{ backgroundColor: 'transparent', '& .MuiPickersToolbar-root': { display: 'none' } }} />
                </Box>
            </LocalizationProvider>

            <Box sx={{ mt: 0.5, mb: 0.5 }}>
                <FormControlLabel
                    control={<Switch checked={isAllDay} size="small" onChange={(e) => onUpdate(index, 'isAllDay', e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: GOLD }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: GOLD } }} />}
                    label={<Typography sx={{ fontSize: '12px', fontWeight: 600, color: isDark ? '#ffffff' : BROWN_TEXT, fontFamily: "'Inter', sans-serif" }}>All Day (No specific shifts)</Typography>}
                />
            </Box>

            {!isAllDay && (
                <Box>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                            <TimePicker label="" value={draftStart} onChange={setDraftStart} slotProps={{ ...timePickerPopperProps, textField: { placeholder: "Start", fullWidth: true, size: "small", sx: shiftInputStyle }, openPickerButton: { sx: { p: '4px' } } }} sx={{ flex: 1 }} />
                            <TimePicker label="" value={draftEnd} onChange={setDraftEnd} slotProps={{ ...timePickerPopperProps, textField: { placeholder: "End", fullWidth: true, size: "small", sx: shiftInputStyle }, openPickerButton: { sx: { p: '4px' } } }} sx={{ flex: 1 }} />
                            <Button variant="contained" onClick={handleAddShift} disabled={!draftStart || !draftEnd} sx={{ height: '32px', minWidth: '36px', backgroundColor: GOLD, color: '#131110', fontSize: '16px', p: 0, lineHeight: 1, '&:hover': { backgroundColor: '#b38c45' } }}>+</Button>
                        </Box>
                    </LocalizationProvider>
                    {shiftRanges.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', p: 1, borderRadius: '12px', border: isDark ? '1px dashed rgba(255,255,255,0.10)' : `1px dashed ${LIGHT_BORDER}`, maxHeight: '60px', overflowY: 'auto', backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,248,232,0.45)' }}>
                            {shiftRanges.map((range, idx) => (
                                <Chip key={idx} size="small" label={`${range.startLabel} - ${range.endLabel}`} onDelete={() => handleDeleteShift(idx)} sx={{ backgroundColor: 'rgba(197,160,89,0.12)', color: GOLD, border: '1px solid rgba(197,160,89,0.22)', fontSize: '9px', height: '20px' }} deleteIcon={<CloseIcon style={{ fontSize: '12px' }} />} />
                            ))}
                        </Box>
                    )}
                </Box>
            )}

            <Box sx={{
                border: isDark ? '1px dashed rgba(255, 255, 255, 0.12)' : `1px dashed ${LIGHT_BORDER}`,
                borderRadius: '14px',
                p: 1,
                background: isDark ? DARK_SURFACE_BG : LIGHT_INPUT,
                display: 'flex', alignItems: 'center', minHeight: '75px', overflowX: 'auto', gap: 1,
                '&::-webkit-scrollbar': { height: '4px' },
                '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(197, 160, 89, 0.5)' },
            }}>
                <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" multiple onChange={handleFileChange} />

                {images.length > 0 ? (
                    <>
                        {images.map((imgObj, imgIdx) => (
                            <Box key={imgIdx} sx={{
                                position: 'relative', width: '55px', height: '55px', flexShrink: 0,
                                borderRadius: '4px', overflow: 'hidden', border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
                                boxShadow: isDark ? '0 10px 20px rgba(0,0,0,0.18)' : 'none'
                            }}>
                                <img src={imgObj.preview} alt={`variant-img-${imgIdx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <Box onClick={(e) => { e.stopPropagation(); handleDeleteImage(imgIdx); }} sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(0,0,0,0.6)', borderRadius: '50%', cursor: 'pointer', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s', '&:hover': { bgcolor: 'error.main' } }}>
                                    <CloseIcon sx={{ fontSize: '10px', color: '#fff' }} />
                                </Box>
                            </Box>
                        ))}

                        <Box onClick={() => fileInputRef.current.click()} sx={{ width: '55px', height: '55px', flexShrink: 0, border: isDark ? '1px dashed rgba(255,255,255,0.12)' : `1px dashed ${LIGHT_BORDER}`, borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', transition: '0.2s', '&:hover': { borderColor: GOLD, backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(197, 160, 89, 0.10)' } }}>
                            <FileUploadIcon sx={{ color: GOLD, fontSize: 20 }} />
                        </Box>
                    </>
                ) : (
                    <Box onClick={() => fileInputRef.current.click()} sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <FileUploadIcon sx={{ color: GOLD, fontSize: 24 }} />
                        <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.58)' : MUTED_TEXT, fontWeight: 700, fontSize: '10px', mt: 0.5, letterSpacing: '0.08em' }}>
                            {isUploading ? "UPLOADING..." : "UPLOAD IMAGES"}
                        </Typography>
                    </Box>
                )}
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Box sx={{ flex: 1 }}><CustomInputField label="Price" type="number" value={variantData?.price || ''} onChange={(e) => onUpdate(index, 'price', e.target.value)} sx={smallInputStyle} editMode={editMode} isModified={isPriceModified} /></Box>
                <Box sx={{ flex: 1 }}><CustomInputField label="Stock" type="number" value={variantData?.stock || ''} onChange={(e) => onUpdate(index, 'stock', e.target.value)} sx={smallInputStyle} editMode={editMode} isModified={isStockModified} /></Box>
            </Box>

            <CustomInputField label="Color Name" value={variantData?.color || ''} onChange={(e) => onUpdate(index, 'color', e.target.value)} sx={smallInputStyle} editMode={editMode} isModified={isColorModified} />

            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, mt: 1 }}>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.58)' : MUTED_TEXT, fontWeight: 700, display: 'block', mb: 0.5, letterSpacing: '0.08em' }}>PRICE TYPE</Typography>
                    <RadioGroup row value={variantData?.priceType || 'fixed'} onChange={(e) => onUpdate(index, 'priceType', e.target.value)}>
                        <FormControlLabel value="fixed" control={<Radio size="small" sx={{ color: GOLD, '&.Mui-checked': { color: GOLD } }} />} label={<Typography sx={{fontSize:'12px', color: isDark ? '#ffffff' : BROWN_TEXT, fontFamily: "'Inter', sans-serif"}}>Fixed</Typography>} />
                        <FormControlLabel value="hourly" control={<Radio size="small" sx={{ color: GOLD, '&.Mui-checked': { color: GOLD } }} />} label={<Typography sx={{fontSize:'12px', color: isDark ? '#ffffff' : BROWN_TEXT, fontFamily: "'Inter', sans-serif"}}>Hourly</Typography>} />
                    </RadioGroup>
                </Box>

                <Box sx={{ flex: 1 }}>
                    <Autocomplete
                        filterOptions={(options, state) => filter(options, state)}
                        options={allCurrencies}
                        getOptionLabel={(option) => option.label}
                        value={allCurrencies.find(c => c.code === variantData?.currency) || null}
                        onChange={(event, newValue) => onUpdate(index, 'currency', newValue ? newValue.code : '')}

                        // 💡 الحل الجذري لتلوين قائمة العملات
                        slotProps={{
                            paper: {
                                sx: {
                                    bgcolor: 'transparent !important',
                                    background: isDark ? `${DARK_CARD_BACKGROUND} !important` : `${LIGHT_CARD} !important`,
                                    border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
                                    color: isDark ? '#ffffff' : BROWN_TEXT,
                                    backdropFilter: 'blur(24px) !important',
                                    backgroundImage: 'none !important',
                                    '& .MuiAutocomplete-option[aria-selected="true"]': {
                                        backgroundColor: isDark ? 'rgba(197, 160, 89, 0.25) !important' : 'rgba(197, 160, 89, 0.15) !important'
                                    },
                                    '& .MuiAutocomplete-option:hover': {
                                        backgroundColor: isDark ? 'rgba(197, 160, 89, 0.15)' : 'rgba(197, 160, 89, 0.1)'
                                    }
                                }
                            }
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Currency"
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': { fontSize: '13px', height: '40px', backgroundColor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT, color: isDark ? '#ffffff' : BROWN_TEXT },
                                    '& .MuiInputLabel-root': { fontSize: '13px', color: isDark ? 'rgba(255,255,255,0.58)' : MUTED_TEXT },
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}` }
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