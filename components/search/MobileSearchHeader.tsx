'use client';

import { BiSearch } from "react-icons/bi";

const MobileSearchHeader = () => {
    return (
        <div className="fixed top-0 w-full bg-white z-20 p-4 md:hidden">
            <div
                // onClick={() => openSearchModal()} // Can be linked to a modal later
                className="
                    w-full py-3 px-4 border-[1px] rounded-full shadow-md
                    flex items-center gap-4 cursor-pointer
                "
            >
                <BiSearch size={24} className="text-neutral-700" />
                <div>
                    <p className="font-bold text-sm">Where to?</p>
                    <p className="text-xs text-neutral-500">Any location · Any type</p>
                </div>
            </div>
        </div>
    );
};

export default MobileSearchHeader;