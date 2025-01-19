'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import config from '@/utils/config';
import { storeUserData } from '@/stores/auth/auth';
import AuthService from '@/services/authentication/AuthServices';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement | null, 
            options: { theme: string; size: string }
          ) => void;
        };
      };
    };
  }
}

const GoogleSignInButton: React.FC = () => {
  //const router = useRouter();
  const [googleSignInLoaded, setGoogleSignInLoaded] = useState(false);
  const router = useRouter();
  useEffect(() => {
   
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleSignInLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleSignIn = async (response: { credential: string }) => {
    try {
      const res = await fetch(`${config.apiBaseUrl}/api/auth/google-signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: response.credential
        })
      });

      if (res.ok) {
        const { token,acls,role,emailUser } = await res.json();
        
       
        AuthService.setAuthCookie(token);
        storeUserData(role, acls,emailUser);
       
       router.push('/');
      } else {
        // Handle login failure
        console.error('Google Sign-In failed');
      }
    } catch (error) {
      console.error('Login error', error);
    }
  };

  useEffect(() => {
    if (googleSignInLoaded && window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        callback: handleGoogleSignIn
      });

      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInButton'),
        { 
          theme: 'outline', 
          size: 'large' 
        }
      );
    }
  }, [googleSignInLoaded]);

  return (
    <div>
      <div id="googleSignInButton"></div>
    </div>
  );
};

export default GoogleSignInButton;