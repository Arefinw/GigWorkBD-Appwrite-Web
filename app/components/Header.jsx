import React from "react";
import { Link } from "@remix-run/react";

/* Don't forget to download the CSS file too 
OR remove the following line if you're already using Tailwind */

import "../styles/header.css";

export default function Header() {
  return (
    <div id="webcrumbs">
      <div className="w-[98%] flex justify-center mx-auto mt-3">
        <div className="w-full">
          <header className="bg-white border border-primary-400 rounded-xl shadow-lg transform hover:scale-[1.02] transition-transform duration-300 ease-in-out p-2 md:p-3">
            <div className="flex items-center justify-between px-2 md:px-4">
              {/* Logo Section */}
              <div className="flex items-center space-x-4">
                <span className="material-symbols-outlined text-primary-500 text-2xl md:text-2xl hover:scale-110 transition-transform duration-200 cursor-pointer">
                  storefront
                </span>
                <h1 className="text-2xl md:text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                  GigWorkBD
                </h1>
              </div>

              {/* Right-Aligned Buttons */}
              <div className="flex items-center space-x-4 ml-auto">
                <Link
                  to="login"
                  className="px-6 py-1.5 bg-transparent border-2 border-primary-500 text-primary-500 rounded-full hover:bg-primary-50 transform hover:scale-105 transition-all duration-200 font-semibold text-base"
                >
                  Log in
                </Link>
                {/* <button className="px-6 py-1.5 bg-transparent border-2 border-primary-500 text-primary-500 rounded-full hover:bg-primary-50 transform hover:scale-105 transition-all duration-200 font-semibold text-base">
                  Sign In
                </button> */}
                <Link
                  to="/signup"
                  className="px-6 py-1.5 bg-primary-500 text-white rounded-full hover:bg-primary-600 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-base"
                >
                  Sign up
                </Link>
                {/* <button className="px-6 py-1.5 bg-primary-500 text-white rounded-full hover:bg-primary-600 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-base">
                  Sign Up
                </button> */}
                <div className="relative group">
                  <span className="material-symbols-outlined text-2xl text-primary-500 hover:text-primary-600 hover:scale-110 cursor-pointer transition-all duration-200">
                    help
                  </span>
                  <div className="absolute right-0 mt-2 w-64 md:w-48 bg-white border border-primary-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 invisible group-hover:visible z-50">
                    <div className="py-2">
                      <a
                        href="#"
                        className="block px-4 py-2 text-base hover:bg-primary-50 transition-colors duration-200"
                      >
                        Help Center
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-base hover:bg-primary-50 transition-colors duration-200"
                      >
                        Contact Support
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-base hover:bg-primary-50 transition-colors duration-200"
                      >
                        About Us
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
        </div>
      </div>
    </div>
  );
}
