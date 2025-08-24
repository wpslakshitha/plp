// This component is now a SERVER component by default (no 'use client')

import { Suspense } from "react";
import MobileSearchHeaderClient from "./MobileSearchHeaderClient";
import MobileSearchHeaderScroll from "./MobileSearchHeaderScroll";

// This is the main wrapper that will be used in the layout
const MobileSearchHeader = () => {
  return (
    // The scroll logic is now in its own client component
    <MobileSearchHeaderScroll>
      {/* We wrap the component that uses searchParams in Suspense */}
      <Suspense fallback={<div className="h-16"></div>}>
        <MobileSearchHeaderClient />
      </Suspense>
    </MobileSearchHeaderScroll>
  );
};

export default MobileSearchHeader;