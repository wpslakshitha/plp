'use client';

import { Property } from "@prisma/client";

interface MobileContactFooterProps {
    property: Property;
}

const MobileContactFooter: React.FC<MobileContactFooterProps> = ({ property }) => {
    const adminPhoneNumber = "+94770172451";
    const message = `Hello, I'm interested in the property: "${property.title}" (ID: ${property.id}).`;
    const whatsappUrl = `https://wa.me/${adminPhoneNumber}?text=${encodeURIComponent(message)}`;

    const priceAsNumber = Number(property.price);

    return (
        <div className="
            fixed bottom-0 left-0 right-0 z-40
            bg-white border-t-[1px] p-4
            flex justify-between items-center
            md:hidden
        ">
            <div>
                {/* --- USE THE CONVERTED NUMBER --- */}
                <p className="font-semibold">LKR {priceAsNumber.toLocaleString('en-US')}</p>
                <p className="text-sm text-neutral-500">Total price</p>
            </div>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="
                px-6 py-3 bg-rose-500 text-white font-semibold rounded-lg
                hover:bg-rose-600 transition
            ">
                Contact Admin
            </a>
        </div>
    );
};

export default MobileContactFooter;