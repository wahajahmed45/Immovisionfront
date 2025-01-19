import { useState } from 'react';

export default function FAQ() {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const faqItems = [
    {
      question: "What is the typical home buying process?",
      answer: "The home buying process typically involves several steps: determining your budget, getting pre-approved for a mortgage, searching for properties, making an offer, conducting inspections, and closing the deal. Our experienced agents will guide you through each step to ensure a smooth transaction."
    },
    {
      question: "How long does it usually take to sell a property?",
      answer: "The time to sell a property can vary significantly depending on market conditions, property location, pricing, and property condition. On average, it can take anywhere from 30 to 90 days. Properties that are well-maintained and correctly priced for the market typically sell faster."
    },
    {
      question: "What factors affect property value?",
      answer: "Several key factors influence property value: location, property size and condition, local market conditions, nearby amenities, school districts, recent comparable sales, economic conditions, and property age. Regular maintenance and strategic improvements can help maintain or increase property value."
    },
    {
      question: "What should I consider before buying a property?",
      answer: "Important considerations include your budget, desired location, property condition, future maintenance costs, neighborhood development plans, property taxes, and potential resale value. Also consider your long-term plans and whether the property will meet your needs in the coming years."
    },
    {
      question: "What are the common hidden costs of homeownership?",
      answer: "Beyond the purchase price, homeowners should budget for property taxes, insurance, utilities, regular maintenance, potential repairs, homeowner association fees (if applicable), and emergency funds for unexpected issues. It's important to factor these costs into your overall budget."
    },
    {
      question: "How do property inspections work?",
      answer: "A property inspection is a thorough examination of a property's condition by a qualified inspector. They check structural elements, electrical systems, plumbing, HVAC, roof condition, and potential safety issues. The inspection typically takes 2-3 hours and results in a detailed report."
    },
    {
      question: "What's the difference between freehold and leasehold properties?",
      answer: "With freehold properties, you own both the building and the land it stands on indefinitely. With leasehold, you own the property for a fixed period but don't own the land. Leasehold properties typically include apartments and may have additional service charges and ground rent."
    }
  ];

  return (
    <main>
      {/* Banner section */}
      <section>
        <div className="w-full bg-[url('/img/bg/14.jpg')] bg-no-repeat bg-cover bg-center relative z-0 after:w-full after:h-full after:absolute after:top-0 after:left-0 after:bg-white after:bg-opacity-30 after:-z-1">
          <div className="container py-110px">
            <h1 className="text-2xl sm:text-3xl md:text-26px lg:text-3xl xl:text-4xl font-bold text-heading-color mb-15px">
              <span className="leading-1.3">Frequently Asked Questions</span>
            </h1>
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className="py-20">
        <div className="container max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="border rounded-lg">
                <button 
                  className="flex justify-between items-center w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => toggleQuestion(index)}
                >
                  <span className="font-semibold">{item.question}</span>
                  <i className={`fas ${openQuestion === index ? 'fa-minus' : 'fa-plus'} text-secondary-color`}></i>
                </button>
                <div 
                  className={`px-6 py-4 bg-gray-50 transition-all duration-200 ease-in-out ${
                    openQuestion === index ? 'block' : 'hidden'
                  }`}
                >
                  <p className="text-gray-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
