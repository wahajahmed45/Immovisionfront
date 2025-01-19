'use client'
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { LatLngExpression } from 'leaflet';

import { FeaturedProperty } from '@/types/Property/FeaturedProperty';
import { getPropertiesByCity } from '@/services/property/PropertyServices';


const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

const PropertyMap: React.FC = () => {
  const [properties, setProperties] = useState<Record<string, FeaturedProperty[]>>({});
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const propertiesByCity = await getPropertiesByCity();
        
       
        const processedProperties = propertiesByCity instanceof Map 
          ? Object.fromEntries(propertiesByCity)
          : propertiesByCity;

        setProperties(processedProperties);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  
  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined') {
        const L = await import('leaflet');
        
        
        const CustomIcon = L.Icon.extend({
          options: {
            iconUrl: '/img/marker.png',
            shadowUrl: '/leaflet/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          }
        });

      
        L.Marker.prototype.options.icon = new CustomIcon();
        
        setMapLoaded(true);
        console.log('Rendering page:', window.location.pathname);
      }
    };

    loadLeaflet();
  }, []);

 
  const calculateMapCenter = (): LatLngExpression => {
    const cities = Object.keys(properties);
    
    if (selectedCity && properties[selectedCity]) {
      const cityProperties = properties[selectedCity];
      
      // Filter out properties with undefined or invalid coordinates
      const validProperties = cityProperties.filter(
        prop => prop.latitude !== undefined && prop.longitude !== undefined
      );

      if (validProperties.length > 0) {
        const avgLat = validProperties.reduce((sum, prop) => sum + prop.latitude!, 0) / validProperties.length;
        const avgLng = validProperties.reduce((sum, prop) => sum + prop.longitude!, 0) / validProperties.length;
        return [avgLat, avgLng] as LatLngExpression;
      }
    }
    return [51.505, -0.09] as LatLngExpression; 
  };

  const renderCitySelector = () => {
    const cities = Object.keys(properties);
    return (
      <div className="absolute z-[1000] bottom-4 left-4 bg-white p-4 rounded shadow">
        <select 
          value={selectedCity || ''} 
          onChange={(e) => setSelectedCity(e.target.value || null)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a City</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>
    );
  };

 
  const renderMarkers = () => {
    const propertiesToRender = selectedCity 
      ? properties[selectedCity] || [] 
      : Object.values(properties).flat();

    return propertiesToRender
      .filter(property => 
        property.latitude !== undefined && 
        property.longitude !== undefined
      )
      .map((property) => (
        <Marker 
          key={property.id} 
          position={[property.latitude!, property.longitude!] as LatLngExpression}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold">{property.title}</h3>
              <p>{property.description}</p>
              <p>Price: ${property.price}</p>
              <a 
                href={`/property/${property.id}`} 
                className="text-blue-500 hover:underline"
              >
                View Details
              </a>
            </div>
          </Popup>
        </Marker>
      ));
  };

 
  if (!mapLoaded) {
    return <div>Loading map...</div>;
  }

  return (
    <section>
      <div className="container pt-30 pb-90px lg:pb-70px">
        <div className="text-center mb-50px">
          <div className="relative w-full h-[600px]">
                        {renderCitySelector()}
                        <link 
                          rel="stylesheet" 
                          href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
                          integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
                          crossOrigin=""
                        />
                      <MapContainer 
                    center={calculateMapCenter()} 
                    zoom={selectedCity ? 12 : 6} 
                    scrollWheelZoom={true}
                    className="w-full h-full mt-12" 
                  >
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          {renderMarkers()}
                        </MapContainer>
            </div>
        </div>
    </div>
    
    </section>
   
  );
};

export default PropertyMap;