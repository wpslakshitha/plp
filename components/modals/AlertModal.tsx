'use client';

import Modal from './Modal';
import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAlertModal } from '@/hooks/useAlertModal';

const propertyTypes = ['ANY', 'LAND', 'HOUSE', 'APARTMENT'];

export default function AlertModal() {
    const alertModal = useAlertModal();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // --- FORM STATE ---
    const initialState = {
        phone: '',
        location: '',
        propertyType: 'ANY',
        maxPrice: '',
    };
    const [formData, setFormData] = useState(initialState);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setError('');
        try {
            await axios.post('/api/reminders', formData);
            alert('Success! Your alert has been set. We will notify you via SMS.');
            setFormData(initialState); // Reset form
            alertModal.onClose();
            router.refresh();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to set alert. Please try again.');
            alert(error);
        } finally {
            setIsLoading(false);
        }
    };

    // --- MODAL BODY CONTENT ---
    const bodyContent = (
      <div className="flex flex-col gap-4">
        <div className='text-center'>
            <h2 className="text-2xl font-bold">Never miss a property!</h2>
            <p className="text-neutral-500 mt-2">Set an alert and we'll SMS you when matching properties are listed.</p>
        </div>
        
        <Input 
            id="phone" 
            name="phone"
            label="Your Phone Number (e.g., +9477...)" 
            value={formData.phone} 
            onChange={handleChange} 
            disabled={isLoading}
            required
        />

        <hr className='my-2'/>
        <p className="text-neutral-600 text-sm text-center">Tell us what you're looking for (optional)</p>
        
        <Input 
            id="location" 
            name="location"
            label="Preferred Location" 
            value={formData.location} 
            onChange={handleChange}
            disabled={isLoading}
        />

        <Input 
            id="maxPrice" 
            name="maxPrice"
            label="Maximum Budget (LKR)" 
            type="number"
            value={formData.maxPrice} 
            onChange={handleChange}
            disabled={isLoading} 
        />

        <div>
            <label htmlFor="propertyType" className="text-sm font-medium text-gray-700">Property Type</label>
            <select 
                id="propertyType"
                name="propertyType" 
                value={formData.propertyType} 
                onChange={handleChange} 
                disabled={isLoading}
                className="mt-1 w-full border rounded-md p-3 bg-white"
            >
                {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
        </div>
      </div>
    );
    
    // --- MODAL FOOTER CONTENT ---
    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
             {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <Button 
                label={isLoading ? "Setting Alert..." : "Set Free Alert"} 
                onClick={handleSubmit} 
                disabled={isLoading}
            />
        </div>
    );
    
    return (
        <Modal 
            isOpen={alertModal.isOpen} 
            onClose={alertModal.onClose} 
            title="Get Property Alerts" 
            body={bodyContent} 
            footer={footerContent}
        />
    );
}