import { useState, useEffect } from "react";
import { getTrendingBlogs } from "./GetBlogs";
import { Link } from "react-router-dom";
import "./style.css";

function TrendingBlogCards() {
  let [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    getTrendingBlogs(setBlogs);
    setLoading(false);
    getTrendingBlogs(setBlogs);
    setLoading(false);
  }, []);

  if (loading) return <p>Loading trending blogs...</p>;
  if (!blogs.length) return <p>No trending blogs found</p>;

  return (
    <div className="d-flex flex-column">
      <h2 className="fs-6 mt-4">Don’t Miss These Reads</h2>
      {blogs.map((blog, idx) => {
        return (
          <Link
            to={`/blogs/${blog._id}`}
            style={{ textDecoration: "none" }}
            key={idx}
          >
            <div className="d-flex align-items-center w-100">
              <div className="rank">{idx < 9 ? "0" + (idx + 1) : idx + 1}</div>
              <div className="card mt-3 pb-2 border-bottom w-100">
                <div className="user">
                  <img
                    src={blog.author.personal_info.profile_img}
                    alt="profile-image"
                    className="rounded-circle "
                    style={{
                      width: "12px",
                      height: "12px",
                      objectFit: "cover",
                    }}
                  />
                  <span className="ms-1">
                    {blog.author.personal_info.username}
                  </span>
                </div>
                <div className="body d-flex justify-content-between align-items-md-center mb-1">
                  <div className="text mt-3 me-2">
                    <h2 className="fs-6 m-0">{blog.title}</h2>
                    {/* <span className="description">{blog.description}</span> */}
                  </div>
                  <div className="trending-banner">
                    <img src={blog.banner} alt="banner" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default TrendingBlogCards;
