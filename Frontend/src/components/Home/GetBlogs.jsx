import axios from "axios";
import { toast } from "react-hot-toast";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

// latest blogs
let getLatestBlogs = async (
  blogs,
  setBlogs,
  page = 1,
  setPage,
  setHasMore,
  append = true
) => {
  try {
    const res = await axios.get(`${SERVER_URL}/api/blogs?type=latest`, {
      params: { page },
    });

    if (!res.data.length) {
      if (page === 1) {
        toast.error("Sorry, couldn't find the blogs");
        return -1; // keep previous blogs
      } else {
        setHasMore(false);
        return 0; // no more blogs
      }
    }

    setBlogs(append ? [...blogs, ...res.data] : res.data);
    setPage((prev) => prev + 1);
    return 1;
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
  }
};

// filtered blogs
let filterBlogs = async (
  blogs,
  setBlogs,
  page = 1,
  setPage,
  category,
  setHasMore,
  append = true
) => {
  try {
    const res = await axios.get(`${SERVER_URL}/api/search/blogs`, {
      params: { category, page },
    });
    console.log(res.data);
    if (!res.data.length) {
      if (page === 1) {
        toast.error("Sorry, couldn't find the blogs");
        setHasMore(false);
        return -1;
      } else {
        setHasMore(false);
        return 0;
      }
    }

    setBlogs(append ? [...blogs, ...res.data] : res.data);
    setPage((prev) => prev + 1);
    return 1;
  } catch (err) {
    console.log(err.response);
    console.log(err);
    toast.error(err.response?.data?.message || err.message);
  }
};
//search blog via search box
let searchBlogs = async (page = 1, query) => {
  try {
    const res = await axios.get(`${SERVER_URL}/api/search/blogs`, {
      params: { query, page },
    });
    return res.data;
  } catch (err) {
    return toast.error(err.response?.data?.message || err.message);
  }
};
//search users
let searchUsers = async (page = 1, query) => {
  try {
    const res = await axios.get(`${SERVER_URL}/api/search/users`, {
      params: { query, page },
    });
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
  }
};
// Trending blogs (unchanged)
let getTrendingBlogs = async (setBlogs) => {
  try {
    let res = await axios.get(`${SERVER_URL}/api/blogs?type=trending`);
    setBlogs(res.data);
  } catch (err) {
    let msg = err.response?.data?.message || err.message;
    toast.error(msg);
  }
};

export {
  getLatestBlogs,
  filterBlogs,
  getTrendingBlogs,
  searchBlogs,
  searchUsers,
};
