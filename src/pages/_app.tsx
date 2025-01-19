'use client'
import type { AppProps } from 'next/app';
import Header from './common/Header';
import Footer from './common/Footer';

import { Inter } from 'next/font/google';
import '../styles/globals.css';

// Initialize the Inter font
const inter = Inter({ subsets: ['latin'] });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.className} overflow-x-hidden`}>
      <Header />
      <main className="pt-[200px]">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}

export default MyApp;