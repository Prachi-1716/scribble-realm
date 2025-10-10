import { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./notificationCard.css";
import { Link } from "react-router-dom";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function NotificationCard({ notification, setNotifications }) {
  const username = notification?.user?.personal_info?.username || "Unknown";
const profile_img = notification?.user?.personal_info?.profile_img || "/default-profile.png";

const blog = notification?.blog;
const type = notification?.type;
const comment = notification?.comment;
const reply = notification?.reply;
const createdAt = notification?.createdAt;
const seen = notification?.seen || false;

  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const [showInput, setShowInput] = useState(false);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    setReplyText("");
  }, [blog?._id]);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `${SERVER_URL}/api/users/me/notifications/${notification?._id}`,
        { withCredentials: true }
      );

      toast.success("Notification deleted successfully!");
      if (setNotifications) {
        setNotifications((prev) =>
          prev.filter((n) => n._id !== notification?._id)
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!user) return toast.error("You are not logged in");
    if (!replyText.trim()) return toast.error("Please write a reply");

    try {
      setLoading(true);
      // Determine parentId based on notification type
      const parentId = type === "comment" ? comment._id : reply._id;

      await axios.post(
        `${SERVER_URL}/api/blogs/${blog?._id}/comments`,
        { comment: replyText, parentId },
        { withCredentials: true }
      );

      setReplyText("");
      toast.success("Reply added successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const timeAgo = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 1000);
    if (diff < 60) return `${diff} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  const renderContent = () => {
    switch (type) {
      case "like":
        return (
          <span>
            liked your blog:{" "}
            <span className="blog-title">
              "
              <Link
                to={`/blogs/${blog?._id}`}
                style={{ textDecoration: "none" }}
              >
                {blog?.title}
              </Link>
              "
            </span>
          </span>
        );
      case "comment":
        return (
          <span>
            commented on your blog{" "}
            <span className="blog-title">
              "
              <Link
                to={`/blogs/${blog?._id}`}
                style={{ textDecoration: "none" }}
              >
                {blog?.title}
              </Link>
              "
            </span>
            : "{comment?.comment}"
          </span>
        );
      case "reply":
        return (
          <span>
            replied to your comment on{" "}
            <span className="blog-title">
              "
              <Link
                to={`/blogs/${blog?._id}`}
                style={{ textDecoration: "none" }}
              >
                {blog?.title}
              </Link>
              "
            </span>
            : "{reply?.comment}"
          </span>
        );
      default:
        return <span>did something</span>;
    }
  };

  return (
    <div className={`mt-3 card p-2 ${seen ? "seen" : "unseen"}`}>
      <div className="d-flex align-items-start">
        <div className="me-3">
          <img
            src={profile_img}
            alt="profile"
            className="rounded-circle"
            style={{ width: "45px", height: "45px", objectFit: "cover" }}
          />
        </div>
        <div className="flex-grow-1">
          <div>
            <span className="username fs-6 fw-semibold">{username}</span>{" "}
            {renderContent()}
          </div>
          <div className="mt-1">
            {type !== "like" && (
              <span
                className="me-3 reply"
                onClick={() => setShowInput(!showInput)}
              >
                reply
              </span>
            )}
            <span className="me-3 delete" onClick={handleDelete}>
              {loading ? "Deleting..." : "delete"}
            </span>
            <span className="text-muted small">{timeAgo(createdAt)}</span>
          </div>

          {(type === "comment" || type === "reply") && showInput && (
            <div className="mt-2">
              <textarea
                id="reply"
                rows={3}
                placeholder="Write your reply…"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />{" "}
              <br />
              <button
                className="comment-btn mt-1"
                onClick={handleReply}
                disabled={loading}
              >
                {loading ? "Sending..." : "Reply"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationCard;
