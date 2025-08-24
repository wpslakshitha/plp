'use client';

import { usePathname, useSearchParams } from "next/navigation";
import useMobileSearchModal from "@/hooks/useMobileSearchModal";
import { BiSearch } from "react-icons/bi";

const MobileSearchHeaderClient = () => {
  const searchModal = useMobileSearchModal();
  const params = useSearchParams();

  const locationValue = params.get('location');
  const propertyTypeValue = params.get('propertyType');
  const mainText = locationValue || "Where to?";
  const subText = propertyTypeValue
    ? `${propertyTypeValue.charAt(0).toUpperCase() + propertyTypeValue.slice(1).toLowerCase()} property`
    : "Any location · Any type";

  return (
    <div
      onClick={searchModal.onOpen}
      className="
        w-full py-3 px-4 border-[1px] rounded-full shadow-md
        flex items-center gap-4 cursor-pointer
      "
    >
      <BiSearch size={24} className="text-neutral-700" />
      <div>
        <p className="font-bold text-sm">{mainText}</p>
        <p className="text-xs text-neutral-500">{subText}</p>
      </div>
    </div>
  );
};

export default MobileSearchHeaderClient;