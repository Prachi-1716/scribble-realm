import Navbar from "./components/Navbar"; 
import {Routes, Route} from "react-router-dom";
import SignUp from "./components/authentication/SignUp";
import SignIn from "./components/authentication/SignIn";
import EditorPage from "./components/BlogEditor/EditorPage";
import { BlogEditorContextProvider } from "./components/BlogEditor/BlogEditorContext";
import HomePage from "./components/Home/HomePage";
import SearchResult from "./components/Home/SearchResults/SearchResult";
import NotFound from "./components/PageNoteFound";
import UserProfile from "./components/Home/SearchResults/UserProfile";
import BlogInDetail from "./components/Blog/BlogInDetail"; 
import Dashboard from "./components/dashboard/Dashboard";
import Notification from "./components/dashboard/Notification";
import Blogs from "./components/dashboard/Blog";
import ChangePassword from "./components/dashboard/ChangePassword";
import EditProfile from "./components/dashboard/EditProfile";
const App = () => {
    return (<>
        <Routes>
            <Route path="/editor" element={<BlogEditorContextProvider><EditorPage/></BlogEditorContextProvider>} />   
            <Route path="/editor/:id" element={<BlogEditorContextProvider><EditorPage/></BlogEditorContextProvider>} /> 

            <Route path="/" element={<Navbar/>}>
                <Route path='/' element={<HomePage/>} />
                <Route path='/Search' element={<SearchResult/>} />
                <Route path='/auth/register' element={<SignUp/>} />
                <Route path='/auth/login' element={<SignIn/>} />
                <Route path='/users/:id' element={<UserProfile/>} />
                <Route path='/blogs/:id' element={< BlogInDetail />} />
                <Route path="/dashboard" element={<Dashboard />}>
                    <Route path="" element={<Blogs/>} />
                    <Route path="blogs" element={<Blogs/>} />
                    <Route path="notifications" element={<Notification/>} />
                    <Route path="profile/edit" element={<EditProfile/>} />
                    <Route path="password/change" element={<ChangePassword/>} />
                </Route>
                <Route path='/*' element={<NotFound/>} />
            </Route>
        </Routes>
    </>)
}

export default App;