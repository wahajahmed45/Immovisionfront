export default function Contact() {
  return (
    <main>
      {/* Banner section */}
      <section>
        <div className="w-full bg-[url('/img/bg/14.jpg')] bg-no-repeat bg-cover bg-center relative z-0 after:w-full after:h-full after:absolute after:top-0 after:left-0 after:bg-white after:bg-opacity-30 after:-z-1">
          <div className="container py-110px">
            <h1 className="text-2xl sm:text-3xl md:text-26px lg:text-3xl xl:text-4xl font-bold text-heading-color mb-15px">
              <span className="leading-1.3">Contact Us</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-20">
        <div className="container max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column - Main Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-heading-color mb-6">Get in Touch</h2>
                <p className="text-gray-600 mb-8">
                  Our team is here to help you with any questions about our properties or services.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="bg-secondary-color p-3 rounded-full text-white">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Phone</h3>
                    <p className="text-gray-600">Main: +32 2 123 45 67</p>
                    <p className="text-gray-600">Support: +32 2 123 45 68</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="bg-secondary-color p-3 rounded-full text-white">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                    <p className="text-gray-600">info@immoweb.com</p>
                    <p className="text-gray-600">support@immoweb.com</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="bg-secondary-color p-3 rounded-full text-white">
                    <i className="fas fa-location-dot"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Head Office</h3>
                    <p className="text-gray-600">
                      Avenue Louise 500<br />
                      1050 Brussels<br />
                      Belgium
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start space-x-4">
                  <div className="bg-secondary-color p-3 rounded-full text-white">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Business Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Map */}
            <div className="h-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2520.2394599852893!2d4.3716163!3d50.8225784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3c4b5c2317f55%3A0x164fa5e119f81e32!2sAv.%20Louise%20500%2C%201050%20Bruxelles!5e0!3m2!1sfr!2sbe!4v1635959562000!5m2!1sfr!2sbe"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg shadow-lg"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
