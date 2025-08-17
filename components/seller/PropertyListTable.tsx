'use client';

import { Property } from "@prisma/client";
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import axios from "axios";

type PropertyWithViews = Property & { _count: { views: number } };
interface PropertyListTableProps {
  properties: PropertyWithViews[];
}

const statusColorMap: Record<string, string> = {
    'APPROVED': 'bg-green-100 text-green-800',
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'REJECTED': 'bg-red-100 text-red-800',
};

export default function PropertyListTable({ properties }: PropertyListTableProps) {
    const router = useRouter();

    const handleDelete = async (propertyId: string) => {
        if (confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
            try {
                await axios.delete(`/api/properties/${propertyId}`);
                router.refresh();
            } catch (error) {
                alert('Failed to delete property.');
            }
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {properties.map(prop => (
                        <tr key={prop.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{prop.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorMap[prop.status]}`}>
                                    {prop.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap flex items-center gap-1"><AiOutlineEye /> {prop._count.views}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => router.push(`/seller/properties/edit/${prop.id}`)} className="text-indigo-600 hover:text-indigo-900"><AiOutlineEdit size={20} /></button>
                                    <button onClick={() => handleDelete(prop.id)} className="text-red-600 hover:text-red-900"><AiOutlineDelete size={20} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}