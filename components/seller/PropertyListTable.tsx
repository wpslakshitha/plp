'use client';

import { Property } from "@prisma/client";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import axios from "axios";
import { FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';

type PropertyWithViews = Property & { _count: { views: number } };
interface PropertyListProps {
  properties: PropertyWithViews[];
}

const statusStyleMap: Record<string, { bg: string; text: string; dot: string; }> = {
    'APPROVED': { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
    'PENDING': { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' },
    'REJECTED': { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
    'SOLD': { bg: 'bg-neutral-100', text: 'text-neutral-700', dot: 'bg-neutral-500' },
};

export default function PropertyList({ properties }: PropertyListProps) {
    const router = useRouter();

    const handleDelete = async (e: React.MouseEvent, propertyId: string) => {
        e.stopPropagation(); // Prevent card click from firing
        if (confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
            try {
                await axios.delete(`/api/properties/${propertyId}`);
                router.refresh();
            } catch (error) {
                alert('Failed to delete property.');
            }
        }
    };

    const handleEdit = (e: React.MouseEvent, propertyId: string) => {
        e.stopPropagation();
        router.push(`/seller/properties/edit/${propertyId}`);
    };

    return (
        <div className="space-y-4">
            {properties.map(prop => (
                <div 
                    key={prop.id} 
                    onClick={() => router.push(`/properties/${prop.id}`)}
                    className="
                        flex flex-col sm:flex-row items-center gap-4 bg-white p-4 
                        rounded-2xl shadow-sm border border-neutral-200
                        hover:shadow-md transition cursor-pointer
                    ">
                    {/* Image */}
                    <div className="w-full sm:w-40 h-32 relative rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={prop.imageUrls[0] || '/images/placeholder.jpg'} alt={prop.title} fill className="object-cover" />
                    </div>

                    {/* Info */}
                    <div className="flex-grow w-full">
                        <div className="flex justify-between items-start">
                           <div>
                               <p className="text-sm text-neutral-500">{prop.location}</p>
                               <p className="font-bold text-lg text-neutral-800">{prop.title}</p>
                           </div>
                            <div className={`
                                flex items-center gap-2 text-xs font-bold py-1 px-3 rounded-full
                                ${statusStyleMap[prop.status]?.bg || 'bg-gray-100'}
                                ${statusStyleMap[prop.status]?.text || 'text-gray-800'}
                            `}>
                                <div className={`w-2 h-2 rounded-full ${statusStyleMap[prop.status]?.dot || 'bg-gray-500'}`}></div>
                                {prop.status}
                            </div>
                        </div>
                        <div className="flex items-center gap-6 text-neutral-600 mt-4 border-t pt-3">
                            <div className="flex items-center gap-2">
                                <FiEye />
                                <span>{prop._count.views} Views</span>
                            </div>
                            <div className="font-semibold">
                                LKR {prop.price.toLocaleString()}
                            </div>
                        </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex sm:flex-col items-center justify-center gap-4 p-2">
                        <button onClick={(e) => handleEdit(e, prop.id)} className="p-2 rounded-full hover:bg-indigo-50 text-indigo-600 transition"><FiEdit2 size={20} /></button>
                        <button onClick={(e) => handleDelete(e, prop.id)} className="p-2 rounded-full hover:bg-red-50 text-red-600 transition"><FiTrash2 size={20} /></button>
                    </div>
                </div>
            ))}
        </div>
    );
}