'use client'
import Link from "next/link";
export default function Footer() {
    return (
<footer>
<div
  className="pt-187px pb-5 px-15px 3xl:px-[2%] 4xl:px-[5%] mt-95px bg-section-bg-2 text-sm lg:text-base text-white relative"
>
  <div className="px-15px">
    {/* <!-- footer top --> */}
    <div
      className="container w-full absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <div
        className="px-25px lg:px-60px py-50px bg-secondary-color text-white flex justify-center lg:justify-between items-center flex-col lg:flex-row gap-y-30px lg:gap-0 sm:whitespace-nowrap"
      >
        <div>
          <h5
            className="text-xl md:text-26px lg:text-3xl xl:text-4xl text-white font-bold mb-15px"
          >
            <span className="leading-1.3">Looking for a dream home?</span>
          </h5>
          <p className="text-white leading-1.8">
            We can help you realize your dream of a new home
          </p>
        </div>
        <div>
          <h5
            className="capitalize inline-block text-sm md:text-base text-primary-color hover:text-white hover:bg-primary-color relative group whitespace-nowrap font-normal transition-all duration-300 shadow-box-shadow-3 mb-0"
          >
            <span
              className="inline-block absolute top-0 right-0 w-full h-full bg-white group-hover:bg-secondary-color z-1 group-hover:w-0 transition-all duration-300"
            ></span>
            <a
              href="/properties"
              className="relative z-10 px-5 md:px-25px lg:px-10 py-10px md:py-3 lg:py-17px group-hover:text-white leading-23px"
              >Explore Properties <i className="icon-next"></i
            ></a>
          </h5>
        </div>
      </div>
    </div>

    {/* <!-- footer main --> */}
    <div
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-x-30px text-sm lg:text-base text-white"
    >
      {/* <!-- footer about--> */}
      <div className="xl:col-start-1 xl:col-span-3 mb-60px lg:pr-35px">
        <div className="mb-15px">
          <a href="index.html">
            <img src="/img/logo-2.png" alt="" />
          </a>
          <p className="leading-1.8 mb-5 lg:mb-25px text-white">
            Our team is here to help you with any questions about our properties or services.
          </p>
          <ul className="space-y-2">
            <li>
              <p className="leading-1.8 text-white flex">
                <i className="icon-placeholder mr-15px mt-1"></i>
                <span>Avenue Louise 500, 1050 Brussels, Belgium</span>
              </p>
            </li>
            <li>
              <a href="tel:+32-2-123-45-67" className="leading-1.8 flex">
                <i className="icon-call mr-15px mt-1"></i>
                <span>Main: +32 2 123 45 67</span>
              </a>
            </li>
            <li>
              <a href="tel:+32-2-123-45-68" className="leading-1.8 flex">
                <i className="icon-call mr-15px mt-1"></i>
                <span>Support: +32 2 123 45 68</span>
              </a>
            </li>
            <li>
              <a
                href="mailto:info@immoweb.com"
                className="leading-1.8 flex"
              >
                <i className="icon-mail mr-15px mt-1"></i>
                <span>info@immoweb.com</span>
              </a>
            </li>
            <li>
              <a
                href="mailto:support@immoweb.com"
                className="leading-1.8 flex"
              >
                <i className="icon-mail mr-15px mt-1"></i>
                <span>support@immoweb.com</span>
              </a>
            </li>
          </ul>
          <ul className="flex items-center gap-x-5 mt-5">
            <li>
              <a href="https://www.facebook.com" className="leading-1.8">
                <i className="fab fa-facebook-f"></i>
              </a>
            </li>
            <li>
              <a href="https://x.com" className="leading-1.8">
                <i className="fab fa-twitter"></i>
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com" className="leading-1.8">
                <i className="fab fa-linkedin"></i>
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com" className="leading-1.8">
                <i className="fab fa-youtube"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
      {/* <!-- footer company--> */}
      <div className="xl:col-start-4 xl:col-span-2 mb-60px">
        <h3 className="text-22px font-bold mb-25px text-white">
          <span className="leading-1.3">Company</span>
        </h3>
        <ul className="space-y-[15px]">
          <li>
            <Link
              href="/about/page"
              className="hover:text-secondary-color -translate-x-5 hover:translate-x-0 group leading-1.8"
            >
              <span className="text-secondary-color pr-15px opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
              About
            </Link>
          </li>
          <li>
            <Link
              href="/properties"
              className="hover:text-secondary-color -translate-x-5 hover:translate-x-0 group leading-1.8"
            >
              <span className="text-secondary-color pr-15px opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
              All Properties
            </Link>
          </li>
          <li>
            <Link
              href="/properties/map"
              className="hover:text-secondary-color -translate-x-5 hover:translate-x-0 group leading-1.8"
            >
              <span className="text-secondary-color pr-15px opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
              Locations Map
            </Link>
          </li>
          <li>
            <Link
              href="/about/faq"
              className="hover:text-secondary-color -translate-x-5 hover:translate-x-0 group leading-1.8"
            >
              <span className="text-secondary-color pr-15px opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
              FAQ
            </Link>
          </li>
          <li>
            <Link
              href="/about/contact"
              className="hover:text-secondary-color -translate-x-5 hover:translate-x-0 group leading-1.8"
            >
              <span className="text-secondary-color pr-15px opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
              Contact us
            </Link>
          </li>
        </ul>
      </div>
      {/* <!-- footer services--> */}
      <div className="xl:col-start-6 xl:col-span-2 mb-60px">
        <h3 className="text-22px font-bold mb-25px text-white">
          <span className="leading-1.3">Services</span>
        </h3>
        <ul className="space-y-[15px]">
          <li>
            <Link
              href="/login"
              className="hover:text-secondary-color -translate-x-5 hover:translate-x-0 group leading-1.8"
            >
              <span className="text-secondary-color pr-15px opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
              Login
            </Link>
          </li>
          <li>
            <Link
              href="/user/dashboard"
              className="hover:text-secondary-color -translate-x-5 hover:translate-x-0 group leading-1.8"
            >
              <span className="text-secondary-color pr-15px opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
              My account
            </Link>
          </li>
          <li>
            <Link
              href="/about/termAndCondition"
              className="hover:text-secondary-color -translate-x-5 hover:translate-x-0 group leading-1.8"
            >
              <span className="text-secondary-color pr-15px opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
              Terms & Conditions
            </Link>
          </li>
        </ul>
      </div>
      {/* footer stats */}
      <div className="xl:col-start-8 xl:col-span-2 mb-60px">
        <h3 className="text-22px font-bold mb-25px text-white">
          <span className="leading-1.3">Our Numbers</span>
        </h3>
        <ul className="space-y-[15px]">
          <li className="text-white">
            <div className="flex items-center">
              <i className="fas fa-home mr-3"></i>
              <div>
                <div className="font-bold text-xl">15,000+</div>
                <div className="text-sm">Properties Listed</div>
              </div>
            </div>
          </li>
          <li className="text-white">
            <div className="flex items-center">
              <i className="fas fa-users mr-3"></i>
              <div>
                <div className="font-bold text-xl">50,000+</div>
                <div className="text-sm">Happy Clients</div>
              </div>
            </div>
          </li>
          <li className="text-white">
            <div className="flex items-center">
              <i className="fas fa-star mr-3"></i>
              <div>
                <div className="font-bold text-xl">4.8/5</div>
                <div className="text-sm">Client Satisfaction</div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      {/* footer certifications */}
      <div className="xl:col-start-10 xl:col-span-3 mb-60px">
        <h3 className="text-22px font-bold mb-25px text-white">
          <span className="leading-1.3">Certifications</span>
        </h3>
        <div className="space-y-4">
          <div className="flex items-center text-white">
            <i className="fas fa-certificate mr-3 text-secondary-color"></i>
            <span>ISO 9001:2015 Certified</span>
          </div>
          <div className="flex items-center text-white">
            <i className="fas fa-shield-alt mr-3 text-secondary-color"></i>
            <span>Licensed Real Estate Agency</span>
          </div>
          <div className="flex items-center text-white">
            <i className="fas fa-award mr-3 text-secondary-color"></i>
            <span>Best Agency 2023</span>
          </div>
          <div className="flex items-center text-white">
            <i className="fas fa-check-circle mr-3 text-secondary-color"></i>
            <span>Verified by Real Estate Federation</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
{/* <!-- footer copyright --> */}
<div
  className="py-25px px-15px 3xl:px-[2%] 4xl:px-[5%] bg-section-bg-7 text-sm lg:text-base text-white"
>
  <div className="px-15px">
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div>
        <p className="leading-1.8 text-center lg:text-start text-white">
          All Rights Reserved @ Company 2025
        </p>
      </div>

      <ul
        className="flex gap-x-25px items-center justify-center lg:justify-end capitalize font-semibold font-poppins text-sm"
      >
        <li>
          <Link href="/about/termAndCondition" className="leading-1.8">Terms & Conditions</Link>
        </li>
      </ul>
    </div>
  </div>
</div>
</footer>
);
}
