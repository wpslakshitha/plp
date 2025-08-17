'use client';

import { Property } from "@prisma/client";
import { FaWhatsapp, FaPhone, FaEnvelope } from "react-icons/fa";

interface PropertyReservationCardProps {
  property: Property;
}

const PropertyReservationCard: React.FC<PropertyReservationCardProps> = ({ property }) => {
    const adminPhoneNumber = "947XXXXXXXX"; // Your WhatsApp/Call number
    const adminEmail = "youradmin@email.com"; // Your email

    const message = `Hello, I'm interested in the property: "${property.title}" (ID: ${property.id}). Please provide more details.`;
    const whatsappUrl = `https://wa.me/${adminPhoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden p-6 sticky top-28 shadow-xl">
            <div className="flex flex-row items-center gap-1">
                <div className="text-2xl font-semibold">LKR {property.price.toLocaleString()}</div>
            </div>
            <hr className="my-4" />
            <h3 className="font-semibold mb-4 text-center">Interested in this property?</h3>
            <div className="flex flex-col gap-3">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition">
                    <FaWhatsapp size={20} />
                    Contact via WhatsApp
                </a>
                 <a href={`tel:${adminPhoneNumber}`} className="flex items-center justify-center gap-3 w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition">
                    <FaPhone size={20} />
                    Call Us Directly
                </a>
                 <a href={`mailto:${adminEmail}`} className="flex items-center justify-center gap-3 w-full bg-gray-700 text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition">
                    <FaEnvelope size={20} />
                    Send an Email
                </a>
            </div>
            <p className="text-xs text-neutral-500 text-center mt-4">You will be contacting the admin, not the direct seller.</p>
        </div>
    );
};

export default PropertyReservationCard;