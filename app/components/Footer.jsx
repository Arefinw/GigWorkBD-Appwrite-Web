import React from "react";

/* Don't forget to download the CSS file too 
OR remove the following line if you're already using Tailwind */

import "../styles/footer.css";

export default function Footer() {
  return (
    <div id="webcrumbs">
      <footer className="bg-gradient-to-r from-white to-teal-50 border-t border-teal-200 w-full mt-auto relative bottom-0 left-0 right-0 min-h-[3rem]">
        <div className="container mx-auto px-4 md:px-8 w-full">
          <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-4 mb-6">
            <div className="group p-4 rounded-lg transform hover:scale-105 transition-all duration-300 relative hover:z-30 bg-gradient-to-r from-white to-teal-50 shadow-sm hover:shadow-md">
              <h5 className="font-bold mb-4 text-teal-700">GigWorkBD</h5>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="hover:text-teal-600 transition-colors duration-300 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">info</span>
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-teal-600 transition-colors duration-300 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">work</span>
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-teal-600 transition-colors duration-300 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">newspaper</span>
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div className="group p-4 rounded-lg transform hover:scale-105 transition-all duration-300 relative hover:z-30 bg-gradient-to-r from-white to-teal-50 shadow-sm hover:shadow-md">
              <h5 className="font-bold mb-4 text-teal-700">For Clients</h5>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="hover:text-teal-600 transition-colors duration-300 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">
                      business_center
                    </span>
                    How to Hire
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-teal-600 transition-colors duration-300 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">store</span>
                    Talent Marketplace
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-teal-600 transition-colors duration-300 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">security</span>
                    Payment Protection
                  </a>
                </li>
              </ul>
            </div>
            <div className="group p-4 rounded-lg transform hover:scale-105 transition-all duration-300 relative hover:z-30 bg-gradient-to-r from-white to-teal-50 shadow-sm hover:shadow-md">
              <h5 className="font-bold mb-4 text-teal-700">For Talent</h5>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="hover:text-teal-600 transition-colors duration-300 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">search</span>
                    How to Find Work
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-teal-600 transition-colors duration-300 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">handshake</span>
                    Direct Contracts
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-teal-600 transition-colors duration-300 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">payments</span>
                    Getting Paid
                  </a>
                </li>
              </ul>
            </div>
            <div className="group p-4 rounded-lg transform hover:scale-105 transition-all duration-300 relative hover:z-30 bg-gradient-to-r from-white to-teal-50 shadow-sm hover:shadow-md">
              <h5 className="font-bold mb-4 text-teal-700">Resources</h5>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="hover:text-teal-600 transition-colors duration-300 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">help</span>
                    Help & Support
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-teal-600 transition-colors duration-300 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">star</span>
                    Success Stories
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-teal-600 transition-colors duration-300 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">article</span>
                    Blog
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-emerald-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-emerald-700">
              © 2025 GigWorkBD. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="transform hover:scale-110 transition-all duration-300"
              >
                <i className="fa-brands fa-facebook text-2xl hover:text-emerald-600 transition-colors duration-300" />
              </a>
              <a
                href="#"
                className="transform hover:scale-110 transition-all duration-300"
              >
                <i className="fa-brands fa-twitter text-2xl hover:text-teal-600 transition-colors duration-300" />
              </a>
              <a
                href="#"
                className="transform hover:scale-110 transition-all duration-300"
              >
                <i className="fa-brands fa-linkedin text-2xl hover:text-teal-600 transition-colors duration-300" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
