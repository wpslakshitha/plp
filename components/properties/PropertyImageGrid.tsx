'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles - VERY IMPORTANT
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface PropertyImageGridProps {
  imageUrls: string[];
}

const PropertyImageGrid: React.FC<PropertyImageGridProps> = ({ imageUrls }) => {
  // Use placeholder if no images are available
  const images = imageUrls && imageUrls.length > 0 ? imageUrls : ['/images/placeholder.jpg'];

  return (
    <div className="
      w-full 
      h-[50vh] md:h-[60vh] md:max-h-[550px]
      overflow-hidden 
      md:rounded-xl 
      relative
    ">
      {/* --- MOBILE VIEW: Image Slider (Swiper) --- */}
      <div className="md:hidden w-full h-full relative">
        <Swiper
          modules={[Pagination, Navigation]}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation
          loop={true}
          className="h-full w-full"
        >
          {images.map((src, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                <Image 
                  src={src} 
                  alt={`Property Image ${index + 1}`} 
                  fill 
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
         {/* Image Counter like Airbnb */}
         <div className="absolute bottom-4 right-4 z-10 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {images.length > 0 ? `1 / ${images.length}` : '0 / 0'}
        </div>
      </div>

      {/* --- DESKTOP VIEW: Image Grid --- */}
      <div className="
        hidden
        md:grid
        w-full
        h-full
        grid-cols-4
        grid-rows-2
        gap-2
      ">
        {/* Main Image */}
        <div className="col-span-2 row-span-2 relative cursor-pointer group">
          <Image 
              src={images[0]} 
              alt="Property Main Image" 
              fill 
              className="object-cover w-full h-full group-hover:scale-105 transition"
          />
        </div>

        {/* Secondary Images */}
        <div className="col-span-2 row-span-2 grid grid-cols-2 grid-rows-2 gap-2">
          {(images.slice(1, 5).length > 0 ? images.slice(1, 5) : [images[0], images[0], images[0], images[0]]).map((src, index) => (
            <div key={index} className="relative cursor-pointer group">
              <Image 
                  src={src || images[0]} 
                  alt={`Property Image ${index + 2}`} 
                  fill 
                  className="object-cover w-full h-full group-hover:scale-105 transition"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyImageGrid;