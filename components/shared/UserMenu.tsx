'use client';

import { AiOutlineMenu } from 'react-icons/ai';
import { useCallback, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import useAuthModal from '@/hooks/useAuthModal';

interface MenuItemProps {
  onClick: () => void;
  label: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ onClick, label }) => (
  <div onClick={onClick} className="px-4 py-3 hover:bg-neutral-100 transition font-semibold">
    {label}
  </div>
);

export default function UserMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
    const authModal = useAuthModal(); // Use the hook

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer">
          Become a host
        </div>
        <div
          onClick={toggleOpen}
          className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            {/* Placeholder for user avatar */}
            <div className="bg-gray-500 rounded-full w-7 h-7"></div>
          </div>
        </div>
      </div>
 {isOpen && (
        <div className="
          absolute 
          rounded-xl 
          shadow-md 
          w-[40vw] 
          md:w-3/4 
          bg-white 
          overflow-hidden 
          right-0 
          top-12 
          text-sm
          z-50  {/* <-- ADD THIS CLASS */}
        ">
          <div className="flex flex-col cursor-pointer">
            {session?.user ? (
              <>
               <Link href="/favorites"><MenuItem onClick={toggleOpen} label="My Favorites" /></Link>
                
                {/* @ts-ignore --- Check for SELLER role */}
                {session.user.role === 'SELLER' && (
                  <Link href="/seller/dashboard"><MenuItem onClick={toggleOpen} label="My Properties" /></Link>
                )}
                
                {/* @ts-ignore --- NEW: Check for ADMIN role --- */}
                {session.user.role === 'ADMIN' && (
                  <Link href="/admin/dashboard"><MenuItem onClick={toggleOpen} label="Admin Panel" /></Link>
                )}
                <hr />
                <MenuItem onClick={() => signOut()} label="Logout" />
              </>
            ) : (
               <>
                <MenuItem onClick={() => { authModal.onOpen(); toggleOpen(); }} label="Login" />
                <MenuItem onClick={() => { authModal.onOpen(); toggleOpen(); }} label="Sign up" />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}