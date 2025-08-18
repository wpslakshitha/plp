'use client';

import { usePathname, useSearchParams } from "next/navigation"; // Import useSearchParams
import { BiSearch } from "react-icons/bi";
import useMobileSearchModal from "@/hooks/useMobileSearchModal";

const MobileSearchHeader = () => {
  const pathname = usePathname();
  const searchModal = useMobileSearchModal();
  const params = useSearchParams(); // Get the search params object

  const showSearchBar = pathname === '/' || pathname === '/favorites';

  // --- NEW DYNAMIC TEXT LOGIC ---
  const locationValue = params.get('location');
  const propertyTypeValue = params.get('propertyType');

  // Create the main text to display
  const mainText = locationValue || "Where to?";

  // Create the sub-text to display
  const subText = propertyTypeValue
    ? `${propertyTypeValue.charAt(0).toUpperCase() + propertyTypeValue.slice(1).toLowerCase()} property`
    : "Any location · Any type";

  if (!showSearchBar) {
    return null;
  }

  return (
    <div className="fixed top-0 w-full bg-white z-20 p-4 md:hidden">
      <div
        onClick={searchModal.onOpen}
        className="
          w-full py-3 px-4 border-[1px] rounded-full shadow-md
          flex items-center gap-4 cursor-pointer
        "
      >
        <BiSearch size={24} className="text-neutral-700" />
        <div>
          {/* --- RENDER DYNAMIC TEXT --- */}
          <p className="font-bold text-sm">{mainText}</p>
          <p className="text-xs text-neutral-500">{subText}</p>
        </div>
      </div>
    </div>
  );
};

export default MobileSearchHeader;