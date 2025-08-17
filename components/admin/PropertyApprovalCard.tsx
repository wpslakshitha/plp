'use client';

import { Property, User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Define a more specific type for the property prop
type PropertyWithSeller = Property & {
  seller: {
    name: string | null;
    email: string;
  };
};

interface PropertyApprovalCardProps {
  property: PropertyWithSeller;
}

const PropertyApprovalCard: React.FC<PropertyApprovalCardProps> = ({ property }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateStatus = async (status: 'APPROVED' | 'REJECTED') => {
    setIsLoading(true);
    try {
      await axios.patch(`/api/admin/properties/${property.id}`, { status });
      alert(`Property has been ${status.toLowerCase()}.`);
      router.refresh(); // Refresh the page to remove the card from the list
    } catch (error) {
      console.error("Failed to update property status", error);
      alert("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="col-span-1 cursor-pointer group bg-white rounded-xl border-[1px] p-4 space-y-4">
      <div className="font-semibold text-lg">{property.title}</div>
      <div className="font-light text-neutral-500">
        {property.location}
      </div>
      <div className="font-semibold">
        LKR {property.price.toLocaleString()}
      </div>
      <div className="text-sm text-neutral-600 border-t pt-2">
        <p><strong>Seller:</strong> {property.seller.name}</p>
        <p><strong>Contact:</strong> {property.seller.email}</p>
      </div>
      <div className="text-sm text-neutral-600 border-t pt-2">
        <strong>Description:</strong> {property.description}
      </div>
      <div className="flex justify-between items-center gap-4 pt-4">
        <button
          onClick={() => handleUpdateStatus('APPROVED')}
          disabled={isLoading}
          className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-70"
        >
          Approve
        </button>
        <button
          onClick={() => handleUpdateStatus('REJECTED')}
          disabled={isLoading}
          className="w-full bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition disabled:opacity-70"
        >
          Reject
        </button>
      </div>
      {isLoading && <div className="text-center text-sm">Processing...</div>}
    </div>
  );
};

export default PropertyApprovalCard;