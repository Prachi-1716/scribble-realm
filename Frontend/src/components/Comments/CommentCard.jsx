import { useState,  useEffect } from "react";
import { useUser } from "../UserContext";
import { toast } from "react-hot-toast";
import axios from "axios";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function CommentCard({ comment, setComments, onReplySubmit, fetchComments, blogId, setCommentCount}) {
  const [replyBox, setReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const { user } = useUser();
  let [showReplies, setShowReplies] = useState(false);
  const [childrenData, setChildrenData] = useState([]);

  useEffect(() => {
    setChildrenData([]);
    setShowReplies(false);
  }, [comment]);


const handleReply = async () => {
  if (!user?.fullName) return toast.error("You are not logged in");
  if (!replyText.trim()) return toast.error("Please write a reply");

  try { 
    const newReply = await onReplySubmit(comment._id, replyText); 
    //setChildrenData(prev => [newReply, ...prev]); 
    setShowReplies(true); 
    setReplyText("");
    setReplyBox(false);
  } catch (err) {
    toast.error(err.message);
  }
};

  const fetchComment = async (id) => {
    try {
      let res = await axios.get(`${SERVER_URL}/api/blogs/${blogId}/comments/${id}`);
      //console.log(res.data);
      return res.data;

    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

   
  
 if(comment) console.log(comment.children);
  const loadReplies = async () => {
    if (!showReplies) {
      // fetch all child comments
      if (comment.children && comment.children.length > 0) {
        try {
          //console.log(comment.children[0]);
          const fetched = await Promise.all(
            comment.children.map((child) => fetchComment(child._id || child))
          );
          setChildrenData(fetched);
        } catch (err) {
          toast.error(err.response?.data?.message || err.message);
        }
      }
    }
    setShowReplies((prev) => !prev);
  };

  const removeCommentById = (commentsArray, idToRemove) => {
  return commentsArray
    .filter(c => c._id !== idToRemove)
    .map(c => ({
      ...c,
      children: c.children ? removeCommentById(c.children, idToRemove) : []
    }));
};

  const handleDelete = async()=>{
    try{
      let res = await axios.delete(`${SERVER_URL}/api/blogs/${blogId}/comments/${comment._id}`, { withCredentials: true });
      setComments(prev => removeCommentById(prev, comment._id));
      setCommentCount(prev => prev - 1);

      toast.success("comment deleted sucessfully");
    }catch(err){
      toast.error(err.response?.data?.message || err.message);
    }
  }

  if (!comment) return <></>;
  

  //let {commented_by} = comment;
 // console.log(comment);
  return (
    <div className="container mt-3 comment-card border-start ms-0">
      {/* User info */}
      <div className="user-info d-flex align-items-center">
        <div className="img m-0">
          <img
            src={
              comment.commented_by?.personal_info?.profile_img ||
              "/default-pfp.png"
            }
            alt="pfp"
          />
        </div>
        <span className="username ms-1">
          @{comment.commented_by?.personal_info?.username || "unknown"}
        </span>
        <span className="date ms-auto">
          {comment.commentedAt
            ? new Date(comment.commentedAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
              })
            : ""}
        </span>
      </div>

      {/* Comment text */}
      <div className="comment ">{comment.comment}</div>

      {/* Reply button */}
      <div className="d-flex mt-1 mb-1 justify-content-center">
        <span className="reply" onClick={() => setReplyBox((prev) => !prev)}>
          Reply
        </span>
        <span className="reply ms-3" onClick={loadReplies}> 
          {!showReplies ? "Show Replies" : "Hide Replies"} <span>{comment.children.length}</span>
        </span> 
        {comment.commented_by?.personal_info?.username === user.username &&   // delete 
          <span className="delete ms-auto"><i className="fa-regular fa-trash-can" onClick={handleDelete}></i></span>}
      </div>

      {/* Reply input */}
      {replyBox && (
        <div className="input ms-5">
          <textarea
            name="reply"
            id="reply"
            rows={2}
            placeholder="Write your reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button className="reply-btn" onClick={handleReply}>
            Reply
          </button>
        </div>
      )}

      {/* Render child replies recursively */}
      {showReplies && childrenData.length > 0 && (
        <div className="replies">
          {childrenData.map((child, idx) => (
            <CommentCard
              key={idx}
              comment={child}
              setComments={setComments}
              onReplySubmit={onReplySubmit}
              fetchComments={fetchComments}
              blogId={blogId}
              setCommentCount={setCommentCount}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentCard;
