import BlogPostCard from "../BlogPostCard";
function UsersPosts({ blogs, hasMore, loadMoreBlogs }) {
  return (
    <div>
      {blogs && blogs.length > 0
        ? blogs.map((blog, idx) => <BlogPostCard blog={blog} key={idx} />)
        : !hasMore && <p className="m-2">No posts</p>}
      {hasMore && (
        <div>
          <button className="load-more" onClick={loadMoreBlogs}>
            Load more...
          </button>
        </div>
      )}
    </div>
  );
}

export default UsersPosts;
