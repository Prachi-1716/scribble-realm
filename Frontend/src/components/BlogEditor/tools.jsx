// tools to import 
import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";

let uploadByUrl = (e)=>{
    let link = new Promise((resolve, reject)=>{
        try {resolve(e);}
        catch(err){
            reject(err);
        }
    });
    return link.then(url=>{
        return {success: 1, file: {url}};
    })
}
let uploadByFile = (File)=>{
    return new Promise((resolve, reject)=>{ 
        try {
            let url = URL.createObjectURL(File);
            resolve({
                success: 1,
                file: {
                    orgFile: File,
                    url: url,
                }
            }); 
        }
        catch(err){
            reject(err);
        }
    });
    
}
let tools = {
    embed : Embed,
    list : {
       class: List,
       inlineToolbar: true,
    },
    image : {
        class: Image,
        config: {
            uploader: {
                uploadByUrl: uploadByUrl,
                uploadByFile: uploadByFile,
            }
        }
    },
    header:{
        class: Header,
        config: {
            placeholder: "Type Heading...",
            levels: [2, 3],
            defaultLevel: 2,
        }
    },
    quote: {
        class: Quote,
        inlineToolbar: true,
    },
    marker: Marker,
    inlineCode: InlineCode
}
export default tools;