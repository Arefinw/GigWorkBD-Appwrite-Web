import React from "react";
import { Link } from "@remix-run/react";

/* Don't forget to download the CSS file too 
OR remove the following line if you're already using Tailwind */

import "../styles/index.css";

export default function Index() {
  return (
    <div id="webcrumbs">
      <div className="w-full">
        <section className="relative bg-gradient-to-br from-teal-50 to-teal-100 px-8 py-16">
          <div className="flex items-center justify-between">
            <div className="max-w-xl">
              <h2 className="text-5xl font-bold mb-6">
                Connect with the best talents in Bangladesh
              </h2>
              <p className="text-lg mb-8">
                Whether you're looking to hire or get hired, GigWorkBD connects
                you with opportunities that matter.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/signup"
                  className="px-6 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
                >
                  Sign Up
                </Link>
                <button className="px-6 py-3 border-2 border-emerald-600 rounded-full hover:bg-emerald-600 hover:text-white transition-colors">
                  Learn More
                </button>
              </div>
            </div>
            <div className="relative w-[500px] h-[400px]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-teal-200 rounded-full mix-blend-multiply filter blur-lg animate-bounce"></div>
              <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-lg rotate-45 animate-spin-slow"></div>
              <div className="absolute bottom-20 right-20 w-16 h-16 bg-teal-600 rounded-full animate-bounce delay-500"></div>
              <div className="absolute top-1/3 right-1/3 w-12 h-12 border-4 border-teal-500 rounded-full animate-ping"></div>
              <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-teal-100 rounded-2xl rotate-12 animate-pulse delay-1000"></div>
            </div>
          </div>
        </section>

        <section className="px-8 py-16 bg-white">
          <h3 className="text-3xl font-bold text-center mb-12">
            Why Choose GigWorkBD
          </h3>
          <div className="grid grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-teal-50 hover:shadow-xl transition-shadow">
              <span className="material-symbols-outlined text-4xl text-teal-600">
                verified_user
              </span>
              <h4 className="text-xl font-bold mt-4 mb-2">Verified Talents</h4>
              <p>Connect with pre-vetted professionals from various domains.</p>
            </div>
            <div className="p-6 rounded-xl bg-teal-50 hover:shadow-xl transition-shadow">
              <span className="material-symbols-outlined text-4xl text-teal-600">
                payments
              </span>
              <h4 className="text-xl font-bold mt-4 mb-2">Secure Payments</h4>
              <p>
                Your transactions are protected with our secure payment system.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-teal-50 hover:shadow-xl transition-shadow">
              <span className="material-symbols-outlined text-4xl text-teal-600">
                support_agent
              </span>
              <h4 className="text-xl font-bold mt-4 mb-2">24/7 Support</h4>
              <p>Our team is always here to help you succeed.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
