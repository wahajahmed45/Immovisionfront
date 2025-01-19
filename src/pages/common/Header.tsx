'use client'
import { getUserRole, hasPermission } from '@/stores/auth/auth';
import Link from 'next/link';
import { useEffect, useState } from "react";
import AuthService from '@/services/authentication/AuthServices';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    AuthService.logout();
   
  }
  useEffect(() => {

    const user = getUserRole();
    if (user) {
      setIsLoggedIn(true);
    }

  });

  return (
    <header className="fixed top-0 left-0 w-full z-xxl bg-white">
      {/*  */}
      <div
        className="sticky-header sticky-secondary z-xl bg-transparent transition-all duration-700"
      >
        <div
          className="container flex flex-row justify-between items-center relative py-7 xl:py-21px"
        >
          {/*  */}
          <div className="mt-10px mb-22px md:mt-0 md:mb-0 leading-1">
            <Link href="/" className="text-lg xl:text-15px 2xl:text-lg text-white hover:text-secondary-color font-semibold whitespace-nowrap pl-10px py-22px">
            <img src="/img/logo-2.png" alt="Logo" className="w-[200px]" /></Link>
          </div>

          {/* Bouton Menu Burger */}
          <button 
            className="xl:hidden text-orange-500 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
          </button>

          <nav className={`${isMenuOpen ? 'block' : 'hidden'} xl:block absolute xl:relative top-full left-0 w-full xl:w-auto bg-white xl:bg-transparent`}>
            <ul className="flex flex-col xl:flex-row items-start xl:items-center justify-end gap-15px xl:gap-5">
              {/*  */}
              <li className="relative group">
                <Link href="/" className="text-lg xl:text-15px 2xl:text-lg text-orange-500 hover:text-secondary-color font-semibold whitespace-nowrap pl-10px py-22px">
                  Home <span className="text-sm font-extrabold -ml-0.5">+</span>
                </Link>
              </li>
              {/*  */}
              <li className="relative group">
                <a
                  href="#"
                  className="text-lg xl:text-15px 2xl:text-lg text-orange-500 hover:text-secondary-color font-semibold whitespace-nowrap pl-10px py-22px"
                >About
                  <span className="text-sm font-extrabold -ml-0.5">+</span>
                </a>
                {/*  */}
                <ul
                  className="py-15px border-t-[5px] border-secondary-color bg-white w-dropdown shadow-box-shadow-4 absolute left-0 top-full opacity-0 invisible translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 z-xl"
                >
                  <li>
                    <Link
                      className="whitespace-nowrap px-30px py-2"
                      href="/about/page"
                    >About</Link>
                  </li>

                  <li>
                    <Link
                      className="whitespace-nowrap px-30px py-2"
                      href="/about/faq"
                    >FAQ</Link>
                  </li>
                </ul>
              </li>

              {/*  */}
              <li className="relative group">
                <a
                  href="#"
                  className="text-lg xl:text-15px 2xl:text-lg text-orange-500 hover:text-secondary-color font-semibold whitespace-nowrap pl-10px py-22px"
                >Property
                  <span className="text-sm font-extrabold -ml-0.5">+</span></a
                >
                {/*  */}
                <ul
                  className="py-15px border-t-[5px] border-secondary-color bg-white w-dropdown shadow-box-shadow-4 absolute left-0 top-full opacity-0 invisible translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 z-xl"
                >
                   <Link className="whitespace-nowrap px-30px py-2" href="/properties/map">
                    Property Map
                      <span
                        className="absolute top-1/2 -translate-y-1/2 right-3 group-hover/nested:text-secondary-color"
                      ></span>
                      
                    </Link>

                  <li>
                    <Link
                      className="whitespace-nowrap px-30px py-2"
                      href="/properties/add"
                    >Add Property</Link>
                  </li>
                </ul>
              </li>
            
              <li>
                <a
                  href="/about/contact"
                  className="text-lg xl:text-15px 2xl:text-lg text-orange-500 hover:text-secondary-color font-semibold whitespace-nowrap pl-10px py-22px"
                >Contact
                </a>
              </li>

              {/* Boutons de connexion/déconnexion pour mobile */}
              <div className="xl:hidden w-full px-4 py-2 space-y-2">
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/user/dashboard"
                      className="block w-full text-center px-30px py-14px text-lg bg-secondary-color hover:bg-section-bg-1 font-semibold text-white hover:text-primary-color"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-center px-30px py-14px text-lg bg-secondary-color hover:bg-section-bg-1 font-semibold text-white hover:text-primary-color"
                    >
                      <img 
                        src="/img/logout.png"
                        alt="Logout Icon" 
                        className="inline-block w-5 h-5 mr-2" 
                      />
                      Logout
                    </a>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="block w-full text-center px-30px py-14px text-lg bg-secondary-color hover:bg-section-bg-1 font-semibold text-white hover:text-primary-color"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </ul>
          </nav>
          
          <div className="hidden xl:block">
            <ul className="flex items-center gap-0px">

            {isLoggedIn && (
                      <li className="hidden xl:block">
                        <Link
                          href="/user/dashboard"
                          className="flex items-center px-30px py-14px ml-43px text-lg xl:text-15px 2xl:text-lg bg-secondary-color hover:bg-section-bg-1 font-semibold text-white hover:text-primary-color inline-block"
                        >
                          Dashboard
                        </Link>
                      </li>
                    )}  

              {hasPermission('CREATE_PROPERTY') && (
                <li className="hidden xl:block">
                  <a
                    href="properties/add"
                    className="px-30px py-14px ml-43px text-lg xl:text-15px 2xl:text-lg bg-secondary-color hover:bg-section-bg-1 font-semibold text-white hover:text-primary-color inline-block"
                  >Add Listing</a
                  >
                </li>
              )}
              {isLoggedIn && (
              <li className="hidden xl:block">
                    <a
                      href="#"
                      onClick={handleLogout}
                      className="flex items-center px-30px py-14px ml-43px text-lg xl:text-15px 2xl:text-lg bg-secondary-color hover:bg-section-bg-1 font-semibold text-white hover:text-primary-color inline-block"
                    >
                      <img 
                        src="/img/logout.png"
                        alt="Logout Icon" 
                        className="w-5 h-5 mr-2" 
                      />
                      Logout
                    </a>
                  </li>
                  )}

                   {!isLoggedIn && (
                      <li className="hidden xl:block">
                        <Link
                          href="/login"
                          className="flex items-center px-30px py-14px ml-43px text-lg xl:text-15px 2xl:text-lg bg-secondary-color hover:bg-section-bg-1 font-semibold text-white hover:text-primary-color inline-block"
                        >
                          Login
                        </Link>
                      </li>
                    )}  
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}