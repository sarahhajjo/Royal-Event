import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import StarIcon from '@mui/icons-material/Star';

function TopPerformingServices({ servicesData }) {
    const defaultServices = servicesData || [
        { id: 1, title: 'The Grand Reserve', sub: 'Signature Ballroom', rating: '4.9 (128)', img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=300' },
        { id: 2, title: 'Sky Terrace Lounge', sub: 'Rooftop Experience', rating: '4.7 (89)', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=300' }
    ];

    return (
        <Paper elevation={0} sx={{ p: 3, backgroundColor: '#140e0c', border: '1px solid rgba(78, 70, 57, 0.15)', borderRadius: '16px', width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Typography sx={{ color: '#eee0da', fontSize: '18px', fontFamily: "'Playfair Display', serif" }}>
                    Top Performing Services
                </Typography>
                <Typography sx={{ color: '#c5a059', fontSize: '12px', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                    VIEW ALL →
                </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2.5 }}>
                {defaultServices.map((service) => (
                    <Box key={service.id} sx={{ display: 'flex', gap: 2, p: 1.5, backgroundColor: '#1c1512', border: '1px solid rgba(78, 70, 57, 0.1)', borderRadius: '12px', alignItems: 'center', textAlign: 'left' }}>
                        <Box component="img" src={service.img} sx={{ width: 64, height: 64, borderRadius: '8px', objectFit: 'cover' }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                            <Typography sx={{ color: '#eee0da', fontSize: '14px', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>{service.title}</Typography>
                            <Typography sx={{ color: '#8a7f70', fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>{service.sub}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.4 }}>
                                <StarIcon sx={{ color: '#c5a059', fontSize: '13px' }} />
                                <Typography sx={{ color: '#c5a059', fontSize: '11px', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>{service.rating}</Typography>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
}

export default TopPerformingServices;