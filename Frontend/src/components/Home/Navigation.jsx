import { useState } from "react";
import "./style.css";

function Navigation({ routes,  activeIdx, setActiveIdx}) { 
  return (
    <>
      {routes.map((route, idx) => {
        // Base class
        let c = idx === activeIdx ? "me-5 active" : "me-5 inactive";

        // Add Bootstrap visibility classes
        //c += " " + (route == "Trending Blogs" ? "d-inline d-lg-none": ""); 

        return (
            <span className={c}  key={idx} onClick={() => setActiveIdx(idx)} style={{ cursor: "pointer" }} > {route} </span>  
        );
      })}
    </>
  );
}

export default Navigation;
