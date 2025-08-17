'use client';

import { useRouter } from "next/navigation";
import { IoArrowBack, IoShareOutline } from "react-icons/io5";
import HeartButton from "../ui/HeartButton";

interface MobilePropertyHeaderProps {
  propertyId: string;
  isFavorited: boolean;
}

const MobilePropertyHeader: React.FC<MobilePropertyHeaderProps> = ({ propertyId, isFavorited }) => {
    const router = useRouter();
    return (
        <div className="
            md:hidden 
            fixed top-0 left-0 right-0 z-20 
            flex justify-between items-center p-4
        ">
            <button onClick={() => router.back()} className="bg-white/80 rounded-full p-2 shadow-md">
                <IoArrowBack size={22} />
            </button>
            <div className="flex items-center gap-4">
                <button className="bg-white/80 rounded-full p-2 shadow-md">
                    <IoShareOutline size={22} />
                </button>
                <div className="bg-white/80 rounded-full p-1.5 shadow-md">
                   <HeartButton propertyId={propertyId} isFavorited={isFavorited} />
                </div>
            </div>
        </div>
    );
};

export default MobilePropertyHeader;