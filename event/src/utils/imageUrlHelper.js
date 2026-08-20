import axios from 'axios';
import { useState, useEffect } from 'react';

// 💡 استخراج الرابط الأساسي ديناميكياً بناءً على مفتاح التبديل
export const getBackendUrl = () => {
    const mode = import.meta.env.VITE_ENV_MODE || 'local';
    const apiUrl = mode === 'ngrok'
        ? import.meta.env.VITE_API_NGROK
        : import.meta.env.VITE_API_LOCAL;

    // نحذف كلمة /api من الأخير لنحصل على الرابط الجذري للسيرفر
    return (apiUrl || 'http://127.0.0.1:8000/api').replace(/\/api\/?$/, '');
};

export const fixImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/400x300?text=No+Image";

    const url = typeof img === 'object' ? (img.original_url || img.url || img.path || img.temp_path) : img;

    if (!url || typeof url !== 'string') return "https://via.placeholder.com/400x300?text=No+Image";

    // إذا كان الرابط كاملاً من البداية، نرجعه كما هو
    if (url.startsWith('http')) return url;

    // نجلب الرابط الجذري الذي جهزناه فوق
    const BACKEND_URL = getBackendUrl();

    let cleanPath = url.startsWith('/') ? url : `/${url}`;

    // إذا كان المسار القادم من الداتابيز يبدأ بـ /uploads أو /storage
    if (cleanPath.startsWith('/uploads') || cleanPath.startsWith('/storage')) {
        return `${BACKEND_URL}${cleanPath}`;
    }

    return `${BACKEND_URL}/storage${cleanPath}`;
};

export const fetchListingImages = async (listingId) => {
    if (!listingId) return [];

    try {
        const mode = import.meta.env.VITE_ENV_MODE || 'local';
        const apiUrl = mode === 'ngrok' ? import.meta.env.VITE_API_NGROK : import.meta.env.VITE_API_LOCAL;
        const token = localStorage.getItem('token');

        const response = await axios.get(`${apiUrl}/listings/${listingId}/images`, {
            headers: token
                ? { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' }
                : { 'ngrok-skip-browser-warning': 'true' }
        });

        const images = response.data?.images || [];

        return images.map(img => ({
            id: img.id,
            url: fixImageUrl(img),
            alt: img.alt || 'Listing image'
        }));
    } catch (error) {
        console.error('Failed to fetch listing images for listing_id =', listingId, error);
        return [];
    }
};

export const useListingImages = (listingId, fallback = []) => {
    const [images, setImages] = useState(fallback);

    useEffect(() => {
        let isActive = true;

        if (!listingId) {
            setImages(fallback);
            return;
        }

        fetchListingImages(listingId).then((result) => {
            if (!isActive) return;
            if (result && result.length > 0) {
                setImages(result.map((img) => img.url));
            } else {
                setImages(fallback);
            }
        });

        return () => {
            isActive = false;
        };
    }, [listingId]);

    return images;
};