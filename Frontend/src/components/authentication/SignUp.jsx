import React, { useState, useEffect } from "react";
import "./style.css";
import google from "../../imgs/google.png";
import {Link, useNavigate} from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { useUser } from "../UserContext";
import { handleGoogleAuth } from "./GoogleAuth";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

function SignUp() {
  let {user, setUser} = useUser();
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formValues, setFormValues] = useState({
    email: "",
    fullName: "",
    password: ""
  });
  let navigate = useNavigate();

  useEffect(() => {
  if (user) {
    toast.error("You are already logged in");
    navigate("/");
  }
}, [user, navigate]);

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  let serverValidation = async () => {
    setLoading(true);
      try {
        let res = await axios.post(`${SERVER_URL}/api/auth/register`, {
          email: formValues.email,
          fullName: formValues.fullName,
          password: formValues.password
        }, { withCredentials: true });
        
        setUser(res.data);
        toast.success("Signed up successfully");
        navigate("/");
      } catch (err) {
        let msg = err.response?.data?.message || err.message;
        toast.error(msg);
      } finally {
      setLoading(false);
    }

    };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setValidated(true);

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      return;
    }

    if (!emailRegex.test(formValues.email)) {
      return toast.error("Please enter a valid email");
    }

    if (!passwordRegex.test(formValues.password)) {
      return toast.error(
        "Password must be at least 6 characters long and include at least one letter and one number."
      );
    }

    await serverValidation();
  };


  return (
    <div className="container-fluid auth-container">
      {loading && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.3)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999
        }}>
          <Loader size={60} />
        </div>
      )}

      <div className="mx-auto pb-4 border-bottom" style={{ width: "350px" }}>
        <Toaster/>
        <h3>Join us!</h3>
        <form className="needs-validation mt-3" noValidate onSubmit={handleSubmit}>

          
          {/* fullName Input */}
          <div className="mb-4">
            <div className={`input-group ${validated && !formValues.fullName ? "is-invalid-group" : ""}`}>
              <span className="input-group-text bg-white border-end-0">
                <i className="fa-solid fa-user"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                name="fullName"
                placeholder="Full name"
                value={formValues.fullName}
                onChange={handleChange}
                required
              />
            </div>
            {validated && !formValues.fullName && (
              <div className="invalid-feedback d-block">Please Enter your name.</div>
            )}
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <div className={`input-group ${validated && !formValues.email ? "is-invalid-group" : ""}`}>
              <span className="input-group-text bg-white border-end-0">
                <i className="fa-solid fa-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control border-start-0"
                name="email"
                placeholder="Email"
                value={formValues.email}
                onChange={handleChange}
                required
              />
            </div>
            {validated && !formValues.email && (
              <div className="invalid-feedback d-block">Please enter your email.</div>
            )}
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <div className={`input-group ${validated && !formValues.password ? "is-invalid-group" : ""}`}>
              <span className="input-group-text bg-white border-end-0">
                <i className="fa-solid fa-key"></i>
              </span>
              <input
                type="password"
                className="form-control border-start-0"
                name="password"
                placeholder="Password"
                value={formValues.password}
                onChange={handleChange}
                required
              />
            </div>
            {validated && !formValues.password && (
              <div className="invalid-feedback d-block">Please choose a password.</div>
            )}
          </div>

          <button className="btn sign-up w-25" type="submit" disabled={loading}>Sign Up</button>
        </form>
      </div>
      <div className="mx-auto mt-3" style={{ width: "350px" }}>
            <button className="btn google w-100 mb-3" onClick={(e)=>handleGoogleAuth(e, setUser, navigate)}><img src={google} style={{width: "25px", marginRight: "10px"}} />Continue with Google</button>
            <span className="ms-3">Already have an account <Link to="/auth/login" style={{color: "#0A1A2F"}}>Sign In</Link></span>
      </div>
    </div>
  );
}

export default SignUp;
