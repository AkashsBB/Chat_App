import {useState} from "react";
import {useAuthStore} from "../store/useAuthStore.js";
import {Camera, Mail, User} from "lucide-react";

const ProfilePage = () => {
  const {authUser, isUpdatingProfile, updateProfile} = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = async(e) => {
    const file= e.target.files[0];
    if(!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const photo = reader.result;
      setSelectedImage(photo);
      await updateProfile({profilePic: photo});
    };
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-6 space-y-6">
        {/* Profile Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="text-gray-500">Your Profile Information</p>
        </div>

        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <img
              src={selectedImage || authUser.profilePic || "/avatar.png"}
              alt="profile"
              className="size-32 rounded-full object-cover border-4 border-gray-300 shadow-md"
            />
            <label htmlFor="photo-upload" className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100">
              <Camera className="w-5 h-5 text-gray-600" />
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>
          <p className="text-sm text-gray-500">{isUpdatingProfile ? "Uploading..." : "Click camera icon to update profile photo"}</p>
        </div>

        {/* User Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <User className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-gray-500 text-sm">User Name</p>
              <p className="text-lg font-medium">{authUser?.userName || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 border-b pb-2">
            <Mail className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-gray-500 text-sm">Email Address</p>
              <p className="text-lg font-medium">{authUser?.email || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Account Information</h2>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Member Since</span>
              <span className="font-medium">{authUser?.createdAt?.split("T")[0] || "N/A"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Account Status</span>
              <span className="font-medium text-green-600">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default ProfilePage;

