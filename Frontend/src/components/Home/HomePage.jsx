import { Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navigation from "./Navigation";
import LatestBlogs from "./LatestBlogs";
import Categories from "./Categories";
import TrendingBlogCards from "./TrendingBlogCards";

function HomePage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [mode, setMode] = useState("latest");

  let components = [LatestBlogs, TrendingBlogCards];
  const ActiveComponent = components[activeIdx];

  return (
    <>
      <div className="container">
        <div className="d-md-none">
          <div className="nav border-bottom pt-3 routes">
            <Navigation
              routes={["Latest", "Trending Blogs"]}
              activeIdx={activeIdx}
              setActiveIdx={setActiveIdx}
            />
          </div>
          <ActiveComponent key={activeIdx} mode={mode} setMode={setMode} />
        </div>
        <div className="d-none d-md-flex">
          <div style={{ width: "60%" }} className="border-end pe-md-3 pe-lg-4">
            <LatestBlogs mode={mode} setMode={setMode} />
          </div>
          <div style={{ width: "40%" }} className="ps-md-3 ps-lg-4">
            <Categories setMode={setMode} />
            <TrendingBlogCards />
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
