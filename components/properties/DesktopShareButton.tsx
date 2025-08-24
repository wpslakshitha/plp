'use client';

import { useState } from "react";
import { IoShareOutline, IoCheckmarkDoneSharp } from "react-icons/io5";

const DesktopShareButton = () => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        // Reset the icon back to normal after 2 seconds
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <button onClick={handleCopy} className="flex items-center gap-1 hover:underline">
            {copied ? (
                <>
                    <IoCheckmarkDoneSharp size={18} className="text-green-500" />
                    <span className="text-green-500 font-semibold">Copied!</span>
                </>
            ) : (
                <>
                    <IoShareOutline size={18} />
                    <span>Share</span>
                </>
            )}
        </button>
    );
};

export default DesktopShareButton;