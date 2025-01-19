'use client'
import Script from 'next/script';
import FeaturedProperties from './components/property/FeaturedProperties';
import CityProperties from './components/property/CityProperties';
export default function Home() {
  return (
    <main>

       {/* Hero Section */}
       <section className="relative h-[600px] bg-[url('/img/bg/hero-bg.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container relative h-full flex items-center justify-center text-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-6">
              Find Your Dream Property
            </h1>
            <p className="text-xl text-gray-200 mb-10">
              Discover a wide range of properties worldwide. 
              From cozy apartments to luxury homes, we'll help you find your perfect match.
            </p>
            <a 
              href="/properties"
              className="inline-block bg-secondary-color hover:bg-primary-color transition-all duration-300 
                       text-white text-xl px-12 py-5 rounded-lg font-semibold 
                       transform hover:scale-105 hover:shadow-xl"
            >
              View All Properties
              <i className="fas fa-arrow-right ml-3"></i>
            </a>
          </div>
        </div>
      </section>

       {/* Stats Section */}
       <section className="bg-white py-16">
         <div className="container">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             {/* Property Count */}
             <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow duration-300">
               <div className="text-4xl font-bold text-secondary-color mb-2">
                 <span className="counter">2,500</span>+
               </div>
               <p className="text-gray-600 font-medium">Properties Available</p>
             </div>

             {/* Happy Clients */}
             <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow duration-300">
               <div className="text-4xl font-bold text-secondary-color mb-2">
                 <span className="counter">1,200</span>+
               </div>
               <p className="text-gray-600 font-medium">Happy Clients</p>
             </div>

             {/* Cities Covered */}
             <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow duration-300">
               <div className="text-4xl font-bold text-secondary-color mb-2">
                 <span className="counter">50</span>+
               </div>
               <p className="text-gray-600 font-medium">Cities Covered</p>
             </div>

             {/* Years of Experience */}
             <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow duration-300">
               <div className="text-4xl font-bold text-secondary-color mb-2">
                 <span className="counter">15</span>+
               </div>
               <p className="text-gray-600 font-medium">Years of Experience</p>
             </div>
           </div>
         </div>
       </section>

       {/* services section */}
       <section>
        <div className="container pt-115px pb-90px">
          {/* section heading */}
          <div className="text-center mb-50px">
            <h2 className="text-2xl sm:text-3xl md:text-26px lg:text-3xl xl:text-44px text-heading-color font-bold mb-4">
              Our Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our comprehensive real estate services designed to meet all your property needs
            </p>
          </div>

          {/* services cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Buy Service */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-secondary-color bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                  <i className="fas fa-home text-2xl text-secondary-color"></i>
                </div>
                <h3 className="text-xl font-bold text-heading-color mb-4">Buy Property</h3>
                <p className="text-gray-600 text-center mb-6">
                  Find your dream home from our extensive collection of properties. 
                  Expert guidance throughout your buying journey.
                </p>
              </div>
            </div>

            {/* Rent Service */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-secondary-color bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                  <i className="fas fa-key text-2xl text-secondary-color"></i>
                </div>
                <h3 className="text-xl font-bold text-heading-color mb-4">Rent Property</h3>
                <p className="text-gray-600 text-center mb-6">
                  Explore rental properties that match your lifestyle. 
                  From apartments to houses, find your perfect rental.
                </p>
              </div>
            </div>

            {/* Sell Service */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-secondary-color bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                  <i className="fas fa-chart-line text-2xl text-secondary-color"></i>
                </div>
                <h3 className="text-xl font-bold text-heading-color mb-4">Sell Property</h3>
                <p className="text-gray-600 text-center mb-6">
                  List your property with us for maximum visibility. 
                  Professional marketing and dedicated support throughout the sale.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* area properties section */}
      <section>
        <div className="bg-section-bg-1">
          <div>
            <div className="container pt-115px pb-90px">
              {/* section heading */}
              <div className="text-center mb-50px">
                <p
                  className="text-sm md:text-15px lg:text-base text-secondary-color bg-secondary-color bg-opacity-10 capitalize 1b-15px py-0.5 px-5 rounded-full inline-block font-semibold mb-5"
                >
                  <span className="leading-1.3">Area Properties</span>
                </p>
                <CityProperties />
                {/* apartment cards  */}
              
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* featured appartments  section */}
      <section>
        <div className="container pt-115px pb-90px modal-container">
          {/* section heading */}
          <div className="text-center mb-50px">
            <p
              className="text-sm md:text-15px lg:text-base text-secondary-color bg-secondary-color bg-opacity-10 capitalize py-0.5 px-5 mb-5 rounded-full inline-block font-semibold"
            >
              <span className="leading-1.3">Properties</span>
            </p>
            <h2
              className="text-2xl sm:text-3xl md:text-26px lg:text-3xl xl:text-44px text-heading-color font-bold"
            >



              <span className="leading-1.3">Featured Listings </span>
            </h2>
          </div>
          <FeaturedProperties />
        </div>
      </section>
      {/* brand section */}

     
    </main>
  );
}
