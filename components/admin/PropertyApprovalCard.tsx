'use client';

import { Property } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { FiCheck, FiX, FiClock } from 'react-icons/fi';
import { formatDistanceToNowStrict } from 'date-fns';

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleUpdateStatus = async (e: React.MouseEvent, status: 'APPROVED' | 'REJECTED') => {
    e.stopPropagation(); // Prevent the main div's onClick from firing
    setIsLoading(true);
    try {
      await axios.patch(`/api/admin/properties/${property.id}`, { status });
      router.refresh();
    } catch (error) {
      console.error("Failed to update property status", error);
      alert("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const priceAsNumber = Number(property.price);
  const timeAgo = formatDistanceToNowStrict(new Date(property.createdAt), { addSuffix: true });

  return (
    <div 
        onClick={() => router.push(`/admin/properties/${property.id}`)}
        className={`
        bg-white border rounded-xl shadow-sm
        flex items-center gap-4 p-3
        hover:shadow-md hover:border-rose-300 transition cursor-pointer
        ${isLoading ? 'opacity-50 pointer-events-none' : ''}
    `}>
      {/* Image Thumbnail */}
      <div className="w-16 h-16 relative rounded-md overflow-hidden flex-shrink-0">
        <Image src={property.imageUrls[0] || '/images/placeholder.jpg'} alt={property.title} fill className="object-cover" />
      </div>

      {/* Main Info Section (takes up most space) */}
      <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        <div>
            <p className="font-bold text-neutral-800 text-base truncate">{property.title}</p>
            <p className="text-sm text-neutral-500">{property.location}</p>
        </div>

        <div className="hidden sm:block">
            <p className="font-semibold text-neutral-700">LKR {priceAsNumber.toLocaleString('en-US')}</p>
            <p className="text-xs text-neutral-500">Listed by: {property.seller.name}</p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500">
            <FiClock size={12}/>
            <span>Submitted {timeAgo}</span>
        </div>
      </div>

      {/* Action Buttons (compact) */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={(e) => handleUpdateStatus(e, 'REJECTED')}
          title="Reject Property"
          className="p-3 rounded-full hover:bg-red-100 text-red-600 transition">
          <FiX size={18} />
        </button>
        <button
          onClick={(e) => handleUpdateStatus(e, 'APPROVED')}
          title="Approve Property"
          className="p-3 rounded-full hover:bg-green-100 text-green-600 transition">
          <FiCheck size={18} />
        </button>
      </div>
    </div>
  );
};

export default PropertyApprovalCard;