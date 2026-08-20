import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Chip,
    alpha
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import {
    GOLD, BROWN_TEXT, MUTED_TEXT,
    LIGHT_CARD, LIGHT_INPUT, LIGHT_BORDER,
    DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_CARD_SHADOW,
    DARK_CARD_HOVER_SHADOW, DARK_SURFACE_BG, DARK_SURFACE_BORDER
} from '../../../../utils/colorConstants';

const ProductCard = ({ product, onAdd }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
    const [quantity, setQuantity] = useState(selectedVariant.stock || 0);

    const [openCalendar, setOpenCalendar] = useState(false);
    const [selectedViewDate, setSelectedViewDate] = useState(dayjs());

    const handleColorClick = (variant) => {
        setSelectedVariant(variant);
        setQuantity(variant.stock);
    };

    const handleQtyChange = (e) => {
        const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);

        if (val === '') {
            setQuantity('');
            return;
        }

        if (val > selectedVariant.stock) {
            setQuantity(selectedVariant.stock);
        } else if (val < 1 || isNaN(val)) {
            setQuantity(1);
        } else {
            setQuantity(val);
        }
    };

    const getColorCode = (color) => {
        const c = color.toLowerCase();
        const colorMap = {
            'red': '#FF0000', 'blue': '#0000FF', 'green': '#008000', 'white': '#FFFFFF',
            'black': '#000000', 'yellow': '#FFFF00', 'purple': '#800080', 'orange': '#FFA500',
            'pink': '#FFC0CB', 'brown': '#A52A2A', 'gray': '#808080'
        };
        return colorMap[c] || c;
    };

    const availabilities = selectedVariant.availabilities || [];
    const sortedAvails = [...availabilities].sort((a, b) => dayjs(a.available_date).valueOf() - dayjs(b.available_date).valueOf());

    let availabilityText = 'N/A';
    if (sortedAvails.length > 0) {
        const firstDate = dayjs(sortedAvails[0].available_date).format('YYYY-MM-DD');
        const lastDate = dayjs(sortedAvails[sortedAvails.length - 1].available_date).format('YYYY-MM-DD');
        availabilityText = firstDate === lastDate ? firstDate : `${firstDate} to ${lastDate}`;
    }

    const renderServerDay = (dayProps) => {
        const { day, outsideCurrentMonth, ...other } = dayProps;
        if (outsideCurrentMonth) return <Box sx={{ width: 36, height: 36, margin: 'auto' }} />;

        const isAvailable = sortedAvails.some(a => dayjs(a.available_date).isSame(day, 'day') && !a.is_blocked);
        const isSelected = dayjs(selectedViewDate).isSame(day, 'day');

        return (
            <Box {...other} onClick={() => setSelectedViewDate(day)}
                 sx={{
                     width: 36, height: 36, margin: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
                     borderRadius: '50%', cursor: 'pointer',
                     bgcolor: isSelected ? GOLD : (isAvailable ? alpha(GOLD, 0.2) : 'transparent'),
                     color: isSelected ? '#131110' : (isAvailable ? GOLD : theme.palette.text.secondary),
                     border: isAvailable && !isSelected ? `1px solid ${GOLD}` : 'none',
                     fontWeight: isAvailable ? 'bold' : 'normal',
                     '&:hover': { bgcolor: isAvailable ? alpha(GOLD, 0.4) : alpha(theme.palette.text.secondary, 0.1) }
                 }}>
                {day.date()}
            </Box>
        );
    };

    const selectedDayData = sortedAvails.find(a => dayjs(a.available_date).isSame(selectedViewDate, 'day'));
    const slots = selectedDayData?.slots || [];

    const BACKEND_URL = 'http://127.0.0.1:8000';

    let rawImage = null;
    if (selectedVariant.images && selectedVariant.images.length > 0) {
        const firstImg = selectedVariant.images[0];
        rawImage = firstImg.path || firstImg.url || (typeof firstImg === 'string' ? firstImg : null);
    } else if (product.image) {
        rawImage = product.image.path || product.image.url || (typeof product.image === 'string' ? product.image : null);
    }

    let displayImage = null;
    if (rawImage && typeof rawImage === 'string') {
        if (rawImage.startsWith('http')) {
            displayImage = rawImage;
        } else if (rawImage.startsWith('/storage/')) {
            displayImage = `${BACKEND_URL}${rawImage}`;
        } else {
            const cleanPath = rawImage.startsWith('/') ? rawImage : `/${rawImage}`;
            displayImage = `${BACKEND_URL}/storage${cleanPath}`;
        }
    } else {
        displayImage = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2275%22%20height%3D%2290%22%20viewBox%3D%220%200%2075%2090%22%3E%3Crect%20fill%3D%22%23261d19%22%20width%3D%2275%22%20height%3D%2290%22%2F%3E%3Ctext%20fill%3D%22%23c5a059%22%20font-family%3D%22sans-serif%22%20font-size%3D%2210%22%20dy%3D%2210.5%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E';
    }

    const handleAddClick = () => {
        const finalQuantity = quantity === '' || quantity < 1 ? 1 : quantity;

        const data = {
            ...product,
            selectedVariantId: selectedVariant.id,
            selectedColor: selectedVariant.name?.en || selectedVariant.name,
            selectedQty: finalQuantity,
            image: displayImage
        };
        onAdd(data);
    };

    return (
        <>
            <Box sx={{
                background: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
                border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
                boxShadow: isDark ? DARK_CARD_SHADOW : '0 8px 24px rgba(130, 100, 40, 0.10)',
                backdropFilter: 'blur(16px)',
                borderRadius: 2.5, width: 700, maxWidth: 380, p: 2,
                display: 'flex', flexDirection: 'column', gap: 1, position: 'relative',
            }}>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <Box sx={{ width: 75, height: 90, borderRadius: 1.2, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', flexShrink: 0 }}>
                        <img src={displayImage} alt={product.title?.en || product.name} style={{ width: 75, height: 90, objectFit: 'cover', borderRadius: 'inherit' }} />
                    </Box>

                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography sx={{ color: isDark ? '#ffffff' : BROWN_TEXT, fontWeight: 'bold', fontSize: '0.85rem' }}>
                                {product.title?.en || product.name}
                            </Typography>
                            <Button
                                variant="contained" size="small"
                                onClick={handleAddClick}
                                startIcon={<AddIcon sx={{ fontSize: '0.7rem', ml: -0.5 }} />}
                                sx={{
                                    bgcolor: GOLD, color: '#131110', fontSize: '0.6rem', fontWeight: 'bold',
                                    px: 1, py: 0, minWidth: 'auto', borderRadius: 1, ml: 'auto',
                                    '&:hover': { bgcolor: '#b38c45' }
                                }}
                            >
                                ADD
                            </Button>
                        </Box>

                        <Typography sx={{ color: GOLD, fontWeight: 'bold', fontSize: '0.8rem' }}>
                            $ {selectedVariant.price}
                        </Typography>

                        <Box
                            onClick={() => {
                                if(sortedAvails.length > 0) setSelectedViewDate(dayjs(sortedAvails[0].available_date));
                                setOpenCalendar(true);
                            }}
                            sx={{
                                display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 0.5, cursor: 'pointer',
                                '&:hover .MuiTypography-root, &:hover .MuiSvgIcon-root': { color: GOLD }
                            }}
                        >
                            <CalendarMonthIcon sx={{ fontSize: '0.75rem', color: isDark ? 'rgba(255,255,255,0.6)' : theme.palette.text.secondary, transition: '0.2s' }} />
                            <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : theme.palette.text.secondary, fontSize: '0.65rem', transition: '0.2s', textDecoration: 'underline' }}>
                                Available: {availabilityText}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.8 }}>
                            <Box sx={{ display: 'flex', gap: 0.8 }}>
                                {product.variants.map((v, i) => (
                                    <Box key={i} onClick={() => handleColorClick(v)}
                                         sx={{
                                             width: 16, height: 16, borderRadius: '50%', bgcolor: getColorCode(v.name?.en || v.name), cursor: 'pointer',
                                             border: selectedVariant.id === v.id ? `2px solid ${GOLD}` : '1px solid #555'
                                         }}
                                    />
                                ))}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Typography sx={{ color: isDark ? '#ffffff' : BROWN_TEXT, fontSize: '0.7rem', fontWeight: 'bold' }}>QTY:</Typography>
                                <TextField
                                    type="number" size="small" value={quantity} onChange={handleQtyChange}
                                    inputProps={{ min: 1, max: selectedVariant.stock }}
                                    sx={{
                                        width: 40,
                                        '& .MuiInputBase-input': { p: 0.2, textAlign: 'center', fontSize: '0.75rem', color: isDark ? '#ffffff' : BROWN_TEXT },
                                        '& .MuiOutlinedInput-root': { borderRadius: 0.8, '& fieldset': { borderColor: GOLD } }
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Dialog open={openCalendar} onClose={() => setOpenCalendar(false)} PaperProps={{ sx: { background: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD, borderRadius: 3, border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`, backdropFilter: 'blur(16px)', backgroundImage: 'none' } }}>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                    <Typography sx={{ fontWeight: 'bold', color: GOLD }}>Product Availability</Typography>
                    <IconButton size="small" onClick={() => setOpenCalendar(false)}>
                        <CloseIcon fontSize="small" sx={{ color: isDark ? '#ffffff' : BROWN_TEXT }} />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box sx={{ border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`, borderRadius: 2, p: 1, bgcolor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)' }}>
                            <DateCalendar
                                value={selectedViewDate}
                                onChange={(newDate) => setSelectedViewDate(newDate)}
                                slots={{ day: renderServerDay }}
                                sx={{ margin: 0, '& .MuiTypography-root': { color: isDark ? '#ffffff' : BROWN_TEXT } }}
                            />
                        </Box>
                    </LocalizationProvider>

                    <Box sx={{ width: '100%', mt: 3 }}>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 'bold', mb: 1, color: isDark ? 'rgba(255,255,255,0.7)' : theme.palette.text.secondary }}>
                            Shifts for {selectedViewDate.format('MMM DD, YYYY')}:
                        </Typography>

                        {selectedDayData ? (
                            slots.length > 0 ? (
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {slots.map((slot, index) => {
                                        const formattedStart = slot.start_time ? dayjs(`2024-01-01T${slot.start_time}`).format('hh:mm A') : '';
                                        const formattedEnd = slot.end_time ? dayjs(`2024-01-01T${slot.end_time}`).format('hh:mm A') : '';

                                        return (
                                            <Chip
                                                key={index}
                                                label={slot.start_time && slot.end_time ? `${formattedStart} - ${formattedEnd}` : `Shift ${index + 1}`}
                                                size="small"
                                                sx={{ bgcolor: alpha(GOLD, 0.1), color: GOLD, border: `1px solid ${GOLD}` }}
                                            />
                                        );
                                    })}
                                </Box>
                            ) : (
                                <Typography sx={{ fontSize: '0.8rem', color: isDark ? 'rgba(255,255,255,0.7)' : theme.palette.text.secondary, fontStyle: 'italic' }}>
                                    Available All Day (No specific shifts)
                                </Typography>
                            )
                        ) : (
                            <Typography sx={{ fontSize: '0.8rem', color: '#ef5350', fontStyle: 'italic' }}>
                                Product is not available on this date.
                            </Typography>
                        )}
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ProductCard;