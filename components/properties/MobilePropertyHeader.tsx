'use client';

import { useRouter } from "next/navigation";
import { IoArrowBack, IoShareOutline } from "react-icons/io5";
import HeartButton from "../ui/HeartButton";

interface MobilePropertyHeaderProps {
  propertyId: string;
  isFavorited: boolean;
  title: string;
  location: string;
}

const MobilePropertyHeader: React.FC<MobilePropertyHeaderProps> = ({ propertyId, isFavorited, title, location }) => {
    const router = useRouter();

    const handleShare = async () => {
        const shareData = {
            title: `Check out this property: ${title}`,
            text: `A beautiful property located in ${location}.`,
            url: window.location.href,
        };

        // Check if the Web Share API is supported by the browser
        if (navigator.share) {
            try {
                await navigator.share(shareData);
                console.log('Property shared successfully');
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            // Fallback for browsers that don't support Web Share API (e.g., desktop)
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <div className="
            md:hidden 
            fixed top-0 left-0 right-0 z-20 
            flex justify-between items-center p-4
        ">
            <button onClick={() => router.back()} className="bg-white/80 rounded-full p-2 shadow-md backdrop-blur-sm">
                <IoArrowBack size={22} />
            </button>
            <div className="flex items-center gap-4">
                <button onClick={handleShare} className="bg-white/80 rounded-full p-2 shadow-md backdrop-blur-sm">
                    <IoShareOutline size={22} />
                </button>
                <div className="bg-white/80 rounded-full p-1.5 shadow-md backdrop-blur-sm">
                   <HeartButton propertyId={propertyId} isFavorited={isFavorited} />
                </div>
            </div>
        </div>
    );
};

export default MobilePropertyHeader;