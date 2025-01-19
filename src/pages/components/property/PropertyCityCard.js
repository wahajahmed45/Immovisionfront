'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const PropertyCityCard = ({ city, properties }) => {
  const firstProperty = properties?.[0];
  const router = useRouter();

  const handlePropertyClick = (city) => {
    router.push(`/properties?city=${encodeURIComponent(city)}`);
  };

  return (
    <div className="swiper-slide mb-65px xl:mb-50px px-15px cursor-default">
      <div className="group p-15px shadow-box-shadow-4 bg-white">
        {/* card thumbs */}
        <div className="relative leading-1">
          <div
            onClick={() => handlePropertyClick(city)}
            className="overflow-hidden cursor-pointer"
          >
            <img
              src={firstProperty?.images?.[0]?.url || ".//img/product-3/1.jpg"}
              className="w-full group-hover:scale-110 transition-all duration-700"
              alt={`Property in ${city}`}
            />
          </div>
          <div className="text-13px leading-1.8 px-15px pt-6px pb-0.5 uppercase font-semibold absolute top-4 left-[10px] bg-white rounded-full">
            {properties?.length || 0} properties
          </div>
        </div>
        {/* card body */}
        <div className="pt-25px px-5px pb-10px">
          <ul className="mb-3">
            <li className="text-sm lg:text-base">
              <div
                onClick={() => handlePropertyClick(city)}
                className="leading-1.8 lg:leading-1.8 hover:text-secondary-color flex gap-5px items-center cursor-pointer"
              >
                {city}
              </div>
            </li>
          </ul>
          <h4 className="text-17px md:text-lg lg:text-xl font-semibold text-heading-color mb-3">
            <div
              onClick={() => handlePropertyClick(city)}
              className="hover:text-secondary-color leading-1.3 cursor-pointer"
            >
              {firstProperty?.title || `Properties in ${city}`}
            </div>
          </h4>
          <div
            onClick={() => handlePropertyClick(city)}
            className="text-sm lg:text-base text-secondary-color cursor-pointer"
          >
            <span className="leading-1.8">
              View Property <i className="flaticon-right-arrow"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCityCard;
