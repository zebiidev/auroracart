import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white w-full py-10 px-6 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col items-center space-y-8 md:hidden">
        <a
          href="/"
          className="text-3xl logo font-bold tracking-widest text-center"
        >
          AURORACART
        </a>

        {/* Links Section */}
        <div className="w-full grid grid-cols-2 gap-8 text-sm text-center">
          {/* Left Column */}
          <ul className="space-y-3">
            <li>
              <a href="/" className="hover:underline">
                FAQ&apos;S
              </a>
            </li>
            <li>
              <a href="/login" className="hover:underline">
                Login / Signup
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline">
                How To Buy
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline">
                Payment
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline">
                Shipping & Deliveries
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline">
                Exchange & Returns
              </a>
            </li>
          </ul>

          {/* Right Column */}
          <ul className="space-y-3">
            <li>
              <a href="/" className="hover:underline">
                About Us
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline">
                Retail Stores
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline">
                Contact Us
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline">
                Work With Us
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* Copyright */}
        <span className="text-xs text-gray-400 text-center">
          &copy; {new Date().getFullYear()} AuroraCart. All rights reserved.
        </span>
      </div>

      {/* --- Desktop Layout (3-column original) --- */}
      <div className="max-w-7xl mx-auto hidden md:grid md:grid-cols-3 gap-8 items-start">
        {/* Left Links */}
        <div className="text-left">
          <ul className="space-y-3 text-sm">
            <li>
              <a href="/" className="hover:underline">
                FAQ&apos;S
              </a>
            </li>
            <li>
              <a href="/collection" className="hover:underline">
                Collection
              </a>
            </li>
            <li>
              <a href="/checkout" className="hover:underline">
                Checkout
              </a>
            </li>
            <li>
              <a href="/login" className="hover:underline">
                Login / Signup
              </a>
            </li>
          </ul>
        </div>

        {/* Logo & Copyright */}
        <div className="flex flex-col justify-between h-[40vh] items-center text-center">
          <a href="/" className="text-4xl logo font-bold tracking-widest mb-3">
            AURORACART
          </a>
          <span className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} AuroraCart. All rights reserved.
          </span>
        </div>

        {/* Right Links */}
        <div className="text-right">
          <ul className="space-y-3 text-sm text-gray-300">
            <li>
              <a href="/" className="hover:underline">
                Contact Us
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline">
                Returns & Exchanges
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline">
                Shipping Information
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
