import React, { useEffect, useState } from "react";
import { getProperties, filterProperties, getCities } from "@/services/property/PropertyServices";
import PropertyCard from "./components/property/PropertyCard";
import { FeaturedProperty } from "@/types/Property/FeaturedProperty";
import { Filters } from "@/types/Property/Filters";
import { useRouter } from 'next/router';

const ListProperties: React.FC = () => {
  const [properties, setProperties] = useState<FeaturedProperty[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<FeaturedProperty[]>([]);
  const [filters, setFilters] = useState<Filters>({
    priceMin: "",
    priceMax: "",
    rooms: "",
    bathrooms: "",
    city: ""
  });
  const [cities, setCities] = useState<string[]>([]);

  const router = useRouter();
  const { city: queryCity } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProperties();
        setProperties(data);
        setFilteredProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await getCities();
        setCities(data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    if (queryCity) {
      setFilters(prevFilters => ({
        ...prevFilters,
        city: queryCity as string
      }));
    }
  }, [queryCity]);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  const applyFilters = async () => {
    try {
      const filtered = await filterProperties(filters);
      setFilteredProperties(filtered);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Sidebar Filters */}
      <div className="col-span-1 p-4 border-r">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="mb-4">
          <label className="block font-medium mb-1">Price Min (€):</label>
          <input
            type="number"
            name="priceMin"
            value={filters.priceMin || ""}
            onChange={handleFilterChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Price Max (€):</label>
          <input
            type="number"
            name="priceMax"
            value={filters.priceMax || ""}
            onChange={handleFilterChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Rooms:</label>
          <input
            type="number"
            name="rooms"
            value={filters.rooms || ""}
            onChange={handleFilterChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Bathrooms:</label>
          <input
            type="number"
            name="bathrooms"
            value={filters.bathrooms || ""}
            onChange={handleFilterChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">City:</label>
          <select
            name="city"
            value={filters.city || ""}
            onChange={handleFilterChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={applyFilters}
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Apply Filters
        </button>
      </div>

      {/* Properties List */}
      <div className="col-span-3 p-4">
        <h2 className="text-lg font-semibold mb-4">Properties</h2>
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <p>No properties found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default ListProperties;
