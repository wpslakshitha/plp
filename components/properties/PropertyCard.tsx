'use client';

import { Property } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import HeartButton from "../ui/HeartButton";
import { FaStar } from "react-icons/fa";
import { useState, MouseEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // npm install lucide-react

interface PropertyCardProps {
  data: Property;
  currentUser?: any;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ data, currentUser }) => {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isFavorited = currentUser?.favoriteProperties?.some((fav: Property) => fav.id === data.id) || false;

  const images = data.imageUrls && data.imageUrls.length > 0 ? data.imageUrls : ['/images/placeholder.jpg'];

  const prevImage = (e: MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const nextImage = (e: MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="col-span-1 cursor-pointer group">
      <div className="flex flex-col gap-1 w-full">
        {/* Image Carousel */}
        <div 
          onClick={() => router.push(`/properties/${data.id}`)}
          className="aspect-square w-full relative overflow-hidden rounded-xl"
        >
          <Image
            fill
            className="object-cover h-full w-full transition duration-300"
            src={images[currentImageIndex]}
            alt={data.title}
          />
          <div className="absolute top-3 right-3 z-10">
            <HeartButton propertyId={data.id} isFavorited={isFavorited} />
          </div>
          {images.length > 1 && (
            <>
              <div className="hidden group-hover:flex absolute top-1/2 -translate-y-1/2 left-2 z-10 items-center justify-center">
                <button onClick={prevImage} className="bg-white/80 hover:bg-white rounded-full p-1.5 transition">
                  <ChevronLeft size={18} className="text-black" />
                </button>
              </div>
              <div className="hidden group-hover:flex absolute top-1/2 -translate-y-1/2 right-2 z-10 items-center justify-center">
                <button onClick={nextImage} className="bg-white/80 hover:bg-white rounded-full p-1.5 transition">
                  <ChevronRight size={18} className="text-black" />
                </button>
              </div>
            </>
          )}
        </div>
        
        {/* Property Info */}
        <div className="flex justify-between items-start mt-1">
            <div className="flex-grow">
                <div className="font-bold text-gray-800 text-[15px]">
                    {data.location}
                </div>
                <div className="font-light text-neutral-500 text-sm">
                    {data.title}
                </div>
                <div className="flex flex-row items-center gap-1 mt-1">
                    <div className="font-semibold text-gray-800 text-sm">
                        LKR {data.price.toLocaleString()}
                    </div>
                    <div className="font-light text-gray-600 text-sm">per month</div>
                </div>
            </div>
            {/* Star Rating (Placeholder) */}
            <div className="flex items-center gap-1 text-sm">
                <FaStar />
                <span>4.85</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;