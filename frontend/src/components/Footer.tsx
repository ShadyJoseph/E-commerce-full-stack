import React from "react";
import { IoMail, IoLocationSharp } from "react-icons/io5";
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";
import { useAppSelector } from "../hooks/reduxHooks";

const Footer: React.FC = () => {
  const darkMode = useAppSelector(
    (state: { theme: { darkMode: boolean } }) => state.theme.darkMode
  );

  return (
    <footer
      className={`py-10 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
          : "bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          {/* Contact Section */}
          <div className="flex flex-col items-center space-y-4">
            <p className="text-lg font-bold text-indigo-500">Contact Us</p>
            <div className="flex items-center space-x-3">
              <IoMail className="text-2xl text-indigo-400" />
              <span className="text-sm">shadyjosephabadeer2003@gmail.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <IoLocationSharp className="text-2xl text-indigo-400" />
              <span className="text-sm">Egypt, Cairo</span>
            </div>
          </div>

          {/* Get in Touch Section */}
          <div className="flex flex-col items-center space-y-4">
            <p className="text-lg font-bold text-indigo-500">Get In Touch</p>
            {["About Us", "Privacy Policy", "Terms and Conditions"].map(
              (text) => (
                <p
                  key={text}
                  className={`cursor-pointer transition-transform duration-300 ${
                    darkMode
                      ? "hover:text-indigo-300 hover:translate-y-1"
                      : "hover:text-indigo-700 hover:translate-y-1"
                  }`}
                >
                  {text}
                </p>
              )
            )}
          </div>

          {/* Social Media Section */}
          <div className="flex flex-col items-center space-y-6">
            <p className="text-lg font-bold text-indigo-500">Follow Us</p>
            <div className="flex space-x-6">
              {[
                {
                  href: "https://www.instagram.com/",
                  Icon: FaInstagram,
                  hoverBg: "hover:bg-pink-500",
                },
                {
                  href: "https://www.facebook.com/",
                  Icon: FaFacebook,
                  hoverBg: "hover:bg-blue-500",
                },
                {
                  href: "https://www.tiktok.com/",
                  Icon: FaTiktok,
                  hoverBg: "hover:bg-black",
                },
              ].map(({ href, Icon, hoverBg }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`rounded-full p-3 ${
                    darkMode ? "bg-gray-800" : "bg-gray-200"
                  } ${hoverBg} hover:text-white transition-transform duration-300 transform hover:scale-110`}
                >
                  <Icon className="text-2xl" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center mt-8 opacity-80">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Your Company, Inc. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
