'use client'
import { useEffect, useState } from "react";
import { getProperties } from "@/services/property/PropertyServices";
import PropertyCard from "./PropertyCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const FeaturedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProperties();
        setProperties(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des propriétés :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!properties || properties.length === 0) {
    return <div>No properties available.</div>;
  }
  if (loading) {
    return <p>Loading featured properties...</p>;
  }

  return (
    <div className="featured-apartments relative group">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        pagination={{
          clickable: true,
          el: '.swiper-pagination',
        }}
        breakpoints={{
          768: {
            slidesPerView: 2,
          },
          1200: {
            slidesPerView: 3,
          },
        }}
        className="featured-apartments-slider2"
      >
        {properties.map((property) => {
          return (
            <SwiperSlide key={property.id} className="mb-65px px-15px">
              <PropertyCard key={property.id} property={property} />
            </SwiperSlide>
          );
        })}

        <div className="swiper-pagination !bottom-0"></div>
        
        <button className="swiper-button-prev after:!content-none !w-[60px] !h-[60px] !bg-white !left-[5%] lg:!left-[2%] rounded-full shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <i className="fas fa-arrow-left text-gray-500"></i>
        </button>
        <button className="swiper-button-next after:!content-none !w-[60px] !h-[60px] !bg-white !right-[5%] lg:!right-[2%] rounded-full shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <i className="fas fa-arrow-right text-gray-500"></i>
        </button>
      </Swiper>
    </div>
  );
};

export default FeaturedProperties;