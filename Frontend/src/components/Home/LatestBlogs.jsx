import BlogPostCard from "./BlogPostCard";
import { Toaster, toast } from "react-hot-toast";
import { getLatestBlogs, filterBlogs } from "./GetBlogs";
import { useState, useEffect } from "react";
import Loader from "../Loader";

function LatestBlogs({ mode, setMode }) {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const fetch = async () => {
    setBlogs([]); // reset blogs when mode changes
    setPage(1); 
    setHasMore(true); 
    setLoading(true);

    const firstPage = 1;
    let res;
    if (mode.toLowerCase() === "latest") {
      res = await getLatestBlogs(blogs, setBlogs, firstPage, setPage, setHasMore, false);
    } else {
      res = await filterBlogs(blogs, setBlogs, firstPage, setPage, mode, setHasMore, false);
    }

    // If first page returns 0 blogs, no more blogs to load
    if (!res || res.length === 0) {
      setHasMore(false);
    }
    setLoading(false);
  };

  fetch();
}, [mode]);


  const loadMoreBlogs = async () => {
    let res;
    if (mode.toLowerCase() === "latest") {
      res = await getLatestBlogs(
        blogs,
        setBlogs,
        page,
        setPage,
        setHasMore,
        true
      );
    } else {
      res = await filterBlogs(
        blogs,
        setBlogs,
        page,
        setPage,
        mode,
        setHasMore,
        true
      );
    }

    if (res === 0) setHasMore(false);
  };

  return (
    <div className="container mt-3">
      <Toaster />
      {loading && (
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
          <Loader />
        </div>
      )}
      {blogs.length === 0 && !hasMore ? (
        <p>No blogs available</p>
      ) : (
        <>
          {blogs.map((blog, idx) => (
            <BlogPostCard blog={blog} key={idx} />
          ))}
          {hasMore && (
            <div>
              <button className="load-more" onClick={loadMoreBlogs}>
                Load more...
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default LatestBlogs;
