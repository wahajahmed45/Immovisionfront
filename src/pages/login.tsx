import { useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import AuthService from '@/services/authentication/AuthServices';
import GoogleSignInButton from './components/GoogleSigninButton';
import Link from 'next/link';




interface LoginErrorResponse {
  message: string;
  error: string;
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError(''); 

   
    if (!email || !password) {
      setError('Please fill out both fields');
      return;
    }

    try {
      const response = await AuthService.login(email, password);

      if (response) {
        console.log('Login successful');
        router.push('/'); 
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error: unknown) {
      console.error('Error logging in:', error);
      

      if (
        error instanceof Error && 
        'response' in error && 
        error.response && 
        typeof error.response === 'object' &&
        'data' in error.response
      ) {
        const errorData = error.response.data as LoginErrorResponse;
        setError(errorData.error || errorData.message || 'An error occurred. Please try again.');
      } else {
        // Fallback to the error message or a generic error
        setError(
          error instanceof Error 
            ? error.message 
            : 'An unexpected error occurred'
        );
      }
    }
  };

  return (
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
          <div className="container pt-30 pb-90px lg:pb-70px">
            <div className="text-center mb-50px">
              <h1 className="text-2xl sm:text-3xl md:text-26px lg:text-3xl xl:text-44px font-bold text-heading-color mb-15px">
                <span className="leading-1.3 md:leading-1.3 lg:leading-1.3 xl:leading-1.3">
                  Sign In <br />
                  To Your Account
                </span>
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              <form className="form-primary bg-white px-25px md:px-50px pt-10 pb-50px" onSubmit={handleLogin}>
                <div>
                  <div className="grid grid-cols-1 gap-30px pb-30px">
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Email*"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 focus:border focus:border-secondary-color h-65px block w-full rounded-none placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60"
                      />
                    </div>

                    <div className="relative">
                      <input
                        type="password"
                        placeholder="Password*"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 focus:border focus:border-secondary-color h-65px block w-full rounded-none placeholder:text-paragraph-color placeholder:text-sm placeholder:text-opacity-60 tracking-[3px]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="uppercase text-sm md:text-base text-white relative group whitespace-nowrap font-normal mb-0 transition-all duration-300 border bg-secondary-color border-secondary-color hover:border-primary-color hover:bg-primary-color  z-0">
                  <button                       
  type="submit"                       
  className="relative z-1 px-30px lg:px-10 py-3 md:py-15px lg:py-17px group-hover:text-white text-center flex items-center justify-center leading-23px uppercase w-full"
>                       
  SIGN IN                     
</button>
                    <div  >
                    <GoogleSignInButton />
                    </div>
                  </h5>
                 
                </div>
                

                {error && <div className="text-red-500 mt-4">{error}</div>}


                <a href="/forgot" className="uppercase mt-6 text-13px lg:text-sm">
                  <span className="leading-1.8 lg:leading-1.8">FORGOTTEN YOUR PASSWORD?</span>
                </a>
              </form>

              <div className="bg-white pt-50px text-center">
                <div>
                  <h5 className="text-17px md:text-lg lg:text-xl font-bold leading-1.3 text-heading-color mb-15px">
                    <span className="leading-1.3 md:leading-1.3 lg:leading-1.3">DONT HAVE AN ACCOUNT?</span>
                  </h5>
                  <p className="text-sm lg:text-base">
                    <span className="leading-1.8 lg:leading-1.8 mb-30px">
                      Add items to your wishlist, get personalized recommendations,
                      <br />
                      check out more quickly, track your orders, register
                    </span>
                  </p>
                </div>

                <div>
                  <h5 className="text-17px md:text-lg lg:text-xl font-bold leading-1.3 text-heading-color mb-15px">
                   <Link href="/signup">
                      Create an Account
                      </Link>
                    
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}