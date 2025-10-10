import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../style.css"
import ResultBlogs from "./ResultBlogs";
import ResultUsers from "./ResultUsers";
import Navigation from "../Navigation";


function SearchResult() {
  const [searchParams] = useSearchParams(); 
  const [activeIdx, setActiveIdx] = useState(0);   

    let components = [ResultBlogs, ResultUsers];
    const ActiveComponent = components[activeIdx]; 
    const query = searchParams.get("query");

    return ( 
        <>
        <div className="container">
            <div className="d-md-none">
                <div className="nav border-bottom pt-3 routes">
                    <Navigation routes={[`Results for "${query}"`, <span><i className="fa-regular fa-user me-1"></i>Users</span>]} activeIdx={activeIdx} setActiveIdx={setActiveIdx} />
                </div>
                <ActiveComponent query={query}/>
            </div>
            <div className="d-none d-md-flex">
                <div style={{width: "60%"}} className="border-end pe-md-3 pe-lg-4">
                    <div className="mt-3 pb-2 border-bottom">{`Results for "${query}"`}</div>
                    <ResultBlogs query={query}/>
                </div>
                <div style={{width: "40%"}} className="ps-md-3 ps-lg-4"> 
                    <div className="mt-3 pb-2 border-bottom"><i className="fa-regular fa-user me-1"></i>Users</div>
                    <ResultUsers query={query}/>
                </div>
            </div>
        </div>
        </>
  );
}

export default SearchResult;