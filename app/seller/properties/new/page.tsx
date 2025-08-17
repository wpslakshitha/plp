'use client';

import ImageUpload from "@/components/forms/ImageUpload";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Matches the Prisma Enum
const propertyTypes = ['LAND', 'HOUSE', 'APARTMENT'];

const NewPropertyPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    propertyType: "HOUSE",
    imageUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post('/api/properties', formData);
      alert('Property listed successfully! It is now pending for review.');
      router.push('/seller/dashboard'); // Redirect to dashboard after success
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

    const setCustomValue = (id: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">List a New Property</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
        <ImageUpload
          value={formData.imageUrl}
          onChange={(value) => setCustomValue('imageUrl', value)}
        />
        <Input 
          id="title" 
          name="title" 
          label="Property Title (e.g., 2 Bedroom House in Colombo 5)" 
          value={formData.title} 
          onChange={handleChange}
          disabled={isLoading}
          required
        />
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            id="description" 
            name="description"
            rows={4}
            className="w-full border rounded-md p-2"
            value={formData.description}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            id="price" 
            name="price"
            label="Price (LKR)" 
            type="number"
            value={formData.price}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          <Input 
            id="location" 
            name="location"
            label="Location (e.g., Kandy)" 
            value={formData.location}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input id="guests" name="guests" label="Max Guests" type="number" /* ... */ />
          <Input id="bedrooms" name="bedrooms" label="Bedrooms" type="number" /* ... */ />
          <Input id="bathrooms" name="bathrooms" label="Bathrooms" type="number" /* ... */ />
        </div>
        <div>
            <label>Amenities (comma separated)</label>
            <Input id="amenities" name="amenities" label="e.g., Wifi, Kitchen, Parking" /* ... */ />
        </div>
        <div>
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
            <select
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="w-full border rounded-md p-3"
                disabled={isLoading}
            >
                {propertyTypes.map(type => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}</option>
                ))}
            </select>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="pt-4">
          <Button label={isLoading ? "Submitting..." : "Submit for Review"} type="submit" disabled={isLoading} />
        </div>
      </form>
    </div>
  );
};

export default NewPropertyPage;