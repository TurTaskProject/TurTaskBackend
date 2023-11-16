import React, { useState, useRef } from 'react';
import { ApiUpdateUserProfile } from '../api/UserProfileApi';

function ProfileUpdateComponent() {
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [about, setAbout] = useState('');
  const defaultImage = 'https://i1.sndcdn.com/artworks-cTz48e4f1lxn5Ozp-L3hopw-t500x500.jpg';
  const fileInputRef = useRef(null);

  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append('profile_pic', file);
    formData.append('first_name', username);
    formData.append('about', about);

    ApiUpdateUserProfile(formData);
  };

  return (
    <div className="flex flex-col items-center mt-12 space-y-4">
      {/* Profile Image */}
      <div className="w-32 h-32 relative">
        <label htmlFor="profileImage" className="absolute inset-0">
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </label>
        <div
          className="avatar w-32 h-32 cursor-pointer hover:blur"
          onClick={handleImageUpload}
        >
          {file ? (
            <img src={URL.createObjectURL(file)} alt="Profile" className="rounded-full" />
          ) : (
            <>
              <img src={defaultImage} alt="Default" className="rounded-full" />
              <i className="fas fa-camera text-white text-2xl absolute bottom-0 right-0 mr-2 mb-2"></i>
              <i className="fas fa-arrow-up text-white text-2xl absolute top-0 right-0 mr-2 mt-2"></i>
            </>
          )}
        </div>
      </div>

      {/* Username Field */}
      <div className="w-96">
        <label className="block mb-2 text-gray-600">Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          className="input w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      {/* Full Name Field */}
      <div className="w-96">
        <label className="block mb-2 text-gray-600">Full Name</label>
        <input
          type="text"
          placeholder="Enter your full name"
          className="input w-full"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      {/* About Field */}
      <div className="w-96">
        <label className="block mb-2 text-gray-600">About Me</label>
        <textarea
          placeholder="Tell us about yourself"
          className="textarea w-full h-32"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />
      </div>

      {/* Save Button */}
      <button className="btn btn-primary w-96" onClick={handleSave}>
        Save
      </button>
    </div>
  );
}

export default ProfileUpdateComponent;
