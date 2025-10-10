import { useEffect, useState } from "react";
import BlogPostCard from "../BlogPostCard";
import { searchBlogs } from "../GetBlogs";
import { Toaster, toast } from "react-hot-toast";
import "../style.css";

function ResultBlogs({ query }) {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchBlogs = async (reset = false, pageNum = 1) => {
    try {
      setLoading(true);
 
      const res = await searchBlogs(page, query); 
      //console.log(res);

      if (!res.length) {
        setHasMore(false);
        return;
      }

      setBlogs(prev =>
        reset ? res : [...prev, ...res]
      );
      setPage(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    setBlogs([]);
    setPage(1);
    setHasMore(true);
    fetchBlogs(true);
  }, [query]);

  const loadMoreBlogs = () => {
    if (!loading && hasMore) {
      fetchBlogs();
    }
  };

  if (blogs.length === 0 && !hasMore) {
    return (
      <div className="no-results mt-3">
        <Toaster />
        <p>No blogs found.</p>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      {blogs.map((blog, idx) => (
        <div key={blog._id || idx}>
          <BlogPostCard blog={blog} />
        </div>
      ))}
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
    </>
  );
}

export default ResultBlogs;
