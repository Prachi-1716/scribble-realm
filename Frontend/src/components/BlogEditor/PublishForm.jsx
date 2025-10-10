import { Toaster, toast } from "react-hot-toast";
import { useblogEditorContext } from "./BlogEditorContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import banner from "../../imgs/blogbanner.png";
import "./style.css";
import Loader from "../Loader";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function PublishForm({ blogId }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  let { blog, setBlog, setEditorState, isDraft, setIsDraft } =
    useblogEditorContext();
  const [preview, setPreview] = useState(
    blog.banner instanceof File ? URL.createObjectURL(blog.banner) : blog.banner
  );

  useEffect(() => {
    if (blog.banner instanceof File) {
      const objectUrl = URL.createObjectURL(blog.banner);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl); // cleanup
    } else {
      setPreview(blog.banner || banner);
    }
  }, [blog.banner]);

  let canclePublish = () => {
    setEditorState("editor");
  };
  let handleEkeyDown = (e) => {
    if (e.key === "Enter") e.preventDefault();
  };

  let handleChange = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
    setBlog({ ...blog, title: e.target.value });
  };

  let setDescription = (e) => {
    if (e.target.value.length > 250)
      return toast.error("description can have at most 250 character");
    setBlog({ ...blog, description: e.target.value });
  };

  let handleTagAdd = (e) => {
    if (blog.tags.length === 10)
      return toast.error("Can not add more that 10 tags");
    let tag = e.target.value;
    if (e.key === "Enter" && tag !== "" && !blog.tags.includes(tag)) {
      setBlog({ ...blog, tags: [...blog.tags, tag] });
      e.target.value = "";
    }
  };

  let removeTag = (e) => {
    let tagToRemove = e.target.parentElement.dataset.tag;
    setBlog({ ...blog, tags: blog.tags.filter((t) => t !== tagToRemove) });
  };

  let updateBlog = async (formData) => {
    try {
      if (loading) return;
      setLoading(true);

      let res = await axios.patch(
        `${SERVER_URL}/api/blogs/${blogId}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      //   console.log(res.data);
      toast.success("Blog updated successfully");
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false); 
    }
  };

  let publishBlog = async () => {
    let { title, banner, description, content } = blog;
    console.log(blog);
    if (
      !isDraft &&
      (!title ||
        !banner ||
        !description ||
        !content?.blocks.length ||
        !blog.tags?.length)
    ) {
      return toast.error("Please fill all the fields");
    }
    // let toastId;

    try {
      if (loading) return; // prevent multiple clicks
      setLoading(true);
    //   let msg = !isDraft ? "Publishing blog..." : "Saving Draft...";
    //   toastId = toast.loading(msg);

      let blocks = await Promise.all(
        content.blocks.map(async (block) => {
          if (block.type === "image") {
            let imagefile = block.data.file?.orgFile;
            if (imagefile) {
              let formData = new FormData();
              formData.append("image", imagefile);
              let res = await axios.post(
                `${SERVER_URL}/api/blogs/image`,
                formData,
                {
                  withCredentials: true,
                  headers: { "Content-Type": "multipart/form-data" },
                }
              );
              return {
                ...block,
                data: { ...block.data, file: { url: res.data.url } },
              };
            }
          }
          return block;
        })
      );

      const updatedContent = { ...blog.content, blocks: blocks };

      // Update state (not strictly required for backend request, but keeps frontend in sync)
      setBlog((prev) => ({ ...prev, content: updatedContent }));

      let formData = new FormData();
      formData.append("title", blog.title);
      formData.append("description", blog.description);
      formData.append("content", JSON.stringify(updatedContent));
      formData.append("tags", JSON.stringify(blog.tags));
      formData.append("isDraft", isDraft);

      if (blog.banner instanceof File) {
        formData.append("banner", blog.banner); // send file
      } else if (typeof blog.banner === "string") {
        formData.append("bannerUrl", blog.banner); // send URL string separately
      }

      if (blogId) {
        await updateBlog(formData);
        // toast.dismiss(toastId);
        return;
      }

      await axios.post(`${SERVER_URL}/api/blogs`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Blog published successfully");
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    //   toast.dismiss(toastId);
    }
  };
  return (
    <><Toaster />
    <section> 
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <Loader size={60} />
        </div>
      )}

      <button className="publishBtn" onClick={canclePublish}>
        <i className="fa-solid fa-xmark"></i>
      </button>
      <div className="preview container d-flex flex-column align-items-center">
        <p className="mt-5 ">Preview</p>
        <div className="ratio ratio-16x9 blog-image mx-auto">
          <img src={preview} className="img-fluid bannerimg"></img>
        </div>

        {/* title */}
        <div className="d-flex justify-content-center flex-column mt-4 publish-input-container">
          <label htmlFor="title">Title: </label>
          <textarea
            name="title"
            id="title"
            placeholder="Blog Title"
            onKeyDown={handleEkeyDown}
            onChange={handleChange}
            value={blog.title}
          ></textarea>
        </div>

        {/* description */}
        <div className="d-flex justify-content-center flex-column mt-4 publish-input-container">
          <label htmlFor="title">Description: </label>
          <textarea
            name="description"
            id="description"
            placeholder="Write a short description..."
            rows={5}
            onChange={setDescription}
            value={blog.description}
          ></textarea>
          <span className="ms-auto" style={{ fontSize: "12px" }}>
            {250 - blog.description.length} character left
          </span>
        </div>
        {/* Tags */}
        <div className="d-flex justify-content-center flex-column tags mt-4">
          <label htmlFor="tags">Make It Discoverable 🌍</label>
          <input
            type="text"
            placeholder="Tags"
            id="tags"
            onKeyDown={handleTagAdd}
          />
          <div className="mt-3">
            {blog.tags.map((tag, idx) => {
              return (
                <span className="tag" key={idx} data-tag={tag}>
                  {tag}{" "}
                  <i className="fa-solid fa-xmark" onClick={removeTag}></i>
                </span>
              );
            })}
          </div>
          <span className="ms-auto" style={{ fontSize: "12px" }}>
            {10 - blog.tags.length} left
          </span>
        </div>
        <button
          className="btn rounded-pill mt-3 mb-2"
          style={{
            backgroundColor: "#0A1A2F",
            color: "white",
            minWidth: "85px",
          }}
          onClick={publishBlog}
          disabled={loading}
        >
          {isDraft ? "Save Draft" : "Publish"}
        </button>
      </div>
    </section></>
  );
}

export default PublishForm;
