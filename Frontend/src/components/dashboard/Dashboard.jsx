import { useState } from "react";
import Sidebar from "./Sidebar";
import "./style.css";
import { Outlet } from "react-router-dom";
import { useEffect } from "react"; 

function Dashboard() {
    let [showSideBar, setShowSideBar] = useState(false);
    const [activeItem, setActiveItem] = useState("Blogs");

    useEffect(()=>{
      setShowSideBar(false);
      setActiveItem("Blogs");
    }, []);
  return (
    <div className="container-fluid"  >
      <div className="mt-3">
        <span className="me-3 d-md-none">
          <i className="fa-solid fa-bars" onClick={()=>(setShowSideBar(prev=>!prev))}></i>
        </span>
        <span>Dashboard</span>
        <span className="d-md-none ms-3">{activeItem}</span>
      </div>

      <div className="d-flex flex-column flex-md-row">
          <div className="d-md-none mt-2">
            {showSideBar && <Sidebar setShowSideBar ={setShowSideBar} setActiveItem={setActiveItem}/>}
          </div>
          <div className="d-none d-md-flex mt-2"> 
            <Sidebar setShowSideBar={setShowSideBar} setActiveItem={setActiveItem} /> 
          </div>
          <div className="flex-grow-1 p-3">
          {/* Nested route content appears here */}
          <Outlet />
        </div>
      </div>
       
    </div>
  );
}

export default Dashboard;
