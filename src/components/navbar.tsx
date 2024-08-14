import { FaBell } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { TiHeartFullOutline } from "react-icons/ti";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <>
      <div className="bg-blue-950 p-4 border-b border-gray-700">
        <div className="container mx-auto flex gap-3 items-center">
          <a href="/" className="text-3xl font-bold text-white">
            SmartChain
          </a>

          <div className="flex mx-auto gap-3 text-slate-200 font-semibold max-md:hidden">
            <Link to='/'>Add Post</Link>
            <Link to='/post'>Posts</Link>
            <Link to='/users'>Users</Link>
            <Link to='/following'>Following</Link>
            <Link to='/followers'>Followers</Link>
          </div>

          <div className="flex gap-3 ml-auto text-slate-200 items-center">
            <Link to='/favourite'><TiHeartFullOutline /></Link>
            <Link to='/notifications'><FaBell /></Link>
            <Link to='/profile'><FaUserCircle size={30} /></Link>
          </div>
        </div>
      </div>
      <div className="bg-blue-950 h-[60vh]" />
    </>
  );
};

export default NavBar;
