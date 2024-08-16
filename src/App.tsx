import NavBar from "./components/navbar";
import PageFrame from "./components/PageFrame";
import { BrowserRouter, Routes,Route} from "react-router-dom";
import AddPage from "./page/AddPage";
import PostPage from "./page/PostPage";
import UserPage from "./page/UserPage";
import Following from "./page/Following";
import Followers from "./page/Followers";
import ProfilePage from "./page/ProfilePage";
import NotificationPage from "./page/NotificationPage";
import FavoritePage from "./page/FavoritePage";

const App = () => {
  return <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route path="/" element={<PageFrame heading="Add a post" Page={AddPage}/>}/>
        <Route path="/post" element={<PageFrame heading="Post" Page={PostPage}/>}/>
        <Route path="/users" element={<PageFrame heading="Users" Page={UserPage}/>}/>
        <Route path="/following" element={<PageFrame heading="Following" Page={Following}/>}/>
        <Route path="/followers" element={<PageFrame heading="Followers" Page={Followers}/>}/>
        <Route path="/profile" element={<PageFrame heading="User Profile" Page={ProfilePage}/>}/>
        <Route path="/notifications" element={<PageFrame heading="Notifications" Page={NotificationPage}/>}/>
        <Route path="/favourite" element={<PageFrame heading="Favourite Posts" Page={FavoritePage}/>}/>
      </Routes>
      <div className="text-center mb-8">&copy; Smart Chain. Powered by Spark Media.</div>
  </BrowserRouter>
};

export default App;
