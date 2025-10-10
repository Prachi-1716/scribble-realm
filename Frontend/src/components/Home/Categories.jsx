// import "./style.css"; 

// const trendingCategories = [
//   "Technology",
//   "Artificial Intelligence",
//   "Startups", 
//   // "Finance",
//   // "Health & Fitness",
//   "Travel",
//   "Education",
//   "Motivation", 
//   "Science",
//   "Self-Improvement", 
//   // "Productivity",   
//   // "Lifestyle", 
//   // "Design & UI/UX",
//   "Web Development", 
// ];

// let addBorder = (e)=>{ 
//   document.querySelectorAll(".category").forEach(btn => btn.classList.remove("activeCategory"));
//   e.target.classList.add("activeCategory");
// };

// function Categories({setMode}) { 
//     return ( 
//     <div className="mt-3">
//       <h1 className="fs-6 mt-3">What’s Your Vibe?</h1>
//         {
//             trendingCategories.map((category, idx)=>{
//                 return <button key={idx} className="category" onClick={(e)=>{addBorder(e); setMode(e.target.innerText);}}>{category}</button>
//             })
//         }
//     </div>
//   );
// }

// export default Categories;

import { useState } from "react";
import "./style.css"; 

const trendingCategories = [
  "Technology",
  "Artificial Intelligence",
  "Startups", 
  "Travel",
  "Education",
  "Motivation", 
  "Science",
  "Self-Improvement", 
  "Web Development", 
];

function Categories({ setMode }) {
  const [activeCategory, setActiveCategory] = useState("");

  const handleClick = (category) => {
    setActiveCategory(category);
    setMode(category);
  };

  return (
    <div className="mt-3">
      <h1 className="fs-6 mt-3">What’s Your Vibe?</h1>
      {trendingCategories.map((category, idx) => (
        <button
          key={idx}
          className={`category ${activeCategory === category ? "activeCategory" : ""}`}
          onClick={() => handleClick(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default Categories;
