import { useState, useContext, createContext } from "react";
import banner from "../../imgs/blogbanner.png";

const blogStructure = {
    title: "",
    banner: banner,
    content: {},
    tags: [],
    description: "",
    author: {
        personal_info: {}
    }
}

const BlogEditorContext  = createContext({});
const useblogEditorContext = ()=>useContext(BlogEditorContext);

function BlogEditorContextProvider({children}) {
    let [blog, setBlog] = useState(blogStructure);
    let [editorState, setEditorState] = useState("editor");
    let [textEditor, setTextEditor] = useState({isReady: false});
    let [isDraft, setIsDraft] = useState(false);

    return ( 
        <>
            <BlogEditorContext.Provider value={{blog, setBlog, editorState, setEditorState, textEditor, setTextEditor,isDraft, setIsDraft}}>
                {children}
            </BlogEditorContext.Provider>
        </>
    );
}

export {BlogEditorContextProvider, useblogEditorContext};