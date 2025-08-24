'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { FiCheck, FiX } from "react-icons/fi";
import { PropertyStatus } from "@prisma/client";

interface AdminPropertyActionsProps {
    propertyId: string;
    currentStatus: PropertyStatus;
}

const AdminPropertyActions: React.FC<AdminPropertyActionsProps> = ({ propertyId, currentStatus }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<'APPROVING' | 'REJECTING' | null>(null);

    const handleUpdateStatus = async (status: 'APPROVED' | 'REJECTED') => {
        setIsLoading(status === 'APPROVED' ? 'APPROVING' : 'REJECTING');
        try {
            await axios.patch(`/api/admin/properties/${propertyId}`, { status });
            // Redirect back to the approvals queue after action
            router.push('/admin/approvals');
            router.refresh();
        } catch (error) {
            alert("Failed to update status.");
        } finally {
            setIsLoading(null);
        }
    };
    
    // Don't show the bar if the property is already approved or rejected
    if (currentStatus !== 'PENDING') {
        return null;
    }

    return (
        <div className="
            fixed bottom-0 left-0 right-0 z-40
            bg-white border-t
            md:ml-64 
        ">
            <div className="
                container mx-auto px-4 py-3
                flex justify-end items-center gap-4
            ">
                <button 
                    onClick={() => handleUpdateStatus('REJECTED')} 
                    disabled={!!isLoading} 
                    className="
                    font-semibold px-6 py-2 rounded-lg 
                    bg-red-500/10 text-red-700 hover:bg-red-500/20 
                    transition disabled:opacity-50
                ">
                    {isLoading === 'REJECTING' ? 'Rejecting...' : 'Reject'}
                </button>
                <button 
                    onClick={() => handleUpdateStatus('APPROVED')} 
                    disabled={!!isLoading} 
                    className="
                    font-semibold px-6 py-2 rounded-lg 
                    bg-green-500 text-white hover:bg-green-600 
                    transition disabled:opacity-50
                ">
                    {isLoading === 'APPROVING' ? 'Approving...' : 'Approve'}
                </button>
            </div>
        </div>
    );
};

export default AdminPropertyActions;