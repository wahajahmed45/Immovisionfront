export default function AboutUs() {
  return (
    <main>
      {/* Banner section */}
      <section>
        <div className="w-full bg-[url('/img/bg/14.jpg')] bg-no-repeat bg-cover bg-center relative z-0 after:w-full after:h-full after:absolute after:top-0 after:left-0 after:bg-white after:bg-opacity-30 after:-z-1">
          <div className="container py-110px">
            <h1 className="text-2xl sm:text-3xl md:text-26px lg:text-3xl xl:text-4xl font-bold text-heading-color mb-15px">
              <span className="leading-1.3">About Us</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Main section */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left column with image */}
            <div className="relative">
              <img
                src="/img/team/teamAll.jpg"
                alt="Our real estate team"
                className="w-full h-auto rounded-lg shadow-xl"
              />
              <div className="absolute bottom-4 right-4 bg-secondary-color text-white px-6 py-3 rounded">
                <p className="text-2xl font-bold">15+</p>
                <p className="text-sm">Years of Experience</p>
              </div>
            </div>

            {/* Right column with text */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-heading-color">
                Your Trusted Real Estate Partner
              </h2>
              
              <p className="text-gray-600 leading-relaxed">
                For over 15 years, our real estate agency has been committed to providing 
                personalized and professional service to all our clients. Our mission is to 
                facilitate your real estate transactions by supporting you at every step of 
                your project.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-secondary-color p-3 rounded-full text-white">
                    <i className="fas fa-home text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Local Expertise</h3>
                    <p className="text-gray-600">
                      Deep knowledge of the local real estate market to guide you 
                      in your decisions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-secondary-color p-3 rounded-full text-white">
                    <i className="fas fa-handshake text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Personalized Service</h3>
                    <p className="text-gray-600">
                      A tailored approach to meet your specific real estate needs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-secondary-color p-3 rounded-full text-white">
                    <i className="fas fa-shield-alt text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Full Transparency</h3>
                    <p className="text-gray-600">
                      A commitment to clear and honest communication throughout 
                      your real estate project.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary-color mb-2">1500+</div>
              <p className="text-gray-600">Properties Sold</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary-color mb-2">2000+</div>
              <p className="text-gray-600">Satisfied Clients</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary-color mb-2">50+</div>
              <p className="text-gray-600">Qualified Agents</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary-color mb-2">15+</div>
              <p className="text-gray-600">Years of Experience</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
