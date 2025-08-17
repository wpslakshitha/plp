'use client';

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface HeartButtonProps {
  propertyId: string;
  isFavorited: boolean;
}

const HeartButton: React.FC<HeartButtonProps> = ({ propertyId, isFavorited }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const toggleFavorite = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent card click event from firing

    if (!session?.user) {
      // You can open the login modal here later
      alert("Please login to favorite properties.");
      return;
    }

    try {
      if (isFavorited) {
        await axios.delete(`/api/favorites/${propertyId}`);
      } else {
        await axios.post(`/api/favorites/${propertyId}`);
      }
      router.refresh(); // Refresh to show the updated favorite status
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  return (
    <div
      onClick={toggleFavorite}
      className="
        relative
        hover:opacity-80
        transition
        cursor-pointer
      "
    >
      <AiOutlineHeart
        size={28}
        className="
          fill-white
          absolute
          -top-[2px]
          -right-[2px]
        "
      />
      <AiFillHeart
        size={24}
        className={
          isFavorited ? 'fill-rose-500' : 'fill-neutral-500/70'
        }
      />
    </div>
  );
};

export default HeartButton;