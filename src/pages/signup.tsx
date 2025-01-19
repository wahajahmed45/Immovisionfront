
'use client'
import { useState } from 'react';
import Script from 'next/script';
import AuthService from '@/services/authentication/AuthServices';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const router = useRouter(); 
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || !email || !firstName || !lastName || !confirmPassword) {
      setError('Please fill out all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
     
      const fullName = `${firstName} ${lastName}`;

      const response = await AuthService.signup({ fullName, password, email }); 

   
      if (response.status !== 201) {
        console.error('Signup failed:', response.status); 
        throw new Error("HTTP error " + response.status); 
      }

      console.log('Signup successful:', response);
      router.push('/login');
    } catch (error) {
      console.error('Signup failed:', error);
      if (error instanceof Error) {
        setError(error.message || "An error occurred during signup.");
      } else {
        setError("An unknown error occurred during signup.");
      }
    }
  };

  return (
    <>
    <div>
      <main>
        <section>
          <div className="w-full bg-[url('/img/bg/14.jpg')] bg-no-repeat bg-cover bg-center relative z-0 after:w-full after:h-full after:absolute after:top-0 after:left-0 after:bg-white after:bg-opacity-30 after:-z-1">
            <div className="container py-110px">
              <h1 className="text-2xl sm:text-3xl md:text-26px lg:text-3xl xl:text-4xl font-bold text-heading-color mb-15px">
                <span className="leading-1.3 md:leading-1.3 lg:leading-1.3 xl:leading-1.3">Account</span>
              </h1>
            </div>
          </div>
        </section>

        <section>
          <div className="container pt-30 pb-90px lg:pb-30 flex lg:justify-center">
            <div className="lg:basis-1/2">
              <div className="text-center mb-50px">
                <h1 className="text-2xl sm:text-3xl md:text-26px lg:text-3xl xl:text-44px font-bold text-heading-color mb-15px">
                  <span className="leading-1.3 md:leading-1.3 lg:leading-1.3 xl:leading-1.3">Register <br/>Your Account</span>
                </h1>
              </div>
              <form className="form-primary bg-white px-25px md:px-50px pt-10 pb-50px" onSubmit={handleSignup}>
                <div>
                  <div className="grid grid-cols-1 gap-30px pb-30px">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="First Name"
                        className="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 focus:border focus:border-secondary-color h-65px block w-full rounded-none placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Last Name"
                        className="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 focus:border focus:border-secondary-color h-65px block w-full rounded-none placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Email*"
                        className="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 focus:border focus:border-secondary-color h-65px block w-full rounded-none placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
          
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="Password*"
                        className="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 focus:border focus:border-secondary-color h-65px block w-full rounded-none placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60 tracking-[3px]"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="Confirm Password*"
                        className="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 focus:border focus:border-secondary-color h-65px block w-full rounded-none placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60 tracking-[3px]"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                <button type="submit" className="uppercase text-sm md:text-base text-white relative group whitespace-nowrap font-normal mb-0 transition-all duration-300 border bg-secondary-color border-secondary-color hover:border-primary-color hover:bg-primary-color inline-block z-0">
                  <span className="relative z-1 px-30px lg:px-10 py-3 md:py-15px lg:py-17px group-hover:text-white leading-23px uppercase h">
                    CREATE ACCOUNT
                  </span>
                </button>
              </form>
              <div className="bg-white text-center">
                <div>
                  <p className="text-sm lg:text-base mb-5 lg:mb-6">
                    <span className="leading-1.8 lg:leading-1.8">By creating an account, you agree to our:</span>
                  </p>
                  <a href="/about/termAndCondition" className="uppercase text-sm lg:text-base block">
                    <span className="leading-1.8 lg:leading-1.8">TERMS OF CONDITIONS &nbsp; &nbsp; | &nbsp; &nbsp; PRIVACY POLICY</span>
                  </a>
                  <a href="login" className="uppercase text-sm lg:text-base mt-50px">
                    <span className="leading-1.8 lg:leading-1.8">ALREADY HAVE AN ACCOUNT ?</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        
      </section>
    </main>
  </div>
  </>
);
}