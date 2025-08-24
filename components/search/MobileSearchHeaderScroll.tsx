'use client';

import { useScrollDirection } from "@/hooks/useScrollDirection";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const MobileSearchHeaderScroll = ({ children }: { children: React.ReactNode }) => {
    const scrollDirection = useScrollDirection();
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (scrollDirection === 'down') setIsVisible(false);
        else if (scrollDirection === 'up') setIsVisible(true);
    }, [scrollDirection]);
    
    const showSearchBar = pathname === '/' || pathname === '/favorites';
    if (!showSearchBar) return null;

    return (
        <div className={`
            fixed top-0 w-full bg-white z-40 p-4 md:hidden
            transition-transform duration-300 ease-in-out
            ${isVisible ? 'translate-y-0' : '-translate-y-full'}
        `}>
            {children}
        </div>
    );
}

export default MobileSearchHeaderScroll;