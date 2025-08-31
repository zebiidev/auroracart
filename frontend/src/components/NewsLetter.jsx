import React, { useState } from "react";
import Title from "./Title";

const NewsLetter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className="translate-y-7 w-full px-4 py-12 ">
      <Title title="Subscribe to Get the Latest Trends First" />
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center mt-6">
          <div className="relative w-full md:w-1/2">
            <input
              type="email"
              id="newsletter"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-transparent 
                   focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-300"
            />
            <label
              htmlFor="newsletter"
              className={`absolute left-4 bg-gray-50 px-1 transition-all duration-300 ease-in-out
          ${
            email
              ? "top-[-8px] text-xs text-black"
              : "peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-black"
          }`}
            >
              Enter your email
            </label>
          </div>

          <button
            className="mt-4 px-6 py-3 bg-black text-white rounded-lg hover:bg-black/90 
                     transition-colors duration-300 shadow-md"
          >
            Subscribe
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsLetter;
