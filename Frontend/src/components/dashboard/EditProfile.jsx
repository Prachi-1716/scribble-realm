import "./style.css";
import { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import defaultProfile from "../../imgs/defaultProfile.jpg";
import Input from "./Input";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function EditProfile() {
  const [profileData, setProfileData] = useState(null); // fetched user data
  const [preview, setPreview] = useState(defaultProfile); // image preview
  const [selectedFile, setSelectedFile] = useState(null); // holds file for upload
  const { user } = useUser();
  const navigate = useNavigate();

  // Fetch user profile
  const fetchProfileData = async () => {
    if (!user) {
      toast.error("Please log in first");
      navigate("/auth/login");
      return;
    }
    try {
      const res = await axios.get(
        `${SERVER_URL}/api/users/${user._id}`,
        { withCredentials: true }
      );
      setProfileData(res.data);
      setPreview(res.data.personal_info.profile_img); // set initial preview
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // store the file separately
      setPreview(URL.createObjectURL(file)); // show preview
    }
  };

  // Handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profileData) return;

    const formData = new FormData();

    // Check if user selected a new file
    const isNewFile =
      selectedFile &&
      preview !== profileData.personal_info.profile_img &&
      preview !== defaultProfile;

    if (isNewFile) {
      // If user changed the profile picture, send the new file for Cloudinary upload
      formData.append("profilePic", selectedFile);
    } else {
      // Otherwise, send the existing profile image URL
      formData.append(
        "profile_img",
        profileData.personal_info.profile_img || defaultProfile
      );
    }

    // Personal info fields
    formData.append("fullName", e.target.fullName.value);
    formData.append("username", e.target.username.value);
    formData.append("bio", e.target.bio.value);

    // Social links fields
    formData.append("facebook", e.target.facebook.value);
    formData.append("github", e.target.github.value);
    formData.append("instagram", e.target.instagram.value);
    formData.append("twitter", e.target.twitter.value);
    formData.append("youtube", e.target.youtube.value);
    formData.append("websites", e.target.websites.value);

    try {
      const res = await axios.patch(
        `${SERVER_URL}/api/users/me`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Profile updated successfully!");
      setPreview(res.data.personal_info.profile_img); // update preview
      setSelectedFile(null); // clear selected file
      setProfileData(res.data); // update state with new profile
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  if (!profileData) return <></>;
  console.log(preview);

  return (
    <div className="container">
      <Toaster />
      <form
        className="mx-auto m-md-0 mt-3 d-flex flex-column flex-md-row justify-content-md-around "
        onSubmit={handleSubmit}
      >
        <div className="image d-flex flex-column align-items-center">
          <label htmlFor="profileImg">
            {" "}
            <img src={preview} alt="Profile image" className="previewImg" />
          </label>
          <input type="file" id="profileImg" onChange={handleFileChange} />
          <span className="mt-3 username">
            @{profileData.personal_info.username}
          </span>
          <span className="mt-1 fullName">
            {profileData.personal_info.fullName}
          </span>
          <div className="blog-data mt-3 d-flex gap-3">
            <span className="blogs">
              Blogs {profileData.account_info.total_posts}
            </span>
            <span className="reads">
              Reads {profileData.account_info.total_reads}
            </span>
          </div>
        </div>
        <div className="inputs d-flex flex-column align-items-center mt-3">
          <div className="input mt-3 d-flex flex-column">
            <label htmlFor="email" className="mb-2">
              Email
            </label>
            <input
              name="email"
              type="text"
              id="email"
              defaultValue={profileData.personal_info.email}
              disabled
            />
          </div>

          <div className="input mt-3 d-flex flex-column">
            <label htmlFor="fullName" className="mb-2">
              Full Name
            </label>
            <input
              name="fullName"
              type="text"
              id="fullName"
              defaultValue={profileData.personal_info.fullName}
            />
          </div>

          <div className="input mt-3 d-flex flex-column">
            <label htmlFor="username" className="mb-2">
              Username
            </label>
            <input
              name="username"
              type="text"
              id="username"
              defaultValue={profileData.personal_info.username}
            />
          </div>

          <div className="input mt-3 d-flex flex-column">
            <label htmlFor="bio" className="mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              id="bio"
              defaultValue={profileData.personal_info.bio || ""}
              placeholder="Tell us about yourself..."
              className=""
            ></textarea>
          </div>

          <Input profileData={profileData} />
        </div>
      </form>
    </div>
  );
}

export default EditProfile;           