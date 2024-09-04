'use client'
import { useState } from "react";
import { BiUser, BiUserCheck, BiUserPlus } from "react-icons/bi";
import { BsPostcard } from "react-icons/bs";
import { FaBell } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { PiPlus } from "react-icons/pi";
import { TiHeartFullOutline } from "react-icons/ti";
import { Link, useSearchParams } from "react-router-dom";
import Popup from "./Popup";
import { useAuth, UserContextType } from "../context/authContext";
//import Select from "react-select";
import SignUp from "./SignUp";
import LogIn from "./LogIn";


const NavBar = () => {
  const [navbarClosed, setNavbarClosed] = useState(false);

  const [params,setSearchParams] = useSearchParams()

  

  const { currentUser }: Partial<UserContextType> = useAuth();

  return (
    <>
      <Popup open={params.get('auth') === 'true'}>
        {params.get('signup') === 'true'?
          <SignUp/>
        :<LogIn/>}

      </Popup>
      <div className="bg-blue-950 p-4 border-b border-gray-700">
        <div className="container mx-auto flex gap-3 items-center">
          <Link to="/" className="text-3xl font-bold text-white">
            SmartChain
          </Link>

          <div
            className={`flex mx-auto gap-5 text-slate-200 font-semibold max-lg:fixed left-0 max-lg:inset-y-0 max-lg:text-gray-500 max-lg:bg-white max-lg:p-10 z-10 max-lg:flex-col max-lg:shadow-lg icon-links ${
              navbarClosed && "max-lg:-translate-x-full max-lg:opacity-0"
            } transition-all ${!currentUser && "max-lg:pt-24"}`}
          >
            {currentUser && (
              <>
                <div className="flex gap-3 text-blue-950 items-center mr-auto lg:hidden">
                  <Link to="/favourite">
                    <TiHeartFullOutline />
                  </Link>
                  <Link to="/notifications">
                    <FaBell />
                  </Link>
                </div>
                <hr className="mb-8" />
                <div className="lg:hidden">
                  <Link to="/profile">
                    <FaUserCircle /> Profile
                  </Link>
                </div>
              </>
            )}

            <Link to="/">
              <PiPlus /> Add Post
            </Link>
            <Link to="/post">
              <BsPostcard /> Posts
            </Link>
            <Link to="/users">
              <BiUser /> Users
            </Link>
            <Link to="/following">
              <BiUserPlus /> Following
            </Link>
            <Link to="/followers">
              <BiUserCheck /> Followers
            </Link>

            <div className="lg:hidden mt-auto text-3xl font-bold text-blue-700">
              <Link to="/">SmartChain</Link>
            </div>
          </div>

          <div className="flex gap-3 ml-auto text-slate-200 items-center">
            {currentUser ? (
              <>
                <Link to="/favourite">
                  <TiHeartFullOutline />
                </Link>
                <Link to="/notifications">
                  <FaBell />
                </Link>
                <div className="max-lg:hidden">
                  <Link to="/profile">
                    <FaUserCircle size={30} />
                  </Link>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setSearchParams({
                      'auth':'true',
                      'signup':'false'
                    });
                  }}
                  className="px-3 py-1 bg-white rounded-full text-blue-950 border-white border-2 hover:bg-transparent hover:text-white max-sm:text-[.5rem] font-bold"
                >
                  Log in
                </button>

                <button
                  onClick={() => {
                    setSearchParams({
                      'auth':'true',
                      'signup':'true'
                    });
                  }}
                  className="px-3 py-1 border-2 border-white rounded-full hover:bg-white hover:text-blue-950 max-sm:text-[.5rem] font-bold"
                >
                  Sign up
                </button>
              </>
            )}

            <div
              className={`lg:hidden ${
                !navbarClosed && "ring-4 p-1 scale-120 rounded-full"
              } w-fit flex items-center`}
            >
              <button onClick={() => setNavbarClosed((prev) => !prev)}>
                <FaUserCircle size={30} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-blue-950 h-[60vh] bg-pattern" />
    </>
  );
};

export default NavBar;
