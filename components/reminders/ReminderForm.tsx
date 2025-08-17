'use client';

import { useState } from "react";
import axios from "axios";
import Input from "../ui/Input";
import Button from "../ui/Button";

const propertyTypes = ['LAND', 'HOUSE', 'APARTMENT'];

const ReminderForm = () => {
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            alert("Email is required to set a reminder.");
            return;
        }
        setIsLoading(true);
        try {
            await axios.post('/api/reminders', { email, location, maxPrice });
            alert("Success! We will notify you when a matching property is listed.");
            setEmail('');
            setLocation('');
            setMaxPrice('');
        } catch (error) {
            alert("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-neutral-100 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Never Miss a Property!</h2>
            <p className="text-neutral-600 mb-6">Set an alert and we'll email you when new properties that match your criteria are listed.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input id="email" label="Your Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input id="location" label="Preferred Location (Optional)" value={location} onChange={(e) => setLocation(e.target.value)} />
                    <Input id="maxPrice" label="Max Budget (LKR) (Optional)" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                </div>
                <div className="pt-2">
                    <Button label={isLoading ? "Setting Alert..." : "Set Alert"} type="submit" disabled={isLoading} />
                </div>
            </form>
        </div>
    );
};

export default ReminderForm;