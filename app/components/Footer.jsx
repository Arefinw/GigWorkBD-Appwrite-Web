// app/components/footer.jsx
import { Link } from "@remix-run/react";
import {
  CurrencyBangladeshiIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/solid";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link
              to="/"
              className="flex items-center text-emerald-500 font-bold text-2xl"
            >
              <CurrencyBangladeshiIcon className="h-8 w-8 mr-2" />
              GigWorkBD
            </Link>
            <p className="text-sm">
              Bangladesh's premier freelance marketplace connecting talent with
              opportunity since 2023.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-emerald-500">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h3 className="text-emerald-500 font-semibold text-lg mb-4">
              Company
            </h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/about" className="hover:text-emerald-500 text-sm">
                About Us
              </Link>
              <Link
                to="/how-it-works"
                className="hover:text-emerald-500 text-sm"
              >
                How It Works
              </Link>
              <Link to="/blog" className="hover:text-emerald-500 text-sm">
                Blog
              </Link>
              <Link to="/careers" className="hover:text-emerald-500 text-sm">
                Careers
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div className="space-y-2">
            <h3 className="text-emerald-500 font-semibold text-lg mb-4">
              Resources
            </h3>
            <nav className="flex flex-col space-y-2">
              <Link
                to="/help-center"
                className="hover:text-emerald-500 text-sm"
              >
                Help Center
              </Link>
              <Link
                to="/trust-safety"
                className="hover:text-emerald-500 text-sm"
              >
                Trust & Safety
              </Link>
              <Link to="/faq" className="hover:text-emerald-500 text-sm">
                FAQs
              </Link>
              <Link to="/contact" className="hover:text-emerald-500 text-sm">
                Contact Us
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-emerald-500 font-semibold text-lg mb-4">
              Connect With Us
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPinIcon className="h-5 w-5 text-emerald-500 mt-0.5" />
                <span className="text-sm">
                  123 Business Street, Dhaka 1212
                  <br />
                  Bangladesh
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-5 w-5 text-emerald-500" />
                <span className="text-sm">+880 1234 567890</span>
              </div>
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="h-5 w-5 text-emerald-500" />
                <span className="text-sm">support@gigworkbd.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <GlobeAltIcon className="h-5 w-5 text-emerald-500" />
                <span className="text-sm">www.gigworkbd.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div className="mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} GigWorkBD. All rights reserved.
            </div>
            <div className="flex space-x-4">
              <Link to="/privacy" className="hover:text-emerald-500">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-emerald-500">
                Terms of Service
              </Link>
              <Link to="/cookies" className="hover:text-emerald-500">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
