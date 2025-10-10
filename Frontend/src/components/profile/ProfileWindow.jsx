import {Link} from "react-router-dom";
import "./style.css";
import { useUser } from "../UserContext"; 
import axios from "axios";
let SERVER_URL= import.meta.env.VITE_SERVER_URL;

function ProfileWindow() {
    let {user, setUser} = useUser();
    console.log(user._id);

    let handleLogOut = async()=>{
       await axios.post(`${SERVER_URL}/api/auth/logout`, {},{ withCredentials: true });
       setUser(null);
    }
  return (
    <>
      <div className=" outer-div">
        
        <Link className="link d-md-none" aria-current="page" to="/editor">
          <i className="fa-solid fa-file-pen me-1" ></i>
          <span>Write</span>
        </Link>

        <Link className="link" aria-current="page"  to={`/users/${user._id}`}>
          <div >Profile</div>
        </Link>

        <Link
          className="link" aria-current="page"  to="dashboard">
          <div >Dashboard</div>
        </Link>

        {/* <Link className="link" aria-current="page"  to="#">
          <div >Settings</div>
        </Link> */}

        <Link
          className="link" aria-current="page"  to="#">
          <div >
            <button onClick={handleLogOut}>Log out<p>@{user.username}</p>
            </button>
          </div> 
        </Link>
      </div>
    </>
  );
}

export default ProfileWindow;
