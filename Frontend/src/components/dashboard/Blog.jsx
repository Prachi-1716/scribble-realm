import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { useUser } from "../UserContext";
import BlogPostCard from "../Home/BlogPostCard";
import axios from "axios";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
import Loader from "../Loader";

function Blog() {
  let { user } = useUser();
  let [blogs, setBlogs] = useState([]);
  let [page, setPage] = useState(1);
  let [hasMore, setHasMore] = useState(true);
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const fetchBlogs = async (pageNum = 1) => {
    if (!hasMore) return; // stop if no more blogs
    try {
      const res = await axios.get(
        `${SERVER_URL}/api/blogs?userId=${user._id}`,
        { params: { page: pageNum, limit: 5 } } // set limit per page
      );

      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      toast.error(msg);
    }
  };

  const loadMoreBlogs = async () => {
    setLoading(true); 
    const res = await fetchBlogs(page);

    if (!res || res.length === 0) {
      setHasMore(false);
      setLoading(false); 
      return;
    }
    setBlogs((prev) => [...prev, ...res]);
    setPage((prev) => prev + 1);
    setLoading(false); 
  };

  useEffect(() => {
    const init = async () => {
      setBlogs([]);
      setPage(1);
      setHasMore(true);
      await loadMoreBlogs();
    };
    init();
  }, []);

  useEffect(() => {
    if (!user || !user._id) {
      toast.error("Please log in first");
      navigate("/auth/login");
    }
  }, [user, navigate]);

  if (loading && blogs.length === 0) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <Loader size={60} />
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="">
        {loading && blogs.length === 0 && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(255, 255, 255, 0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <Loader size={60} />
          </div>
        )}
        {blogs && blogs.length > 0
          ? blogs.map((blog) => <BlogPostCard blog={blog} key={blog._id} />)
          : !hasMore && <p className="m-2">No posts</p>}
        {hasMore && (
          <div>
            <button
              className="load-more"
              onClick={loadMoreBlogs}
              disabled={loading}
            >
              {loading ? "Loading..." : "Load more..."}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Blog;
