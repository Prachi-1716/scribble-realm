import logo from "../imgs/logooo.jpg";
import { Link, Outlet } from "react-router-dom";
import "../index.css";
import { useUser } from "./UserContext";
import { useState, useRef, useEffect } from "react";
import ProfileWindow from "./profile/ProfileWindow";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {Toaster, toast} from "react-hot-toast";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function Navbar() {
  const { user, setNewNotificationsCount, newNotificationsCount } = useUser();
  const [showProfileWindow, setShowProfileWindow] = useState(false);
  const profileRef = useRef(); // Ref for profile dropdown
  const searchInputRef = useRef();
  let navigate = useNavigate();
  let [showSearchOnSmallScreen, setShowSearchOnSmallScreen] = useState(false);
  const [searchBoxClass, setSearchBoxClass] = useState("d-none d-md-flex align-items-center bg-light rounded-pill border");

  const handleProfileWindow = () => setShowProfileWindow(!showProfileWindow);

  // Close profile window when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileWindow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  let newNotifications = async()=>{
    try{
      let res = await axios.get(`${SERVER_URL}/api/users/me/notifications?query=new`, {withCredentials: true});
      setNewNotificationsCount(res.data);
    }catch(err){
      toast.error(err.response?.data?.message || err.message);
    }
  }

  useEffect(() => {
    setShowSearchOnSmallScreen(false);
    if(user && user._id){
    newNotifications();}
  }, []);

  useEffect(() => {
    if(user && user._id){
    const interval = setInterval(newNotifications, 30000); // fetch every 30s
    return () => clearInterval(interval);}
  }, []);

  let handleSearchClick = ()=>{
    setShowSearchOnSmallScreen(true);
    setSearchBoxClass("d-flex align-items-center bg-light rounded-pill border");
  }

  let hideSearch = ()=>{
    setShowSearchOnSmallScreen(false);
    setSearchBoxClass("d-none d-md-flex align-items-center bg-light rounded-pill border");
  }

  let handleSearch = () => {
    let query = searchInputRef.current.value.trim(); 
    if (query) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  };
  let handlePressEnter = (e)=>{
    if(e.key==="Enter") handleSearch(e);
  }
  //console.log(notifications);
  return (
    <>
    <nav className="navbar bg-body-light shadow-sm py-2 sticky-top" style={{backgroundColor: "white"}}>
      <div className="container-fluid px-3">
        {/* Brand */}
        {!showSearchOnSmallScreen && <Link to="/" className="navbar-brand d-flex align-items-center">
          <img
            src={logo}
            className="flex-none w-10 me-md-2"
            style={{ height: "50px" }}
            alt="logo"
          />
        </Link>}

        {/* Search box – visible md+ */}
        <div
          className={searchBoxClass}
          style={{ maxWidth: "260px" }}
        >
          <input
            type="text"
            placeholder="Search"
            className="form-control border-0 bg-light px-3 rounded-pill"
            style={{ boxShadow: "none" }}
            onKeyDown={handlePressEnter}
            ref={searchInputRef}
          />
          <i className="fa-solid fa-magnifying-glass me-3" onClick={handleSearch}></i>
        </div>

        {/* cross icon when searching on small screen */}
        {
          showSearchOnSmallScreen && <i className="fa-solid fa-x ms-3 d-md-none" onClick={hideSearch}></i>
        }

        {/* Nav Links */}
        
        <div className="navbar-nav ms-auto d-flex flex-row align-items-center gap-2">
          {/* Search icon – visible only on small */}
          { !showSearchOnSmallScreen && <div
            className="d-md-none rounded-circle p-2"
            style={{ backgroundColor: "#f2f4f6ff" }}
          >
            <i
              className="fa-solid fa-magnifying-glass fs-5"
              style={{ cursor: "pointer", color: "#0A1A2F" }}
              onClick={handleSearchClick}
            ></i>
          </div>}


          {/* Sign In & Sign Up */}
          {user == null && !showSearchOnSmallScreen && (
            <>
              <Link
                className="nav-link p-0 d-flex justify-content-center ms-md-3"
                aria-current="page"
                to="/auth/login"
                style={{ width: "80px" }}
              >
                <button
                  className="btn rounded-pill w-100"
                  style={{ backgroundColor: "#0A1A2F", color: "white" }}
                >
                  Sign in
                </button>
              </Link>

              <Link
                className="nav-link p-0 d-flex justify-content-center ms-md-3"
                aria-current="page"
                to="/auth/register"
                style={{ width: "95px" }}
              >
                <button
                  className="btn rounded-pill w-100"
                  style={{ border: "2px solid #0A1A2F", color: "#0A1A2F" }}
                >
                  Sign up
                </button>
              </Link>
            </>
          )}

          {/* When user logged in shows notification and profile */}
          {user != null && !showSearchOnSmallScreen && (<>
            
              {/* Write visible on > mid screen*/}
              
            <Link
              className="nav-link d-none p-2 d-md-flex justify-content-center align-items-center rounded-pill"
              aria-current="page"
              to="/editor"
              style={{ backgroundColor: "#f2f4f6ff", width: "80px" }}
            >
              <i
                className="fa-solid fa-file-pen me-1"
                style={{ color: "#0A1A2F" }}
              ></i>
              <span style={{ color: "#0A1A2F" }}>Write</span>
            </Link>
          
            <div className="d-flex align-items-center gap-2 ms-md-3" ref={profileRef} >
              <Link
                className="nav-link p-0 d-flex justify-content-center"
                aria-current="page"
                to="/dashboard/notifications"
              >
                <span
                  className="btn rounded-circle w-100 p-1"
                  style={{ backgroundColor: "#f2f4f6ff", color: "white" }}
                >
                  <i className="fa-regular fa-bell fs-4" style={{ backgroundColor: "#f2f4f6ff", color: "#0A1A2F" }}></i>
                  <span 
                    className="rounded-pill ps-1 pe-1" 
                    style={{ backgroundColor: "#0A1A2F", color: "#f2f4f6ff",  position: "absolute ", top: "19px", right: "71px", fontSize: "10px"}}
                  >
                    {newNotificationsCount > 0 ?(newNotificationsCount <= 9 ? newNotificationsCount: newNotificationsCount + "+"): null}
                    <span className="visually-hidden">unread messages</span>
                  </span>
                   </span>
              </Link>

              <button
                className="nav-link p-0 d-flex justify-content-center"
                aria-current="page"
                style={{ width: "40px" }}
                onClick={handleProfileWindow}
              >
                <img src={user.profile_img} style={{height: "40px", width: "40px", objectFit: "cover", objectPosition: "center", borderRadius: "50%"}} />
              </button>

              {showProfileWindow && <ProfileWindow />}
            </div>
            </>
          )}
        </div>
      </div>
    </nav>
    <Toaster/>
    <Outlet/>
    </>
  );
}

export default Navbar;
