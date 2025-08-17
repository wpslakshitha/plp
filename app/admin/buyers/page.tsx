'use client';

import { useState } from "react";
import axios from "axios";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const propertyTypes = ['LAND', 'HOUSE', 'APARTMENT'];

const BuyersPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', desiredLocation: '', minBudget: '', maxBudget: '', propertyType: 'HOUSE'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.post('/api/buyers', formData);
            alert('Buyer profile created successfully!');
            // Reset form
            setFormData({ name: '', email: '', phone: '', desiredLocation: '', minBudget: '', maxBudget: '', propertyType: 'HOUSE' });
        } catch (error) {
            alert('Failed to create profile. Email might already exist.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8">Manage Buyer Profiles</h1>
            <div className="max-w-2xl">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
                    <h2 className="text-xl font-semibold">Add New Buyer Profile</h2>
                    <Input id="name" name="name" label="Buyer Name" value={formData.name} onChange={handleChange} required/>
                    <Input id="email" name="email" label="Buyer Email" type="email" value={formData.email} onChange={handleChange} required/>
                    <Input id="phone" name="phone" label="Phone Number (Optional)" value={formData.phone} onChange={handleChange} />
                    <Input id="desiredLocation" name="desiredLocation" label="Desired Location (e.g., Kandy)" value={formData.desiredLocation} onChange={handleChange} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input id="minBudget" name="minBudget" label="Min Budget (LKR)" type="number" value={formData.minBudget} onChange={handleChange} />
                        <Input id="maxBudget" name="maxBudget" label="Max Budget (LKR)" type="number" value={formData.maxBudget} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Property Type</label>
                        <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full border rounded-md p-3">
                            {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                    <Button label={isLoading ? "Saving..." : "Save Buyer Profile"} type="submit" disabled={isLoading} />
                </form>
            </div>
        </div>
    );
};

export default BuyersPage;