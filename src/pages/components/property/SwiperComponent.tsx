'use client'
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import { useRef } from 'react';
import { PropertyDTO } from '@/types/PropertyDTO';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

interface SwiperComponentProps {
  property?: PropertyDTO | null;
}

const SwiperComponent: React.FC<SwiperComponentProps> = ({ property }) => {
  const swiperRef = useRef<SwiperType | null>(null);
  
  // Ensure images is always an array, with a fallback empty array
  const images = property?.imageUrl || [];
  
  // If no images, return null or a placeholder
  if (images.length === 0) {
    return (
      <div className="relative w-full px-4 py-8 min-h-[500px] flex items-center justify-center">
        <p>No images available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full px-4 py-8">
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
          slideShadows: false,
        }}
        pagination={{
          clickable: true,
          el: '.swiper-pagination'
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="w-full !overflow-visible"
        onSwiper={(swiper) => (swiperRef.current = swiper)}
      >
        {images.map((imageUrl: string, index: number) => (
          <SwiperSlide key={index} className="!w-[900px] !h-[500px]">
            <div className="relative w-full h-full group">
              <img
                className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                src={imageUrl}
                alt={`Property image ${index + 1}`}
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            </div>
          </SwiperSlide>
        ))}

        <div className="swiper-pagination absolute bottom-4 !z-50"></div>
        
        <button className="swiper-button-prev !w-12 !h-12 !bg-white/80 backdrop-blur-sm rounded-full !text-gray-800 hover:!bg-white transition-all duration-300 !left-4 opacity-0 group-hover:opacity-100">
          <i className="fas fa-arrow-left text-sm"></i>
        </button>
        <button className="swiper-button-next !w-12 !h-12 !bg-white/80 backdrop-blur-sm rounded-full !text-gray-800 hover:!bg-white transition-all duration-300 !right-4 opacity-0 group-hover:opacity-100">
          <i className="fas fa-arrow-right text-sm"></i>
        </button>
      </Swiper>

      <style jsx global>{`
        .swiper-button-next::after,
        .swiper-button-prev::after {
          display: none;
        }
        
        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: white;
          opacity: 0.5;
          transition: all 0.3s;
        }
        
        .swiper-pagination-bullet-active {
          width: 20px;
          border-radius: 4px;
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default SwiperComponent;