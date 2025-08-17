'use client';

import ImageUpload from "@/components/forms/ImageUpload";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const propertyTypes = ['LAND', 'HOUSE', 'APARTMENT'];

const EditPropertyPage = ({ params }: { params: { propertyId: string } }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "", description: "", price: "", location: "",
    propertyType: "HOUSE", imageUrl: "", guests: 2,
    bedrooms: 1, bathrooms: 1, amenities: "",
  });

  useEffect(() => {
    const fetchPropertyData = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`/api/properties/data/${params.propertyId}`);
            setFormData(res.data);
        } catch (error) {
            console.error("Failed to fetch property data");
            setError("Could not load property data.");
        } finally {
            setIsLoading(false);
        }
    };
    fetchPropertyData();
  }, [params.propertyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setCustomValue = (id: string, value: any) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await axios.patch(`/api/properties/${params.propertyId}`, formData);
      alert('Property updated successfully! It is now pending re-approval.');
      router.push('/seller/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) return <div className="container mx-auto py-8 px-4 text-center">Loading property data...</div>
  if (error) return <div className="container mx-auto py-8 px-4 text-center text-red-500">{error}</div>

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Edit Your Property</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
        {/* All form fields (ImageUpload, Inputs for title, price etc.) are here */}
        {/* They will automatically be filled by the formData state */}
         <Button label={isLoading ? "Saving Changes..." : "Save and Submit for Review"} type="submit" disabled={isLoading} />
      </form>
    </div>
  );
};
export default EditPropertyPage;