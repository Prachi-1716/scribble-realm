import { useEffect, useState } from "react"; 
import { searchUsers } from "../GetBlogs"; 
import { Toaster, toast } from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import "../style.css";

function ResultUsers({ query }) {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async (reset = false, pageNum = page) => {
    try {
      setLoading(true);

      // call API
      const res = await searchUsers(pageNum, query);   

      if (!res.length) {
        setHasMore(false);
        return;
      }

      setUsers(prev =>
        reset ? res : [...prev, ...res]
      );
       setPage(pageNum + 1);
    } finally {
      setLoading(false);
    }
  };
 
  // Reset & fetch on first render + when query changes
  useEffect(() => {
    setUsers([]);
    setPage(1);
    setHasMore(true);
    fetchUsers(true, 1);
  }, [query]);

  const loadMoreUsers = () => {
    if (!loading && hasMore) {
      fetchUsers(true, page);
    }
  };

  // let showUserInfo = (e)=>{
  //   console.log(e.target);
  // }

  if (users.length === 0 && !hasMore) {
    return (
      <div className="no-results mt-3">
        <Toaster />
        <p>No users found.</p>
      </div>
    );
  }
  console.log(users);
  return (
    <>
      <Toaster />
      {users.map((user, idx) => (
        <div key={user._id || idx} className="usercard d-flex align-items-center gap-2 mt-4" onClick={() => navigate(`/users/${user._id}`)}>
            <div className="profile-image">
                <img src={user.personal_info.profile_img} />
            </div>
            <div>
                <div className="fs-6 username">@{user.personal_info.username}</div>
                <div>{user.personal_info.fullName}</div>
            </div>
        </div>
      ))}
      {hasMore && !loading && (
        <button className="load-more" onClick={loadMoreUsers}>
          Load more...
        </button>
      )}
      {loading && <p>Loading...</p>}
    </>
  );
}

export default ResultUsers;
