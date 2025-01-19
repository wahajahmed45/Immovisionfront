"use client"

import Link from "next/link";
import AuthService from "@/services/authentication/AuthServices";
import { useState } from "react";

export default function Forgot() {
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    return (
        <>
            <div className="wrapper bg-white min-h-screen text-gray-800 md:py-14">
                <section className="max-w-7xl mx-auto px-4 py-12 space-y-8">

                    <header className="container w-full max-w-lg mx-auto mb-12 text-center flex flex-col items-center space-y-4">
                        <i
                            className="fas fa-lock text-6xl text-orange-500 disabled-fa-shake"
                        ></i>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Forgot Your Password?
                        </h1>
                        <p className="text-gray-500 text-sm lg:text-base">
                            Enter your email address and we will send you a link to reset your password.
                        </p>
                    </header>

                    <main className="container w-full max-w-lg mx-auto space-y-4">
                        {message && (
                            <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}

                        <form
                            action="#"
                            method="post"
                            className="space-y-4"
                            onSubmit={
                                async (e) => {
                                    e.preventDefault();
                                    const form = e.target as HTMLFormElement;
                                    const formData = new FormData(form);
                                    const email = formData.get("email") as string;
                                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                    
                                    if (!emailRegex.test(email)) {
                                        setMessage({
                                            type: 'error',
                                            text: 'Please enter a valid email address.'
                                        });
                                        return;
                                    }

                                    try {
                                       // await AuthService.forgotPassword(email);
                                        setMessage({
                                            type: 'success',
                                            text: 'If an account exists with this email, you will receive a password reset email shortly.'
                                        });
                                        form.reset();
                                    } catch (error) {
                                        setMessage({
                                            type: 'error',
                                            text: 'An error occurred. Please try again later.'
                                        });
                                    }
                                }
                            }
                        >
                            <div className="relative">
                                <div className="relative">
                                    <i className="fas fa-envelope text-gray-500 absolute top-1/2 left-3 transform -translate-y-1/2"></i>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Your email address (e.g. john.smith@example.com)"
                                        className="w-full pl-10 pr-4 py-2 text-sm outline-none border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500 transition duration-200 hover:border-orange-500 active:border-orange-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 min-w-22 min-h-11"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 text-sm text-white bg-orange-500 rounded-lg hover:bg-orange-600 active:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-11 min-h-11 transition duration-200 shadow-md"
                            >
                                Reset Password
                            </button>
                        </form>
                    </main>

                    <footer className="container w-full max-w-lg mx-auto space-y-1">
                        <small className="block text-center text-gray-500 text-xs lg:text-small">
                            <Link
                                href="/login"
                                className="text-orange-500 hover:underline min-w-22 min-h-5"
                            >
                                <i className="fas fa-arrow-left text-orange-500 hover:underline"></i> &nbsp;  <span className="text-orange-500 hover:underline">Back to login</span>
                            </Link>
                        </small>
                        <small className="block text-center text-gray-500 text-xs lg:text-small">
                            Unable to remember your email address? <Link href="/contact" className="text-orange-500 hover:underline min-w-22 min-h-5">Contact us</Link>.
                        </small>
                    </footer>

                </section>
            </div>
        </>
    );

}
