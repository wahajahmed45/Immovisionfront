'use client'
import { useEffect, useState } from "react";
import { getPropertiesByCity } from "@/services/property/PropertyServices";
import PropertyCityCard from "./PropertyCityCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const CityProperties = () => {
  const [propertiesByCity, setPropertiesByCity] = useState(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPropertiesByCity();
        const propertiesMap = new Map(Object.entries(data));
        setPropertiesByCity(propertiesMap);
      } catch (error) {
        console.error("Erreur lors de la récupération des propriétés :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading city properties...</p>;
  }

  if (propertiesByCity.size === 0) {
    return <div>No properties available.</div>;
  }

  return (
    <div className="city-properties relative group">
      <h2 className="text-center text-3xl font-bold mb-8">Properties By Location</h2>
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
        className="city-properties-slider"
      >
        {Array.from(propertiesByCity.entries()).map(([city, properties]) => (
          <SwiperSlide key={city} className="mb-65px px-15px">
            <PropertyCityCard city={city} properties={properties} />
          </SwiperSlide>
        ))}

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

export default CityProperties;