'use client';

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiOutlineHeart, AiOutlineSearch, AiOutlineUser } from "react-icons/ai";
import useAuthModal from "@/hooks/useAuthModal";

const MobileTabBar = () => {
    const { data: session } = useSession();
    const pathname = usePathname();
    const authModal = useAuthModal(); // CORRECTED LINE

    const routes = [
        {
            label: "Explore",
            icon: AiOutlineSearch,
            href: '/',
            active: pathname === '/',
        },
        {
            label: "Favorites",
            icon: AiOutlineHeart,
            href: '/favorites',
            active: pathname === '/favorites',
        },
        {
            label: session ? "Profile" : "Log in",
            icon: AiOutlineUser,
            href: session ? '/seller/dashboard' : '#', // Or a profile page
            active: false, // Active state not needed for login/profile
        }
    ];

    return (
        <div className="
            fixed bottom-0 w-full bg-white border-t-[1px] z-40
            md:hidden 
        ">
            <div className="flex justify-around items-center h-16">
                {routes.map((item) => (
                    <Link
                        href={item.href}
                        key={item.label}
                        onClick={(e) => {
                            if (!session && item.label === 'Log in') {
                                e.preventDefault(); // Prevent navigation for '#' link
                                authModal.onOpen();
                            }
                        }}
                        className={`
                            flex flex-col items-center justify-center gap-1
                            transition
                            ${item.active ? 'text-rose-500' : 'text-neutral-500'}
                        `}
                    >
                        <item.icon size={26} />
                        <span className="text-xs font-semibold">{item.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default MobileTabBar;