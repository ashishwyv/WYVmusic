import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetTrendingSongQuery } from '../Api/JioSavanApi'
import { useLanguage } from '../LanguageContext';

function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const {language , setLanguage} = useLanguage()

  const handleLanguageChange = (lang) => {
    setLanguage (lang);
    setDropdownOpen(false);
  };

  return (
    <header className="bg-gradient-to-b from-gray-300 to-gray-500 text-black fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-7">
        <div className="text-4xl font-extrabold">WYVm</div>
        <nav className="flex space-x-9">
          <Link to="/" className="transition-colors duration-300 hover:text-gray-200 text-xl">
            Home
          </Link>
          <Link to="/top-charts" className="transition-colors duration-300 hover:text-gray-200 text-xl">
            Top Charts
          </Link>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="transition-colors duration-300 hover:text-gray-200 text-xl"
            >
              Language
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-10">
                <button
                  onClick={() => handleLanguageChange('english')}
                  className="block px-4 py-2 hover:bg-gray-200 w-full text-left transition-colors duration-300"
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageChange('hindi')}
                  className="block px-4 py-2 hover:bg-gray-200 w-full text-left transition-colors duration-300"
                >
                  Hindi
                </button>
                <button
                  onClick={() => handleLanguageChange('marathi')}
                  className="block px-4 py-2 hover:bg-gray-200 w-full text-left transition-colors duration-300"
                >
                  Marathi
                </button>
                <button
                  onClick={() => handleLanguageChange('punjabi')}
                  className="block px-4 py-2 hover:bg-gray-200 w-full text-left transition-colors duration-300"
                >
                  Punjabi
                </button>
                <button
                  onClick={() => handleLanguageChange('haryanvi')}
                  className="block px-4 py-2 hover:bg-gray-200 w-full text-left transition-colors duration-300"
                >
                  Haryanvi
                </button>
                <button
                  onClick={() => handleLanguageChange('bhojpuri')}
                  className="block px-4 py-2 hover:bg-gray-200 w-full text-left transition-colors duration-300"
                >
                  Bhojpuri
                </button>
              </div>
            )}
          </div>
          <Link to="/search" className="transition-colors duration-300 hover:text-gray-200 text-xl">
            Search
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
