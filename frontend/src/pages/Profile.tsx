import React, { useState, useEffect } from "react";
import { Address, useUserProfileStore } from "../stores/useProfileStore";
import { useThemeStore } from "../stores/themeStore";
import Loader from "../components/Loader";
import { FiUser } from "react-icons/fi";

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
      className={`max-w-4xl mx-auto p-8 mt-12 shadow-2xl rounded-lg transition-all ${
        darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
      }`}
    >
      <div className="flex items-center justify-center p-4">
        <FiUser className="w-16 h-16 text-indigo-500" />
      </div>

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
          <div className="space-y-2">
            <label htmlFor="displayName" className="text-sm font-medium">
              Full Name
            </label>
            <input
              type="text"
              id="displayName"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className={`w-full p-4 border rounded-lg transition focus:ring-2 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 focus:ring-indigo-400 text-gray-200"
                  : "bg-gray-50 border-gray-300 focus:ring-indigo-500"
              }`}
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full p-4 border rounded-lg transition focus:ring-2 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 focus:ring-indigo-400 text-gray-200"
                  : "bg-gray-50 border-gray-300 focus:ring-indigo-500"
              }`}
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium">Addresses</label>
            {formData.addresses.map((address, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["street", "city", "state", "postalCode", "country"].map((field) => (
                  <input
                    key={field}
                    type="text"
                    name={field}
                    value={address[field as keyof Address] || ""}
                    onChange={(e) => handleChange(e, index)}
                    className={`w-full p-3 border rounded-lg transition focus:ring-2 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 focus:ring-indigo-400 text-gray-200"
                        : "bg-gray-50 border-gray-300 focus:ring-indigo-500"
                    }`}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password (optional)
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-4 border rounded-lg transition focus:ring-2 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 focus:ring-indigo-400 text-gray-200"
                  : "bg-gray-50 border-gray-300 focus:ring-indigo-500"
              }`}
              placeholder="Enter new password if updating"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 rounded-lg bg-gray-500 hover:bg-gray-600 text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="text-lg">
            <strong>Name:</strong> {profile?.displayName || "N/A"}
          </div>
          <div className="text-lg">
            <strong>Email:</strong> {profile?.email || "N/A"}
          </div>
          <div className="text-lg">
            <strong>Addresses:</strong>
            {profile?.addresses && profile.addresses.length > 0 ? (
              profile.addresses.map((address, index) => (
                <div key={index} className="mt-2">
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
              className="px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition"
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
