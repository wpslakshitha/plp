'use client';
import { useEffect } from 'react';
import axios from 'axios';

export default function ViewTracker({ propertyId }: { propertyId: string }) {
    useEffect(() => {
        const trackView = async () => {
            try {
                await axios.post(`/api/properties/view/${propertyId}`);
            } catch (error) {
                // Ignore errors, as they are likely duplicates
            }
        };
        trackView();
    }, [propertyId]);
    return null; // This component renders nothing
}