'use client';

import { useAlertModal } from "@/hooks/useAlertModal";

export default function AlertBanner() {
    const alertModal = useAlertModal();
    return (
        <div className="bg-rose-500/10 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
                <h3 className="font-bold text-rose-800 text-xl">Find Your Dream Property Faster</h3>
                <p className="text-rose-700 mt-1">Get instant SMS alerts for new listings that match your criteria.</p>
            </div>
            <button onClick={alertModal.onOpen} className="bg-rose-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-rose-600 transition w-full md:w-auto">
                Set Free Alert
            </button>
        </div>
    );
}