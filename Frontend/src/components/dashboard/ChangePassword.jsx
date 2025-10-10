import { useState } from "react";
import "./style.css"; // custom styles
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { useUser } from "../UserContext";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Check if any field is empty
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      toast.error("All fields are required!");
      return;
    }

    // Password strength check
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(formData.newPassword)) {
      toast.error(
        "Password must contain at least 6 characters, including uppercase, lowercase, and a number."
      );
      return;
    }

    // Confirm password match
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }
    try {
      await axios.patch(`${SERVER_URL}/api/users/me/password`, formData, {
        withCredentials: true,
      });
      toast.success("Password changed successfully");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }

    // Reset form
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setShowPassword({ current: false, new: false, confirm: false });
  };

  return (
    <>
      <Toaster />
      <div className="change-password-container d-flex justify-content-center align-items-center">
        <form className="change-password-form" onSubmit={handleSubmit}>
          <h2 className="form-title">Change Password</h2>

          {/* Current Password */}
          <div className="input-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type={showPassword.current ? "text" : "password"}
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password"
            />
            <span
              className="toggle-password"
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, current: !prev.current }))
              }
            >
              <i
                className={`fa-regular ${
                  showPassword.current ? "fa-eye-slash" : "fa-eye"
                }`}
              ></i>
            </span>
          </div>

          {/* New Password */}
          <div className="input-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type={showPassword.new ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
            />
            <span
              className="toggle-password"
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, new: !prev.new }))
              }
            >
              <i
                className={`fa-regular ${
                  showPassword.new ? "fa-eye-slash" : "fa-eye"
                }`}
              ></i>
            </span>
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type={showPassword.confirm ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter new password"
            />
            <span
              className="toggle-password"
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))
              }
            >
              <i
                className={`fa-regular ${
                  showPassword.confirm ? "fa-eye-slash" : "fa-eye"
                }`}
              ></i>
            </span>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </>
  );
}

export default ChangePassword;
