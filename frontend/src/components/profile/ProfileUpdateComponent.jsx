import { useState, useRef } from "react";
import { ApiUpdateUserProfile } from "src/api/UserProfileApi";
import { axiosInstance } from "src/api/AxiosConfig";
import { useEffect } from "react";

export function ProfileUpdateComponent() {
  const [file, setFile] = useState(null);
  const [username, setUserName] = useState("");
  const [about, setAbout] = useState();
  const fileInputRef = useRef(null);
  const [profile_pic, setProfilePic] = useState(undefined);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/user/data/");
        const fetchedProfilePic = response.data.profile_pic;
        const fetchedName = response.data.username;
        const fetchedAbout = response.data.about;
        setProfilePic(fetchedProfilePic);
        setAbout(fetchedAbout);
        setUserName(fetchedName);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

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
    formData.append("profile_pic", file);
    formData.append("username", username);
    formData.append("about", about);

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
        <div className="avatar w-32 h-32 cursor-pointer hover:blur" onClick={handleImageUpload}>
          {file ? (
            <img src={URL.createObjectURL(file)} alt="Profile" className="rounded-full" />
          ) : (
            <>
              <img src={profile_pic} alt="Default" className="rounded-full" />
              <i className="fas fa-camera text-white text-2xl absolute bottom-0 right-0 mr-2 mb-2"></i>
              <i className="fas fa-arrow-up text-white text-2xl absolute top-0 right-0 mr-2 mt-2"></i>
            </>
          )}
        </div>
      </div>

      {/* Username Field
      <div className="w-96">
        <label className="block mb-2 text-gray-600">Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          className="input w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div> */}

      {/* Full Name Field */}
      <div className="w-96">
        <label className="block mb-2 text-gray-600">username</label>
        <input
          type="text"
          placeholder="Enter your username"
          className="input w-full"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
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
