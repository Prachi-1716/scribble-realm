import BlogPostCard from "./BlogPostCard";
import { useEffect, useState } from "react"; 
import { getTrendingBlogs } from "./GetBlogs";

function TrendingBlogs() {
    let [blogs, setBlogs] = useState([]);
    useEffect(()=>{
        getTrendingBlogs(setBlogs);
    })
    
    return ( 
        <>
            <div className="container mt-3">
                <Toaster/>
                {
                    blogs.map((blog)=>{
                        return <BlogPostCard blog={blog} key={blog._idx}/>
                    })
                }
            </div>
        </>
     );
}

export default TrendingBlogs;