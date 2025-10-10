import aero from "../../../imgs/right-arrow.png";
import { Link } from "react-router-dom";

let icons = [<i className="fa-brands fa-youtube"></i>, <i className="fa-brands fa-instagram"></i>, <i className="fa-brands fa-square-facebook"></i>, <i className="fa-brands fa-twitter"></i>, <i className="fa-brands fa-github"></i>, <i className="fa-solid fa-earth-asia"></i>];
function AboutInfo({userInfo}) {
    return ( 
        <>
            <div className="about mt-4 d-flex flex-column align-items-center">
                        {userInfo?.personal_info?.bio && <div>{userInfo.personal_info.bio}</div>}

                        <span className="socialLinks mt-3">{
                            Object.keys(userInfo.social_links).map((key, index) => {
                            if (!userInfo.social_links[key]) return null; // skip empty links
                            return (
                                <Link key={index} to={userInfo.social_links[key]} className="mx-2">
                                {icons[index]}
                                </Link>
                            );
                            })
                        }</span>

                        <span className="joinedAt mt-3">
                            Joined <img src={aero} style={{height: "10px"}} /> {new Date(userInfo.joinedAt).toLocaleDateString(undefined, {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </span>
                </div>
        </>
     );
}

export default AboutInfo;