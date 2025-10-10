import { NavLink } from "react-router-dom";
import { useUser } from "../UserContext";
import "./style.css";

let style={
  backgroundColor: "#0A1A2F", 
  top: "70px",
  left: "32px",
  padding: "3px",
}

function Sidebar({ setShowSideBar, setActiveItem }) {
  const { user, setNewNotificationsCount, newNotificationsCount } = useUser();
  const getLinkClass = ({ isActive}) =>
    `item ${isActive ? "active" : ""}`;

  return (
    <div className="sidebar d-flex flex-column">
      <NavLink to="/dashboard/blogs" className={getLinkClass}  onClick={()=>{setShowSideBar(false); setActiveItem("Blogs");}}>
        <i className="fa-regular fa-file-lines me-2"></i> Blogs
      </NavLink>

      <NavLink to="/dashboard/notifications" className={getLinkClass} onClick={()=>{setShowSideBar(false); setActiveItem("Notifications");}}>
        <i className="fa-regular fa-bell me-2"></i>
        {newNotificationsCount > 0 && (<span className="position-absolute translate-middle border border-light rounded-circle" style={style}>
        <span className="visually-hidden">New alerts</span>
        </span>)}
         Notifications
      </NavLink>

      <NavLink to="/editor" className={getLinkClass} onClick={()=>{setShowSideBar(false); setActiveItem("Write");}}>
        <i className="fa-solid fa-file-pen me-2"></i> Write
      </NavLink>

      <div className="border-bottom settings mt-5">Settings</div>

      <NavLink to="/dashboard/profile/edit"className={getLinkClass}  onClick={()=>{setShowSideBar(false); setActiveItem("Edit Profile");}}>
        <i className="fa-regular fa-user me-2"></i> Edit Profile
      </NavLink>

      <NavLink to="/dashboard/password/change" className={getLinkClass} onClick={()=>{setShowSideBar(false); setActiveItem("Change Password");}}>
        <i className="fa-solid fa-key me-2"></i> Change Password
      </NavLink>
    </div>
  );
}

export default Sidebar;
