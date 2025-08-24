'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiGrid, FiCheckSquare, FiUsers, FiSliders, FiBriefcase, FiX, FiMenu } from 'react-icons/fi';
import { useState } from 'react';

const adminRoutes = [
    { label: "Dashboard", href: "/admin/dashboard", icon: FiGrid },
    { label: "Approvals", href: "/admin/approvals", icon: FiCheckSquare },
    { label: "Buyer Profiles", href: "/admin/buyers", icon: FiUsers },
    { label: "Matchmaking", href: "/admin/matchmaking", icon: FiBriefcase },
    { label: "Settings", href: "/admin/settings", icon: FiSliders },
];

const SidebarContent = () => {
    const pathname = usePathname();
    return (
        <>
            <div className="p-6 border-b">
                <h1 className="text-xl font-bold text-rose-500">Admin Panel</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {adminRoutes.map((route) => (
                    <Link 
                        href={route.href}
                        key={route.href}
                        className={`
                            flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                            ${pathname === route.href 
                                ? 'bg-rose-500 text-white shadow-md' 
                                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'}
                        `}
                    >
                        <route.icon size={20} />
                        <span className="font-semibold">{route.label}</span>
                    </Link>
                ))}
            </nav>
        </>
    );
}

const AdminSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r fixed top-0 left-0">
                <SidebarContent />
            </aside>

            {/* Mobile Header with Hamburger Menu */}
            <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b h-16 flex items-center px-4">
                <button onClick={() => setIsOpen(true)}>
                    <FiMenu size={24} />
                </button>
                 <h1 className="text-lg font-bold text-rose-500 ml-4">Admin Panel</h1>
            </header>
            
            {/* Mobile Sidebar (Off-canvas) */}
            {isOpen && (
                <div className="md:hidden fixed inset-0 z-50">
                    {/* Backdrop */}
                    <div onClick={() => setIsOpen(false)} className="absolute inset-0 bg-black/60"></div>
                    {/* Sidebar */}
                    <aside className="absolute top-0 left-0 w-64 h-full bg-white flex flex-col">
                         <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-neutral-500">
                            <FiX size={24} />
                        </button>
                        <SidebarContent />
                    </aside>
                </div>
            )}
        </>
    );
};

export default AdminSidebar;