import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { useUser } from "../../UserContext";
import axios from "axios";
import AboutInfo from "./AboutInfo";
import "./style.css";
import UsersPosts from "./UsersPosts";
import Navigation from "../Navigation";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;


function UserProfile() {
    let {id} = useParams();
    let [userInfo, setUserInfo] = useState({});
    let [page, setPage] = useState(1);
    let [hasMore, setHasMore] = useState(true);
    let navigate = useNavigate();
    let {user} = useUser();
    let [blogs, setBlogs] = useState([]);
    let [activeIdx, setActiveIdx] = useState(0); 

    let components = [UsersPosts, AboutInfo];
    const ActiveComponent = components[activeIdx];

    const fetchUser = async () => {
    if (!id) {
      toast.error("Not a valid user");
      return navigate("/");
    }
    try {
      const res = await axios.get(`${SERVER_URL}/api/users/${id}`);
      if (!res.data || Object.keys(res.data).length === 0) {
        toast.error("Not a valid user");
        return navigate("/");
      }
      setUserInfo(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      toast.error(msg);
    }
  };

  const fetchBlogs = async (pageNum = 1) => {
    if (!hasMore) return; // stop if no more blogs
    try {
      const res = await axios.get(
        `${SERVER_URL}/api/blogs?userId=${id}`,
        { params: { page: pageNum, limit: 5 } } // set limit per page
      );

      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      toast.error(msg);
    }
  };
  const loadMoreBlogs = async () => {
    const res = await fetchBlogs(page);

    if (!res || res.length === 0) {
        setHasMore(false);
        if (page === 1) setBlogs([]); // first page has no blogs
        return;
    }

    setBlogs((prev) => [...prev, ...res]);
    setPage((prev) => prev + 1);
    };


    useEffect(() => {
        const init = async () => {
            setBlogs([]);
            setPage(1);
            setHasMore(true);
            await fetchUser();
        };
        init();
    }, [id]);

    useEffect(() => {
        if (userInfo && userInfo.personal_info) {
            loadMoreBlogs(); // fetch first page of blogs
        }
    }, [userInfo]);

    if (!userInfo || !userInfo.personal_info) {
        return <p>Loading...</p>;
    } 

    return ( 
        <>
            <Toaster/> 
            <div className="container d-flex flex-column flex-md-row align-itmes-center justify-content-md-between">
                <div className="col-md-5 col-lg-3 d-flex flex-column me-3">
                    {user && user._id === id && <div className="mt-3"><i className="fa-regular fa-pen-to-square d-block ms-auto" onClick={()=>(navigate("/dashboard/profile/edit"))}></i></div>}
                    <div className="mt-3 d-flex flex-column align-items-center userInfo"> 
                            <img src={userInfo.personal_info.profile_img} alt="profile picture" className="profileImage" /> 
                            <span className="username fw-semibold mt-3">@{userInfo.personal_info.username}</span>
                            <span className="fullName">{userInfo.personal_info.fullName}</span>
                            <div className=" mt">
                                <span className="me-3 info">Blogs {userInfo.account_info.total_posts}</span>
                                <span className="me-3 info">Reads {userInfo.account_info.total_reads}</span>
                            </div>
                    </div>
                    <div className="d-none d-md-flex justify-content-center"><AboutInfo userInfo={userInfo}/></div>
                </div>
                

                <div className="d-md-none">
                    <div className="nav border-bottom pt-3 routes">
                        <Navigation routes={["Blogs", "About"]} activeIdx={activeIdx} setActiveIdx={setActiveIdx} />
                    </div>
                    <ActiveComponent userInfo={userInfo} blogs={blogs} hasMore={hasMore} loadMoreBlogs={loadMoreBlogs}/>
                </div>

                
                <div className="d-none d-md-block col-md-7 col-lg-8"> 
                    <UsersPosts blogs={blogs} hasMore={hasMore} loadMoreBlogs={loadMoreBlogs}/>
                </div> 

            </div>
        </>
     );
}

export default UserProfile;