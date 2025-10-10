import { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useUser } from "../UserContext";
import { useNavigate, Link } from "react-router-dom";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

let fetchInitialLikedState = async (blog) => {
  let res = await axios.get(`${SERVER_URL}/api/blogs/${blog._id}/likes`, {
    withCredentials: true,
  });
  //console.log(res.data);
  return res.data;
};

function BlogPostCard({ blog }) {
  let [liked, setLiked] = useState(false);
  let [count, setCount] = useState(blog?.activity?.total_likes || 0);
  let { user } = useUser();
  const [updating, setUpdating] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    if (!blog) return;
    let load = async () => {
      try {
        let initial = await fetchInitialLikedState(blog);
        setLiked(initial);
      } catch (err) {
        setLiked(false);
        let msg = err.response?.data?.message || err.message;
        return toast.error(msg);
      }
    };
    load();
  }, []);

  if (!blog) return <></>;
  //console.log(blog);
  let handleLikeCount = async () => {
    if (!user) {
      toast.error("Please log in first");
      navigate("/auth/login"); // redirect to login page
      return;
    }
    if (updating) return; // ignore if already updating
    setUpdating(true);
    const newLikedState = !liked;
    setLiked(newLikedState);
    try {
      let result = await axios.patch(
        `${SERVER_URL}/api/blogs/${blog._id}/likes`,
        { increase: newLikedState },
        { withCredentials: true }
      );
      setCount(result.data.count);
      blog.activity.total_likes = result.data.count;
      //console.log(result);
    } catch (err) {
      setLiked(!newLikedState);
      let msg = err.response?.data?.message || err.message;
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  let iconClass = liked ? "fa-solid fa-heart like" : "fa-regular fa-heart like";
  return (
    <div className="card mt-3 pb-2 border-bottom">
      <div className="user">
        <img
          src={blog.author.personal_info.profile_img}
          alt="profile-image"
          className="rounded-circle"
          style={{
            height: "15px",
            width: "15px",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
        <span className="ms-1">{blog.author.personal_info.username}</span>
      </div>
      <Link to={`/blogs/${blog._id}`} style={{ textDecoration: "none" }}>
        <div className="body d-flex justify-content-between align-items-md-center mb-1">
          <div className="text mt-3 me-2">
            <h2 className="fs-6 m-0">{blog.title}</h2>
            <span className="description">{blog.description}</span>
          </div>
          <div className="banner">
            <img src={blog.banner} alt="banner" />
          </div>
        </div>
      </Link>
      <div className="bottom mt-0 mt-md-2">
        <span className="tag me-3">{blog.tags?.[0] || ""}</span>
        <i className={iconClass} onClick={handleLikeCount}></i>
        <span className="like-count">{count}</span>
      </div>
    </div>
  );
}

export default BlogPostCard;
