import React, {createContext, useContext, useState, useEffect} from "react";
import axios from "axios";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

let UserContext = createContext();
let useUser = ()=>useContext(UserContext);

let UserProvider = ({children }) =>{
    let [user, setUser] = useState(null);
    let [newNotificationsCount, setNewNotificationsCount] = useState([]);
    useEffect(() => {
        setUser(null);
        setNewNotificationsCount([]);
        axios.get(`${SERVER_URL}/api/auth/me`, { withCredentials: true }).then(res=>{ 
            Object.keys(res.data).length === 0  ? setUser(null) :setUser(res.data);
        })
        .catch(() => setUser(null));           
}, []);

    return (
        <UserContext.Provider value={{user, setUser, newNotificationsCount, setNewNotificationsCount}}>
            {children }
        </UserContext.Provider>
    )
}

export {useUser, UserProvider};