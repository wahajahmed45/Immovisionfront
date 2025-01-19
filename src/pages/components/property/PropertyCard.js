'use client'
import Image from "next/image";
import Link from "next/link";

const PropertyCard = ({ property }) => {
  if (!property) {
    return <div>Loading...</div>; // or any fallback UI
  }

  const getImageUrl = () => {
    if (property.images && property.images.length > 0 && property.images[0]?.image_url) {
      return property.images[0].image_url;
    }
    return "/img/product/1.png"; // fallback image
  };

  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-[450px] flex flex-col">
      {/* Image Section */}
      <div className="relative h-[220px]">
        <Link href={`/properties/details/${property.id}`} className="block h-full">
          <Image
            src={getImageUrl()}
            alt={property.title || "Property Image"}
            width={500}
            height={375}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
            priority
          />
        </Link>

        {/* Status Badge */}
        <div className={`
          absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold text-white
          ${property.status === 'for_rent' ? 'bg-orange-500' : 'bg-green-500'}
        `}>
          {property.status === 'for_rent' ? 'For Rent' : 'For Sale'}
        </div>

        {/* Type Badge */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold bg-white text-gray-700 shadow">
          {property.type}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col h-[230px] justify-between">
        {/* Upper Content */}
        <div>
          {/* Price */}
          <div className="mb-2">
            <span className="text-2xl font-bold text-secondary-color">
              {new Intl.NumberFormat('fr-FR', {
                style: 'decimal',
                maximumFractionDigits: 0
              }).format(property.price || 0)}
              {property.priceLabel}
            </span>
            {property.status === 'for_rent' &&
              <span className="text-sm text-gray-500 ml-1">/month</span>
            }
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-heading-color mb-2 line-clamp-1 hover:text-secondary-color transition-colors">
            <Link href={`/properties/details/${property?.id}`}>
              {property.title || "Property Title"}
            </Link>
          </h3>

          {/* Location */}
          <div className="flex items-start gap-2">
            <i className="fas fa-map-marker-alt text-secondary-color mt-1 flex-shrink-0"></i>
            <p className="text-gray-600 text-sm line-clamp-2">
              {property.location || "Property Location"}
            </p>
          </div>
        </div>

        {/* Property Details */}
        <div className="flex items-center gap-4 text-sm text-gray-500 border-t pt-3">
          <div className="flex items-center gap-1">
            <i className="fas fa-ruler-combined"></i>
            <span>{property.livingArea || 0} m²</span>
          </div>
          {property.roomCount > 0 && (
            <div className="flex items-center gap-1">
              <i className="fas fa-door-open"></i>
              <span>{property.roomCount} rooms</span>
            </div>
          )}
          {property.bathroom > 0 && (
            <div className="flex items-center gap-1">
              <i className="fas fa-bath"></i>
              <span>{property.bathroom} baths</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
