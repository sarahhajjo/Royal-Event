import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CustomInputField from './addition-product-components/CustomInputField.jsx';
import VariantCard from './addition-product-components/VariantCard.jsx';
import Button from '../../../components/Button.jsx';

function AddProductPage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const [coreDetails, setCoreDetails] = useState({ name: '', description: '', material: '' });
    const [hasVariants, setHasVariants] = useState('yes');
    const [variantCount, setVariantCount] = useState(1);
    const [variants, setVariants] = useState([{}]);
    const [logisticData, setLogisticData] = useState({ secondaryPhone: '', publishingStatus: 'public' });

    const handleCoreChange = (field, value) => {
        setCoreDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleVariantToggle = (choice) => {
        setHasVariants(choice);
        if (choice === 'no') {
            setVariantCount(1);
            setVariants([{}]);
        }
    };

    const handleCountChange = (value) => {
        const num = parseInt(value, 10) || 1;
        const safeNum = Math.max(1, Math.min(num, 20));
        setVariantCount(safeNum);
        setVariants(Array.from({ length: safeNum }, () => ({})));
    };

    return (
        <Box sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
            <Box sx={{ mb: 4, textAlign: 'left' }}>
                <Typography variant="caption" sx={{ color: isDark ? '#9a8f80' : '#7A6F5E', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Catalog &nbsp;•&nbsp; <Box component="span" sx={{ color: isDark ? '#c5a059' : '#b38c45' }}>Add New Product</Box>
                </Typography>
                <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: isDark ? '#ffffff' : '#2B211E', mt: 1, mb: 1, fontWeight: 500 }}>
                    Add New Product
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? '#9a8f80' : '#7A6F5E', fontWeight: 300 }}>
                    Curate your next exclusive product offering for the Editorial Gala catalog.
                </Typography>
            </Box>

            <Paper sx={{ p: 4, backgroundColor: isDark ? '#1c1512' : '#EFE4C9', border: isDark ? '1px solid #261d19' : '1px solid rgba(179, 140, 69, 0.2)', borderRadius: '6px', mb: 4, textAlign: 'left', transition: 'background-color 0.3s' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, borderBottom: isDark ? '1px solid rgba(154, 143, 128, 0.1)' : '1px solid rgba(179, 140, 69, 0.2)', pb: 1.5 }}>
                    <Typography sx={{ color: isDark ? '#c5a059' : '#b38c45', fontSize: '16px' }}>🗂️</Typography>
                    <Typography variant="subtitle1" sx={{ color: isDark ? '#ffffff' : '#2B211E', fontWeight: 'bold', letterSpacing: '0.02em' }}>Core Details</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <CustomInputField label="Product Name" placeholder="e.g., Signature Silk Gala Gown" value={coreDetails.name} onChange={(e) => handleCoreChange('name', e.target.value)} />
                    <CustomInputField label="Detailed Description" placeholder="Describe the craftsmanship..." multiline rows={4} value={coreDetails.description} onChange={(e) => handleCoreChange('description', e.target.value)} />
                    <CustomInputField label="Material / Composition" placeholder="e.g., Mulberry Silk" value={coreDetails.material} onChange={(e) => handleCoreChange('material', e.target.value)} />
                </Box>
            </Paper>

            <Paper sx={{ p: 4, backgroundColor: isDark ? '#1c1512' : '#EFE4C9', border: isDark ? '1px solid #261d19' : '1px solid rgba(179, 140, 69, 0.2)', borderRadius: '6px', mb: 4, textAlign: 'left', width: '100%', overflow: 'hidden', boxSizing: 'border-box', transition: 'background-color 0.3s' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, borderBottom: isDark ? '1px solid rgba(154, 143, 128, 0.1)' : '1px solid rgba(179, 140, 69, 0.2)', pb: 1.5 }}>
                    <Typography sx={{ color: isDark ? '#c5a059' : '#b38c45', fontSize: '16px' }}>🎨</Typography>
                    <Typography variant="subtitle1" sx={{ color: isDark ? '#ffffff' : '#2B211E', fontWeight: 'bold', letterSpacing: '0.02em' }}>Variant Options</Typography>
                </Box>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="caption" sx={{ color: isDark ? '#9a8f80' : '#7A6F5E', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', mb: 1 }}>Add variants with different colors?</Typography>
                        <RadioGroup row value={hasVariants} onChange={(e) => handleVariantToggle(e.target.value)}>
                            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                                <Paper sx={{ flex: 1, backgroundColor: hasVariants === 'yes' ? (isDark ? 'rgba(197, 160, 89, 0.08)' : '#FFE088') : (isDark ? '#140e0c' : '#FAF0D5'), border: '1px solid', borderColor: isDark ? '#261d19' : 'rgba(179, 140, 69, 0.2)' }}>
                                    <FormControlLabel value="yes" control={<Radio sx={{ color: isDark ? '#c5a059' : '#b38c45', '&.Mui-checked': { color: isDark ? '#c5a059' : '#b38c45' } }} />} label="Yes" sx={{ width: '100%', m: 0, px: 2, color: isDark ? '#ffffff' : '#2B211E' }} />
                                </Paper>
                                <Paper sx={{ flex: 1, backgroundColor: hasVariants === 'no' ? (isDark ? 'rgba(197, 160, 89, 0.08)' : '#FFE088') : (isDark ? '#140e0c' : '#FAF0D5'), border: '1px solid', borderColor: isDark ? '#261d19' : 'rgba(179, 140, 69, 0.2)' }}>
                                    <FormControlLabel value="no" control={<Radio sx={{ color: isDark ? '#c5a059' : '#b38c45', '&.Mui-checked': { color: isDark ? '#c5a059' : '#b38c45' } }} />} label="No" sx={{ width: '100%', m: 0, px: 2, color: isDark ? '#ffffff' : '#2B211E' }} />
                                </Paper>
                            </Box>
                        </RadioGroup>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        {hasVariants === 'yes' && (
                            <CustomInputField label="How many colors?" placeholder="1" type="number" value={variantCount} onChange={(e) => handleCountChange(e.target.value)} />
                        )}
                    </Grid>
                </Grid>
                <Box sx={{ display: 'flex', gap: 2.5, overflowX: 'auto', pb: 2, width: '100%', boxSizing: 'border-box' }}>
                    {variants.map((_, index) => (
                        <VariantCard key={index} index={index} hasVariants={hasVariants} />
                    ))}
                </Box>
            </Paper>

            <Paper sx={{ p: 4, backgroundColor: isDark ? '#1c1512' : '#EFE4C9', border: isDark ? '1px solid #261d19' : '1px solid rgba(179, 140, 69, 0.2)', borderRadius: '6px', mb: 5, textAlign: 'left', transition: 'background-color 0.3s' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, borderBottom: isDark ? '1px solid rgba(154, 143, 128, 0.1)' : '1px solid rgba(179, 140, 69, 0.2)', pb: 1.5 }}>
                    <Typography sx={{ color: isDark ? '#c5a059' : '#b38c45', fontSize: '16px' }}>📦</Typography>
                    <Typography variant="subtitle1" sx={{ color: isDark ? '#ffffff' : '#2B211E', fontWeight: 'bold', letterSpacing: '0.02em' }}>Logistic & Visibility</Typography>
                </Box>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <CustomInputField label="Secondary Contact Number" placeholder="+963..." />
                        <Box sx={{ mt: 1 }}>
                            <RadioGroup row value={logisticData.publishingStatus} onChange={(e) => setLogisticData(prev => ({ ...prev, publishingStatus: e.target.value }))}>
                                <FormControlLabel value="public" control={<Radio sx={{ color: isDark ? '#c5a059' : '#b38c45' }} />} label="Display to public" sx={{ color: isDark ? '#ffffff' : '#2B211E', mr: 4 }} />
                                <FormControlLabel value="draft" control={<Radio sx={{ color: isDark ? '#c5a059' : '#b38c45' }} />} label="Save as private draft" sx={{ color: isDark ? '#ffffff' : '#2B211E' }} />
                            </RadioGroup>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <FormControlLabel control={<Checkbox sx={{ color: isDark ? '#261d19' : 'rgba(179, 140, 69, 0.3)', '&.Mui-checked': { color: isDark ? '#c5a059' : '#b38c45' } }} />} label="Cancellation before acceptance" sx={{ color: isDark ? '#eee0da' : '#2B211E' }} />
                            <FormControlLabel control={<Checkbox sx={{ color: isDark ? '#261d19' : 'rgba(179, 140, 69, 0.3)', '&.Mui-checked': { color: isDark ? '#c5a059' : '#b38c45' } }} />} label="Cancellation after acceptance" sx={{ color: isDark ? '#eee0da' : '#2B211E' }} />
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start', borderTop: isDark ? '1px solid #261d19' : '1px solid rgba(179, 140, 69, 0.2)', pt: 4, pb: 4 }}>
                <Box sx={{ width: '240px' }}><Button text="PUBLISH PRODUCT" icon={<ArrowForwardIcon fontSize="small" />} /></Box>
                <Box component="button" sx={{ px: 4, py: '12px', backgroundColor: 'transparent', border: isDark ? '1px solid #261d19' : '1px solid rgba(179, 140, 69, 0.4)', color: isDark ? '#ffffff' : '#2B211E', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', letterSpacing: '0.05em', transition: 'all 0.3s', '&:hover': { backgroundColor: isDark ? '#261d19' : 'rgba(179, 140, 69, 0.05)' }, '&:active': { transform: 'scale(0.97)' } }}>SAVE FOR LATER</Box>
            </Box>
        </Box>
    );
}

export default AddProductPage;