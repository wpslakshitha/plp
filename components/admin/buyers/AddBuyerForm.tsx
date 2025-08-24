'use client';

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const propertyTypes = ['ANY', 'LAND', 'HOUSE', 'APARTMENT'];

const AddBuyerForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Define the initial state for the form
    const initialState = {
        name: '', 
        email: '', 
        phone: '', 
        desiredLocation: '', 
        minBudget: '', 
        maxBudget: '', 
        propertyType: 'ANY'
    };
    
    const [formData, setFormData] = useState(initialState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await axios.post('/api/buyers', formData);
            alert('Buyer profile created successfully!');
            setFormData(initialState); // Reset form to initial state
            router.refresh(); // Crucial for updating the list in BuyerList component
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create profile. Email might already exist.');
            alert(error);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border space-y-4 sticky top-24">
            <h2 className="text-xl font-semibold text-neutral-800">Add New Buyer Profile</h2>
            <hr />
            
            <Input id="name" name="name" label="Buyer Name" value={formData.name} onChange={handleChange} disabled={isLoading} required/>
            <Input id="email" name="email" label="Buyer Email" type="email" value={formData.email} onChange={handleChange} disabled={isLoading} required/>
            <Input id="phone" name="phone" label="Phone Number (Optional)" value={formData.phone} onChange={handleChange} disabled={isLoading} />
            
            <h3 className="font-semibold text-neutral-700 pt-2">Buyer Preferences</h3>
            <hr />
            
            <Input id="desiredLocation" name="desiredLocation" label="Desired Location (e.g., Kandy)" value={formData.desiredLocation} onChange={handleChange} disabled={isLoading} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input id="minBudget" name="minBudget" label="Min Budget (LKR)" type="number" value={formData.minBudget} onChange={handleChange} disabled={isLoading} />
                <Input id="maxBudget" name="maxBudget" label="Max Budget (LKR)" type="number" value={formData.maxBudget} onChange={handleChange} disabled={isLoading} />
            </div>
            
            <div>
                <label htmlFor="propertyType" className="text-sm font-medium text-gray-700">Preferred Property Type</label>
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
            
            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="pt-2">
                <Button label={isLoading ? "Saving..." : "Save Buyer Profile"} type="submit" disabled={isLoading} />
            </div>
        </form>
    );
};

export default AddBuyerForm;