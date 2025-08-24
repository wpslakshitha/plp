'use client';

import { BuyerProfile, PropertyType } from "@prisma/client";
import { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiSearch, FiHome, FiMapPin, FiMaximize, FiTag } from "react-icons/fi";
import { useRouter } from "next/navigation";
import axios from "axios";
import { IconType } from 'react-icons'; // Import IconType

const propertyTypeIcons: Record<PropertyType | 'ANY', IconType> = {
    HOUSE: FiHome,
    APARTMENT: FiMaximize,
    LAND: FiMapPin,
    ANY: FiTag
};

export default function BuyerList({ initialBuyers }: { initialBuyers: BuyerProfile[] }) {
     const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [buyers, setBuyers] = useState(initialBuyers);

    useEffect(() => {
        const filtered = initialBuyers.filter(buyer => 
            buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            buyer.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setBuyers(filtered);
    }, [searchTerm, initialBuyers]);
    
    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('Delete this buyer profile?')) {
            await axios.delete(`/api/buyers/${id}`);
            router.refresh();
        }
    };

    // Helper to generate a consistent avatar from a name
    const generateAvatarUrl = (name: string) => `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                <h2 className="text-xl font-semibold">Existing Buyers ({buyers.length})</h2>
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input 
                        type="text"
                        placeholder="Search name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-auto"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {buyers.map(buyer => {
                    const PropertyIcon = propertyTypeIcons[buyer.propertyType || 'ANY'];
                    return (
                        <div key={buyer.id} className="
                            p-4 rounded-2xl border border-neutral-200 
                            hover:bg-neutral-50 transition-all
                            grid grid-cols-12 gap-4 items-center
                        ">
                                                        {/* Avatar */}
<div className="col-span-2 sm:col-span-1 flex-shrink-0">
                                <img 
                                    src={generateAvatarUrl(buyer.name)} 
                                    alt={`${buyer.name}'s avatar`}
                                    width={48} 
                                    height={48} 
                                    className="rounded-full object-cover"
                                />
                            </div>

                            {/* Name & Contact */}
                            <div className="col-span-10 sm:col-span-4">
                                <p className="font-bold text-neutral-800">{buyer.name}</p>
                                <p className="text-sm text-neutral-500 truncate">{buyer.email}</p>
                            </div>

                            {/* Preferences */}
                            <div className="col-span-12 sm:col-span-5 flex items-center gap-4 text-sm text-neutral-600">
                                <div className="flex items-center gap-2" title="Preferred Property Type">
                                    <PropertyIcon className="text-rose-500"/>
                                    <span>{buyer.propertyType || 'Any'}</span>
                                </div>
                                {buyer.desiredLocation && (
                                    <div className="flex items-center gap-2" title="Desired Location">
                                        <FiMapPin className="text-rose-500"/>
                                        <span>{buyer.desiredLocation}</span>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="col-span-12 sm:col-span-2 flex items-center justify-end gap-2">
                               <button title="Edit Buyer" className="p-2 hover:bg-indigo-100 rounded-full text-indigo-600"><FiEdit2 /></button>
                               <button onClick={(e) => handleDelete(e, buyer.id)} title="Delete Buyer" className="p-2 hover:bg-red-100 rounded-full text-red-600"><FiTrash2 /></button>
                            </div>
                        </div>
                    );
                })}
            </div>
            {buyers.length === 0 && <p className="text-center text-neutral-500 py-8">No buyers found.</p>}
        </div>
    );
}