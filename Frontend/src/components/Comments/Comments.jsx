// import "./style.css";
// import { useState, useEffect } from "react";
// import { useUser } from "../UserContext";
// import { Toaster, toast } from "react-hot-toast";
// import axios from "axios";
// import CommentCard from "./CommentCard";

// function Comments({ setShowComments, blog, setBlog, setCommentCount }) {
//   let [comment, setComment] = useState("");
//   let [comments, setComments] = useState([]);
//   let [page, setPage] = useState(1);
//   let [hasMore, setHasMore] = useState(true);
//   let { user } = useUser();

//   let fetchComments = async (page) => {
//     try {
//       let res = await axios.get(
//         `${SERVER_URL}/api/blogs/${blog._id}/comments`,
//         { params: { skip: (page - 1) * 5 } }
//       );
//       if (!res.data || !res.data.length) {
//         setHasMore(false);
//         return;
//       }
//       console.log(res.data);
//       setComments((prev) => [...prev, ...res.data]);
//       setPage((prev) => prev + 1);
//       console.log(res.data);
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message);
//     }
//   };
  
//   useEffect(() => {
//     setComment("");           // reset input
//     setComments([]);          // reset comment list
//     setPage(1);               // reset pagination
//     setHasMore(true);         // reset load more state
//     fetchComments();          // fetch first page
//   }, [blog._id]);             // reset whenever blog changes


//   let handleComment = async () => {
//     if (!user || !user.fullName) return toast.error("You are not logged in");
//     if (!comment.length) return toast.error("please write a comment");

//     try {
//       let res = await axios.post(
//         `${SERVER_URL}/api/blogs/${blog._id}/comments`,
//         { comment, blog_id: blog._id },
//         { withCredentials: true }
//       );
//       let commentDetails = res.data;
//       let parantCommentIncrementVal = 1;
//       commentDetails.commented_by = { personal_info: user };
//       commentDetails.childrenLevel = 0;

//       //let newCommentArray = [commentDetails];

//       setComments((prev) => [commentDetails, ...prev]);
//       setBlog({
//         ...blog,
//         activity: {
//           ...blog.activity,
//           total_comments: blog.activity.total_comments + 1,
//           total_parent_comments:
//             blog.activity.total_parent_comments + parantCommentIncrementVal,
//         },
//       });
//       setCommentCount((prev) => prev + 1);
//       setComment("");
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message);
//     }
//   };

//   const handleReplySubmit = async (parentId, replyText) => {
//     if (!user || !user.fullName) return toast.error("You are not logged in");
//     if (!replyText.trim()) return toast.error("Please write a reply");

//     try {
//       let res = await axios.post(
//         `${SERVER_URL}/api/blogs/${blog._id}/comments`,
//         { comment: replyText, parentId },
//         { withCredentials: true }
//       );

//       let replyComment = res.data;
//       replyComment.commented_by = { personal_info: user };
//       replyComment.childrenLevel = 0;

//       // Update the comments array
//       const addReplyToParent = (commentsArray) => {
//         return commentsArray.map(c => {
//           if (c._id === parentId) {
//             return {
//               ...c,
//               children: c.children ? [replyComment, ...c.children] : [replyComment]
//             };
//           } else if (c.children && c.children.length > 0) {
//             return {
//               ...c,
//               children: addReplyToParent(c.children)
//             };
//           }
//           return c;
//         });
//       };

//       setComments((prev) => addReplyToParent(prev));
//       setBlog({
//         ...blog,
//         activity: {
//           ...blog.activity,
//           total_comments: blog.activity.total_comments + 1,
//         },
//       });
//       setCommentCount((prev) => prev + 1);
//       toast.success("comment added successfully");
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message);
//     }
//   };

//   if (!blog) return <></>;
//   console.log(comments);
//   return (
//     <>
//       {" "}
//       <Toaster />
//       <div className="comment-container">
//         <div className="d-flex">
//           <i
//             className="fa-solid fa-xmark ms-auto"
//             onClick={() => setShowComments(false)}
//           ></i>
//         </div>
//         <h5 className="fs-6 mb-3">Comments</h5>
//         <div className="input">
//           <textarea
//             name="comment"
//             id="comment"
//             rows={3}
//             placeholder="Leave your comment here…"
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//           ></textarea>
//           <button className="comment-btn" onClick={handleComment}>
//             Comment
//           </button>
//         </div>

//         <div className="comments">
//           {comments.map((c, idx) => (
//             <CommentCard
//               key={c._id || c}
//               comment={c}
//               setComments={setComments}
//               onReplySubmit={handleReplySubmit}
//               fetchComments={fetchComments}
//               blogId={blog._id}
//               setCommentCount={setCommentCount}
//             />
//           ))}
//         </div>

//         {hasMore && (
//           <button className="load-more" onClick={fetchComments}>
//             Load more...
//           </button>
//         )}
//       </div>
//     </>
//   );
// }

// export default Comments;


import "./style.css";
import { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import CommentCard from "./CommentCard"; 
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function Comments({ setShowComments, blog, setBlog, setCommentCount }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const { user } = useUser();

  const fetchComments = async (fetchPage = page) => {
    if (loadingComments || !hasMore) return;

    setLoadingComments(true);
    try {
      const res = await axios.get(
        `${SERVER_URL}/api/blogs/${blog._id}/comments`,
        { params: { skip: (fetchPage - 1) * 5 } }
      );

      if (!res.data || !res.data.length) {
        setHasMore(false);
        return;
      }

      setComments((prev) => [...prev, ...res.data]);
      setPage((prev) => prev + 1);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    // Reset states when blog changes
    setComment("");
    setComments([]);
    setPage(1);
    setHasMore(true);
    fetchComments(1); // fetch first page explicitly
  }, [blog._id]);

  const handleComment = async () => {
    if (!user || !user.fullName) return toast.error("You are not logged in");
    if (!comment.trim()) return toast.error("Please write a comment");

    try {
      const res = await axios.post(
        `${SERVER_URL}/api/blogs/${blog._id}/comments`,
        { comment, blog_id: blog._id },
        { withCredentials: true }
      );

      const commentDetails = {
        ...res.data,
        commented_by: { personal_info: user },
        childrenLevel: 0,
      };

      setComments((prev) => [commentDetails, ...prev]);

      setBlog((prev) => ({
        ...prev,
        activity: {
          ...prev.activity,
          total_comments: prev.activity.total_comments + 1,
          total_parent_comments: prev.activity.total_parent_comments + 1,
        },
      }));

      setCommentCount((prev) => prev + 1);
      setComment("");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleReplySubmit = async (parentId, replyText) => {
    if (!user || !user.fullName) return toast.error("You are not logged in");
    if (!replyText.trim()) return toast.error("Please write a reply");

    try {
      const res = await axios.post(
        `${SERVER_URL}/api/blogs/${blog._id}/comments`,
        { comment: replyText, parentId },
        { withCredentials: true }
      );

      const replyComment = {
        ...res.data,
        commented_by: { personal_info: user },
        childrenLevel: 0,
      };

      const addReplyToParent = (commentsArray) => {
        return commentsArray.map((c) => {
          if (c._id === parentId) {
            return {
              ...c,
              children: c.children ? [replyComment, ...c.children] : [replyComment],
            };
          } else if (c.children && c.children.length > 0) {
            return {
              ...c,
              children: addReplyToParent(c.children),
            };
          }
          return c;
        });
      };

      setComments((prev) => addReplyToParent(prev));

      setBlog((prev) => ({
        ...prev,
        activity: {
          ...prev.activity,
          total_comments: prev.activity.total_comments + 1,
        },
      }));

      setCommentCount((prev) => prev + 1);
      toast.success("Comment added successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  if (!blog) return null;

  return (
    <>
      <Toaster />
      <div className="comment-container">
        <div className="d-flex">
          <i
            className="fa-solid fa-xmark ms-auto"
            onClick={() => setShowComments(false)}
          ></i>
        </div>

        <h5 className="fs-6 mb-3">Comments</h5>

        <div className="input">
          <textarea
            name="comment"
            id="comment"
            rows={3}
            placeholder="Leave your comment here…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
          <button className="comment-btn" onClick={handleComment}>
            Comment
          </button>
        </div>

        <div className="comments">
          {comments.map((c) => (
            <CommentCard
              key={c._id}
              comment={c}
              setComments={setComments}
              onReplySubmit={handleReplySubmit}
              fetchComments={fetchComments}
              blogId={blog._id}
              setCommentCount={setCommentCount}
            />
          ))}
        </div>

        {hasMore && (
          <button
            className="load-more"
            onClick={() => fetchComments(page)}
            disabled={loadingComments}
          >
            {loadingComments ? <p>Loading...</p> : "Load more..."}
          </button>
        )}
      </div>
    </>
  );
}

export default Comments;
