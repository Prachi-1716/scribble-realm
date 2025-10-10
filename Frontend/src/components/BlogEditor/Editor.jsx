

import { Link, useParams } from "react-router-dom";
import logo from "../../imgs/logooo.jpg";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useblogEditorContext } from "./BlogEditorContext";
import EditorJS from "@editorjs/editorjs";
import tools from "./tools"; 
import "./style.css";
import banner from "../../imgs/blogbanner.png";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

// fetch blog
let fetchPreviousBlog = async (id, setBlog) => {
  try {
    let res = await axios.get(`${SERVER_URL}/api/blog/${id}`, { params: { mode: "edit" } });
    setBlog(res.data);
  } catch (err) {
    let msg = err.response?.data?.message || err.message;
    toast.error(msg);
  }
};

function Editor({ setBlogId }) {
  const { blog, setBlog, textEditor, setTextEditor, setEditorState, isDraft, setIsDraft } = useblogEditorContext();
  const [preview, setPreview] = useState(blog.banner instanceof File ? URL.createObjectURL(blog.banner) : blog.banner || banner);
  const { id } = useParams();
  const editorRef = useRef(null); // ref for EditorJS container

//   // fetch blog if editing
//   useEffect(() => {
//     if (id) fetchPreviousBlog(id, setBlog);
//   }, [id]);

useEffect(() => {
  if (!editorRef.current) return;

  const editor = new EditorJS({
    holder: editorRef.current,
    data: blog.content?.blocks ? blog.content : { blocks: [] }, // empty if new blog
    tools,
    placeholder: "Let's write something",
  });

  setTextEditor(editor);

  return () => {
    editor.isReady
      .then(() => editor.destroy())
      .catch(() => {});
  };
}, [blog]);

 
  useEffect(() => {
    if (!blog?._id) return; 
    if (!editorRef.current) return;

    const editor = new EditorJS({
      holder: editorRef.current,
      data: blog.content?.blocks ? blog.content : { blocks: [] },
      tools,
      placeholder: "Let's write something",
    });

    setTextEditor(editor);

    return () => {
      editor.isReady
        .then(() => editor.destroy())
        .catch(() => {});
    };
  }, [blog?._id]);

  // handle banner preview
  useEffect(() => {
    if (!blog?.banner) return;

    if (blog.banner instanceof File) {
      const objectUrl = URL.createObjectURL(blog.banner);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(blog.banner);
    }
  }, [blog?.banner]);

  const handleBannerUpload = (e) => {
    const img = e.target.files[0];
    if (img) {
      setPreview(URL.createObjectURL(img));
      setBlog({ ...blog, banner: img });
    }
  };

  const handleChange = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
    setBlog({ ...blog, title: e.target.value });
  };

  const handleEkeyDown = (e) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const handlePublish = () => {
    if (!isDraft && blog.banner == "/src/imgs/blogbanner.png") return toast.error("Banner is not chosen");
    if (!isDraft && !blog.title.length) return toast.error("Title is Empty");

    textEditor?.isReady?.then(() => {
      textEditor.save().then((res) => {
        if (res.blocks.length) {
          setBlog({ ...blog, content: res });
          setEditorState("publish");
          if (id) setBlogId(id);
        } else if (!isDraft) {
          toast.error("Content is Empty");
        }
      });
    });
  };

  if (id && !blog?._id) return <p>Loading...</p>;

  return (
    <>
      <nav className="navbar bg-body-light shadow-sm py-2 border-bottom">
        <div className="container-fluid px-3">
          <div className="d-flex align-items-center">
            <Link to="/" className="navbar-brand d-flex align-items-center">
              <img src={logo} className="flex-none w-10 me-md-2" style={{ height: "50px" }} alt="logo" />
            </Link>
            <p className="d-none d-md-inline m-0 p-0">{blog.title.length ? blog.title : "New Blog"}</p>
          </div>
          <div className="d-flex gap-3 align-items-center">
            <button className="btn rounded-pill" style={{ backgroundColor: "#0A1A2F", color: "white", width: "85px" }} onClick={() => { setIsDraft(false); handlePublish(); }}>Publish</button>
            <button className="btn rounded-pill" style={{ border: "2px solid #0A1A2F", color: "#0A1A2F", width: "110px" }} onClick={() => { setIsDraft(true); handlePublish(); }}>Save Draft</button>
          </div>
        </div>
      </nav>

      <section>
        <div className="mx-auto container">
          <Toaster />
          <div className="ratio ratio-16x9 blog-image mx-auto">
            <label htmlFor="uploadBanner"><img src={preview} className="img-fluid bannerimg" /></label>
            <input type="file" id="uploadBanner" accept=".png, .jpg, .jpeg" hidden onChange={handleBannerUpload} name="banner" />
          </div>

          <div className="d-flex justify-content-center editor">
            <textarea name="title" id="title" placeholder="Blog Title" onKeyDown={handleEkeyDown} onChange={handleChange} value={blog.title}></textarea>
          </div>

          <div ref={editorRef} className="p-0 m-0"></div>
        </div>
      </section>
    </>
  );
}

export default Editor;

