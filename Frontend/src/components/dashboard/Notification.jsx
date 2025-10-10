import { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import "./style.css";
import NotificationCard from "./NotificationCard";
import Loader from "../Loader";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function Notification() {
  const { setNewNotificationsCount } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const navLinks = ["All", "Like", "Comment", "Reply"];

  const fetchNotifications = async (reset = false, p = page) => {
    setLoading(true);
    try {
      const res = await axios.get(`${SERVER_URL}/api/users/me/notifications`, {
        withCredentials: true,
        params: {
          type: navLinks[activeIndex],
          page: p,
        },
      });

      const data = res.data || [];

      if (reset) setNotifications(data);
      else setNotifications((prev) => [...prev, ...data]);

      setHasMore(data.length === 10);

      // Update unread badge using backend count
      const countRes = await axios.get(
        `${SERVER_URL}/api/users/me/notifications`,
        {
          withCredentials: true,
          params: { query: "new" },
        }
      );
      setNewNotificationsCount(countRes.data);
    } catch (err) {
      //toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false); // stop loading
    }
  };
  const markAsRead = async () => {
    try {
      await axios.patch(
        `${SERVER_URL}/api/users/me/notifications/read`,
        { type: navLinks[activeIndex] },
        { withCredentials: true }
      );

      // Update all notifications in state as seen
      setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));

      // Reset badge count
      setNewNotificationsCount(0);
    } catch (err) {
      console.log("Error marking notifications as read:", err.message);
    }
  };

  useEffect(() => {
    const newCount = notifications.filter((n) => !n.seen).length;
    setNewNotificationsCount(newCount);
  }, [notifications]);

  useEffect(() => {
    setPage(1);
    fetchNotifications(true, 1);
    markAsRead();
  }, [activeIndex]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(false, nextPage);
  };
  //console.log(notifications);
  return (
    <>
      <Toaster />
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.3)", // semi-transparent
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <Loader size={60} />
        </div>
      )}
      {!loading && notifications.length === 0 && <p>No notifications found.</p>}

      <div className="container-fluid">
        <nav className="d-flex mb-3">
          {navLinks.map((name, index) => (
            <button
              key={name}
              className={`link me-4 ${index === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(index)}
            >
              {name}
            </button>
          ))}
        </nav>

        <div className="notifications-list">
          {notifications.map((n) => (
            <div key={n?._id} className={`notification-item`}>
              {n && (
                <NotificationCard
                  notification={n}
                  setNotifications={setNotifications}
                />
              )}
            </div>
          ))}
        </div>

        {hasMore && notifications.length > 0 && (
          <button
            className="btn btn-outline-primary mt-3"
            onClick={handleLoadMore}
          >
            Load More
          </button>
        )}
      </div>
    </>
  );
}

export default Notification;
