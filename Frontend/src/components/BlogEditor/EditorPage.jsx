import Editor from "./Editor";
import {useUser} from "../UserContext";
import {Navigate} from "react-router-dom";
import { useblogEditorContext } from "./BlogEditorContext";
import PublishForm from "./PublishForm";
import { useState } from "react";

function EditorPage() {
    let {editorState} = useblogEditorContext();
    let [blogId, setBlogId] = useState("");

    let {user} = useUser();
    if(user == null) return <Navigate to="/auth/login"/>;

    return ( 
        <>
            {editorState === "editor" ? <Editor setBlogId={setBlogId}/> : <PublishForm blogId={blogId}/>}
        </>
     );
}

export default EditorPage;