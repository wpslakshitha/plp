'use client';

import Link from "next/link";
import UserMenu from "./UserMenu";
import SearchBar from "../search/SearchBar";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { usePathname } from "next/navigation"; // Import usePathname

const Navbar = () => {
    const scrollPosition = useScrollPosition();
    const pathname = usePathname(); // Get the current URL path
    const isScrolled = scrollPosition > 10;

    // --- NEW LOGIC: Determine if the search bar should be shown ---
    // The search bar is shown ONLY on the homepage ('/') and the favorites page ('/favorites').
    const showSearchBar = pathname === '/' || pathname === '/favorites';

    return (
        <header className="hidden md:block fixed w-full bg-white z-30">
            <div className="h-20 border-b-[1px]">
                <div className="max-w-[2520px] mx-auto px-4 sm:px-6 lg:px-10 h-full">
                    <div className="flex flex-row items-center justify-between gap-3 h-full">
                        {/* Logo */}
                        <div className="flex-1">
                            <Link href="/">
                                <div className="font-bold text-2xl text-rose-500 cursor-pointer">
                                    RealEstate
                                </div>
                            </Link>
                        </div>
                        
                        {/* SMALL Search Bar - Now conditionally rendered */}
                        {showSearchBar && (
                            <div className={`
                                flex-1 flex justify-center transition-opacity duration-300
                                ${isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                            `}>
                               <SearchBar />
                            </div>
                        )}

                        {/* User Menu */}
                        <div className="flex-1 flex justify-end">
                            <UserMenu />
                        </div>
                    </div>
                </div>
            </div>  

            {/* LARGE Search Bar - Now conditionally rendered */}
            {showSearchBar && (
                <div className={`
                    absolute top-20 left-0 right-0 w-full flex justify-center py-4 bg-white
                    transition-all duration-300
                    ${isScrolled ? 'opacity-0 invisible -translate-y-4' : 'opacity-100 visible translate-y-0'}
                `}>
                    <SearchBar />
                </div>
            )}
        </header>
    );
};

export default Navbar;