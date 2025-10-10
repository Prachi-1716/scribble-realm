import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import {signInWithGooglePopup} from "../../common/firebase";
import { useNavigate } from "react-router-dom";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const handleGoogleAuth = async (e, setUser, navigate) => {
    e.preventDefault();
  try{
    const u = await signInWithGooglePopup();
    const idToken = await u.getIdToken();
    let res = await axios.post(`${SERVER_URL}/api/auth/google`, {idToken}, { withCredentials: true });
    setUser(res.data);
    toast.success("Signed In successfully"); 
    navigate("/");
  }catch(err){
    let msg = err.response?.data?.message || err.message;
      toast.error(msg);
  }
};

export {handleGoogleAuth};