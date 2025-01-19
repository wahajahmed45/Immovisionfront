export default function TermsAndConditions() {
  return (
    <main>
      {/* Banner section */}
      <section>
        <div className="w-full bg-gradient-to-br from-orange-400 via-orange-500 to-rose-600 relative">
          <div className="container py-20">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center">
              Terms and Conditions
            </h1>
          </div>
        </div>
      </section>

      {/* Content section */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="space-y-8">
            {/* Introduction */}
            <div>
              <h2 className="text-2xl font-bold text-heading-color mb-4">1. Introduction</h2>
              <p className="text-gray-600 leading-relaxed">
                These terms and conditions govern your use of our real estate platform. By accessing 
                or using our services, you agree to be bound by these terms.
              </p>
            </div>

            {/* User Accounts */}
            <div>
              <h2 className="text-2xl font-bold text-heading-color mb-4">2. User Accounts</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                When you create an account with us, you guarantee that the information you provide is accurate and complete. 
                You are responsible for maintaining the confidentiality of your account and password.
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Users must be at least 18 years old</li>
                <li>One account per user</li>
                <li>Keep your login credentials secure</li>
                <li>Notify us of any unauthorized account access</li>
              </ul>
            </div>

            {/* Property Listings */}
            <div>
              <h2 className="text-2xl font-bold text-heading-color mb-4">3. Property Listings</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                All property listings must be accurate and truthful. Users posting listings agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Provide accurate property information</li>
                <li>Update listing status promptly</li>
                <li>Include only authentic images</li>
                <li>Respect intellectual property rights</li>
              </ul>
            </div>

            {/* Privacy and Data */}
            <div>
              <h2 className="text-2xl font-bold text-heading-color mb-4">4. Privacy and Data Protection</h2>
              <p className="text-gray-600 leading-relaxed">
                We are committed to protecting your privacy and handling your data in accordance with 
                applicable data protection laws. For detailed information, please refer to our Privacy Policy.
              </p>
            </div>

            {/* Prohibited Activities */}
            <div>
              <h2 className="text-2xl font-bold text-heading-color mb-4">5. Prohibited Activities</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Users are prohibited from:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Posting false or misleading information</li>
                <li>Harassing other users</li>
                <li>Attempting to circumvent our security measures</li>
                <li>Using the platform for illegal activities</li>
              </ul>
            </div>

            {/* Liability */}
            <div>
              <h2 className="text-2xl font-bold text-heading-color mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed">
                While we strive to maintain accurate information, we are not responsible for any 
                inaccuracies in property listings or user-generated content. Users engage in 
                transactions at their own risk.
              </p>
            </div>

            {/* Changes to Terms */}
            <div>
              <h2 className="text-2xl font-bold text-heading-color mb-4">7. Changes to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to modify these terms at any time. Users will be notified of 
                significant changes, and continued use of the platform constitutes acceptance of 
                modified terms.
              </p>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-heading-color mb-4">8. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about these terms, please contact us at:
              </p>
              <div className="mt-4 text-gray-600">
                <p>Email: legal@immoweb.com</p>
                <p>Phone: +32 2 123 45 67</p>
                <p>Address: Avenue Louise 500, 1050 Brussels, Belgium</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
