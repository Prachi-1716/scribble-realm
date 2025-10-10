
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { useUser } from "../UserContext";
import { useNavigate, Link } from "react-router-dom";
import Content from "./Content";
import axios from "axios"; 
import Comments from "../Comments/Comments";
import "./style.css";
import Loader from "../Loader";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

let fetchInitialLikedState = async (blog) => {
  let res = await axios.get(`${SERVER_URL}/api/blogs/${blog._id}/likes`, {
    withCredentials: true,
  });
  return res.data;
};

function BlogInDetail() {
  const { id } = useParams();
  
  // Reset states on component mount or id change
  let [blog, setBlog] = useState(null);
  let [liked, setLiked] = useState(false);
  let [likeCount, setLikeCount] = useState(0);
  let [commentCount, setCommentCount] = useState(0);
  let [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(true);


  let { user } = useUser();
  let navigate = useNavigate();

  let fetchBlog = async () => {
    try {
      setLoading(true);
      let res = await axios.get(`${SERVER_URL}/api/blogs/${id}`);
      setBlog(res.data);
      setLikeCount(res.data.activity.total_likes || 0);
      setCommentCount(res.data.activity.total_comments || 0);
    } catch (err) {
      let msg = err.response?.data?.message || err.message;
      return toast.error(msg);
    } finally {
    setLoading(false);
  }
  };

  useEffect(() => {
    // Reset states whenever blog id changes
    setBlog(null);
    setLiked(false);
    setLikeCount(0);
    setCommentCount(0);
    setShowComments(false);

    fetchBlog();
  }, [id]);

useEffect(() => {
  if (!blog) return;

  let load = async () => {
    setLoading(true);
    try {
      let initial = await fetchInitialLikedState(blog);
      setLiked(initial);
    } catch (err) {
      setLiked(false);
      let msg = err.response?.data?.message || err.message;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  load();
}, [blog]);


  let handleLikeCount = async () => {
    if (!user) {
      toast.error("Please log in first");
      navigate("/auth/login"); // redirect to login page
      return;
    }

    const newLikedState = !liked;
    setLiked(newLikedState);
    try {
      let result = await axios.patch(
        `${SERVER_URL}/api/blogs/${blog._id}/likes`,
        { increase: newLikedState },
        { withCredentials: true }
      );
      setLikeCount(result.data.count);
      blog.activity.total_likes = result.data.count;
    } catch (err) {
      setLiked(!newLikedState);
      let msg = err.response?.data?.message || err.message;
      toast.error(msg);
    }
  };

  let handleBlog = () => {
    navigate(`/editor/${id}`);
  };


  let handleDelete = async()=>{
    try{
    setLoading(true);
      await axios.delete(`${SERVER_URL}/api/blogs/${blog._id}`, {withCredentials: true});
      toast.success("Blog deleted successfully");
      navigate("/")
    }catch(err){
      let msg = err.response?.data?.message || err.message;
      return toast.error(msg);
    }finally{
    setLoading(false);
  }
  }

  if (!blog && !loading) return <p>blog not foud</p>;
  if(!blog && loading) return <p>Loading...</p>
  //console.log(blog);
  let iconClass = liked ? "fa-solid fa-heart like" : "fa-regular fa-heart like";
  return (
    <>
      <Toaster />
      {showComments && <Comments setShowComments={setShowComments} blog={blog} setBlog={setBlog} setCommentCount={setCommentCount} />}
      <div className="container">
        {loading && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.3)", // semi-transparent
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999
          }}>
            <Loader size={60} />
          </div>
        )}

        {user && user._id === blog.author._id && (
          <div className="mt-3">
            <i className="fa-regular fa-pen-to-square d-block ms-auto mt-2 mb-3" onClick={handleBlog} ></i>
          </div>
        )}
        <div className="ratio ratio-16x9 blog-image mx-auto banner">
          <img src={blog.banner} alt="banner" />
        </div>
        <div className="d-flex flex-column mx-auto" style={{ maxWidth: "700px" }}>
          <span className="publishedAt mt-2 ms-auto">
            {new Date(blog.publishedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>

          <h2 className="fs-3 mt-1">{blog.title}</h2>
          <p>{blog.description}</p>

          <div className="d-flex mt-3 align-items-center" onClick={()=>{navigate(`/users/${blog.author._id}`)}} style={{cursor: "pointer"}}>
            <div>
              <img src={blog.author.personal_info.profile_img} alt="profile image" className="profile-image" />
            </div>
            <div className="d-flex flex-column ms-2">
              <span className="username">@{blog.author.personal_info.username}</span>
              <span className="fullName ms-2">{blog.author.personal_info.fullName}</span>
            </div>
          </div>

          <div className="m-3 d-flex">
            <div>
              <i className={iconClass} onClick={handleLikeCount}></i>
              <span className="like-count ms-1">{likeCount}</span>
              <p className="likePara">Like</p>
            </div>

            <div className="ms-4">
              <i className="fa-regular fa-comment-dots" onClick={() => setShowComments(!showComments)}></i>
              <span className="comment-count ms-1">{commentCount}</span>
              <p className="commentPara">Comments</p>
            </div>

            {blog?.author?.personal_info?.username === user?.username &&   // delete 
              <span className="delete ms-auto"><i className="fa-regular fa-trash-can" onClick={handleDelete}></i></span>}
          </div>
        </div>
        <div className="content mt-3 mx-auto" style={{ maxWidth: "700px" }}>
          {blog.content?.[0]?.blocks?.map((block) => {
            return (
              <div key={block.id}>
                <Content data={block.data} type={block.type} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default BlogInDetail;
