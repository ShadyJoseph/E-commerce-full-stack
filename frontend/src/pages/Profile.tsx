import React, { useState, useEffect } from "react";
import { Address, useUserProfileStore } from "../stores/useProfileStore";
import { useThemeStore } from "../stores/themeStore";
import Loader from "../components/Loader";

const ProfilePage = () => {
  const { profile, getProfile, updateProfile, loading, error } = useUserProfileStore();
  const { darkMode } = useThemeStore();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    addresses: [{ street: "", city: "", state: "", postalCode: "", country: "" }],
  });
  const [password, setPassword] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || "",
        email: profile.email || "",
        addresses: profile.addresses.length
          ? profile.addresses
          : [{ street: "", city: "", state: "", postalCode: "", country: "" }],
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedAddresses = [...formData.addresses];
    updatedAddresses[index] = {
      ...updatedAddresses[index],
      [e.target.name]: e.target.value,
    };
    setFormData({ ...formData, addresses: updatedAddresses });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.displayName || !formData.email) {
      setFeedbackMessage("Please fill out all fields.");
      return;
    }
    try {
      await updateProfile(formData, password);
      setFeedbackMessage("Profile updated successfully!");
      setIsEditing(false);
    } catch {
      setFeedbackMessage("Failed to update profile. Please try again.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div
      className={`max-w-4xl mx-auto p-8 ${darkMode ? "bg-gray-900" : "bg-white"} shadow-xl rounded-xl mt-8 transition-all`}
    >
      <h1 className={`text-4xl font-semibold text-center mb-8 ${darkMode ? "text-white" : "text-gray-900"}`}>
        User Profile
      </h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {feedbackMessage && (
        <p
          className={`text-center mb-6 font-medium ${
            feedbackMessage.includes("success") ? "text-green-500" : "text-red-500"
          }`}
        >
          {feedbackMessage}
        </p>
      )}
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name Field */}
          <div className="space-y-4">
            <label htmlFor="displayName" className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
              Name
            </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className={`w-full p-4 border-2 rounded-lg transition duration-300 focus:ring-2 focus:ring-indigo-500 ${
                darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
              }`}
              placeholder="Your full name"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-4">
            <label htmlFor="email" className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full p-4 border-2 rounded-lg transition duration-300 focus:ring-2 focus:ring-indigo-500 ${
                darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
              }`}
              placeholder="Your email address"
            />
          </div>

          {/* Addresses */}
          <div className="space-y-4">
            <label className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Addresses</label>
            {formData.addresses.map((address, index) => (
              <div key={index} className="space-y-2">
                {["street", "city", "state", "postalCode", "country"].map((field) => (
                  <input
                    key={field}
                    type="text"
                    name={field}
                    value={address[field as keyof Address] || ""}
                    onChange={(e) => handleChange(e, index)}
                    className={`w-full p-4 border-2 rounded-lg transition duration-300 focus:ring-2 focus:ring-indigo-500 ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Password */}
          <div className="space-y-4">
            <label htmlFor="password" className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
              Password (optional)
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-4 border-2 rounded-lg transition duration-300 focus:ring-2 focus:ring-indigo-500 ${
                darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
              }`}
              placeholder="Enter password if updating"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className={`px-6 py-3 rounded-lg ${
                darkMode ? "bg-gray-600 hover:bg-gray-500 text-white" : "bg-gray-300 hover:bg-gray-400 text-black"
              } transition duration-300`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-lg ${
                darkMode ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"
              } disabled:opacity-50 transition duration-300`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {/* Display Profile Info */}
          <div className={`text-lg ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
            <strong>Name:</strong> {profile?.displayName || "N/A"}
          </div>
          <div className={`text-lg ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
            <strong>Email:</strong> {profile?.email || "N/A"}
          </div>
          <div className={`text-lg ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
            <strong>Addresses:</strong>
            {profile?.addresses && profile.addresses.length > 0 ? (
              profile.addresses.map((address, index) => (
                <div key={index}>
                  <div>{address.street}</div>
                  <div>
                    {address.city}, {address.state}
                  </div>
                  <div>{address.postalCode}</div>
                  <div>{address.country}</div>
                </div>
              ))
            ) : (
              <span>Not set</span>
            )}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => setIsEditing(true)}
              className={`px-8 py-3 rounded-lg ${
                darkMode ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"
              } transition duration-300`}
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
