import React, { useState, useEffect } from "react";
import { useAppSelector } from "../hooks/reduxHooks";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { MdShoppingCart } from "react-icons/md";
import {  useNavigate } from "react-router-dom";

import banner1 from "../assets/banner1.avif";
import banner2 from "../assets/banner4.avif";
import banner3 from "../assets/banner3.jpg";

const banners: string[] = [banner1, banner2, banner3];

const HeroBanner: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const darkMode = useAppSelector(
        (state: { theme: { darkMode: boolean } }) => state.theme.darkMode
    );
      const navigate = useNavigate();

    // Auto-slide functionality
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleNext = (): void =>
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);

    const handlePrev = (): void =>
        setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);

    const onShopClick = (): void => {
        navigate(`/products`);
    };

    return (
        <div
            className={`relative w-full h-screen overflow-hidden ${darkMode
                ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700"
                : "bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200"
                }`}
        >
            {/* Slide Container */}
            <div
                className="flex transition-transform duration-800 ease-in-out"
                style={{
                    width: `${banners.length * 100}%`,
                    transform: `translateX(-${currentIndex * 100}vw)`,
                }}
                role="region"
                aria-label="Image Slider"
            >
                {banners.length > 0 ? (
                    banners.map((banner, index) => (
                        <div
                            key={index}
                            className="w-screen h-screen flex-shrink-0 bg-center bg-cover"
                            style={{ backgroundImage: `url(${banner})` }}
                            aria-hidden={currentIndex !== index}
                        />
                    ))
                ) : (
                    <div
                        className={`w-screen h-screen flex items-center justify-center ${darkMode ? "bg-gray-800 text-white" : "bg-gray-300 text-black"
                            } text-2xl`}
                    >
                        No Banners Available
                    </div>
                )}
            </div>

            {/* Gradient & Call-to-Action */}
            <div
                className={`absolute inset-x-0 bottom-0 py-12 px-8 sm:px-16 lg:px-20 flex flex-col sm:flex-row sm:justify-between items-center ${darkMode
                    ? "bg-gradient-to-t from-gray-900 via-gray-800 to-transparent"
                    : "bg-gradient-to-t from-gray-200 via-gray-100 to-transparent"
                    }`}
            >
                <h1
                    className={`text-3xl sm:text-5xl font-extrabold text-center sm:text-left mb-4 sm:mb-0 drop-shadow-lg ${darkMode ? "text-indigo-300" : "text-indigo-600"
                        }`}
                >
                    Discover the Latest Trends
                </h1>
                <button
                    onClick={onShopClick}
                    className={`py-3 px-10 rounded-lg shadow-xl flex items-center transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 ${darkMode
                        ? "bg-indigo-500 text-gray-900 hover:bg-indigo-400 hover:text-white focus:ring-indigo-300"
                        : "bg-indigo-500 text-white hover:bg-indigo-600 focus:ring-indigo-300"
                        }`}
                    aria-label="Shop Now"
                >
                    Shop Now
                    <MdShoppingCart className="ml-3 text-2xl" />
                </button>
            </div>

            {/* Navigation Buttons */}
            <button
                className={`absolute left-4 sm:left-8 top-1/2 transform -translate-y-1/2 p-5 rounded-full opacity-70 hover:opacity-100 focus:outline-none focus:ring-4 shadow-lg hover:scale-110 bg-indigo-700 text-white hover:bg-indigo-500 focus:ring-indigo-300"
                    }`}
                onClick={handlePrev}
                aria-label="Previous Slide"
            >
                <AiOutlineArrowLeft className="text-xl sm:text-2xl" />
            </button>
            <button
                className={`absolute right-4 sm:right-8 top-1/2 transform -translate-y-1/2 p-5 rounded-full opacity-70 hover:opacity-100 focus:outline-none focus:ring-4 shadow-lg hover:scale-110 bg-indigo-700 text-white hover:bg-indigo-500 focus:ring-indigo-300"
                    }`}
                onClick={handleNext}
                aria-label="Next Slide"
            >
                <AiOutlineArrowRight className="text-xl sm:text-2xl" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
                {banners.map((_, index) => (
                    <div
                        key={index}
                        className={`h-4 w-4 rounded-full transition-all duration-300 ${currentIndex === index
                            ? "bg-indigo-400 scale-125 shadow-lg"
                            : "bg-gray-500 hover:bg-gray-400"
                            }`}
                        aria-label={`Slide ${index + 1}`}
                        role="button"
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroBanner;
