'use client';

import { Property, User } from "@prisma/client";
import { FaUserCircle } from "react-icons/fa";
import { IconType } from "react-icons";
// Import icons for amenities
import { BiWifi, BiCar, BiWind } from 'react-icons/bi';

// Define a map for amenities
const amenityMap: { [key: string]: { icon: IconType, label: string } } = {
    'wifi': { icon: BiWifi, label: 'Wifi' },
    'kitchen': { icon: FaUserCircle, label: 'Kitchen' }, // Replace with kitchen icon
    'free parking': { icon: BiCar, label: 'Free Parking' },
    'air conditioning': { icon: BiWind, label: 'Air Conditioning' },
    // Add more icons here
};

interface PropertyInfoProps {
  property: Property & { seller: { name: string | null } };
}

const PropertyInfo: React.FC<PropertyInfoProps> = ({ property }) => {
    return (
        <div className="col-span-1 md:col-span-4 flex flex-col gap-6 md:gap-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl md:text-2xl font-semibold">Entire {property.propertyType.toLowerCase()} hosted by {property.seller.name}</h2>
                    <div className="flex items-center gap-2 md:gap-4 text-neutral-500 text-sm md:text-base">
                        <span>{property.guests} guests</span>
                        <span>·</span>
                        <span>{property.bedrooms} bedrooms</span>
                        <span>·</span>
                        <span>{property.bathrooms} bathrooms</span>
                    </div>
                </div>
                 <FaUserCircle size={56} className="text-gray-400"/>
            </div>
            <hr />
            <div className="text-lg font-light text-neutral-600">
                {property.description}
            </div>
            <hr />
            <div>
                <h2 className="text-xl font-semibold mb-4">What this place offers</h2>
                <div className="grid grid-cols-2 gap-4">
                    {property.amenities.map(amenity => (
                        <div key={amenity} className="flex items-center gap-4">
                           {/* Render icon based on map */}
                           <span>{amenity}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PropertyInfo;