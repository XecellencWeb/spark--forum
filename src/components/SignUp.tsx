import React, { useState } from "react";
import Select from "react-select";
import { role_data } from "../page/ProfilePage";
import { useAuth, UserContextType } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const { signUpUser }: Partial<UserContextType> = useAuth();
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={async (e) => {
        e.preventDefault();

        if (
          !signupData.email ||
          !signupData.password ||
          !signupData.username ||
          !signupData.role
        )
          return alert("Please fill all fields");
        await signUpUser?.(signupData);

        navigate("/");
      }}
    >
      <h2 className="text-3xl max-sm:text-2xl font-bold text-center mb-4">
        Create your free account
      </h2>
      <label htmlFor="username">
        <h3 className="font-semibold">Username</h3>
        <input
          onChange={(e) =>
            setSignupData((prev) => ({ ...prev, username: e.target.value }))
          }
          type="text"
          className="border-[1px] rounded-lg border-gray-700 w-full p-2 focus:border-blue-950 focus:border-2 outline-none"
        />
      </label>
      <label htmlFor="email">
        <h3 className="font-semibold">Email</h3>
        <input
          type="text"
          onChange={(e) =>
            setSignupData((prev) => ({ ...prev, email: e.target.value }))
          }
          className="border-[1px] rounded-lg border-gray-700 w-full p-2 focus:border-blue-950 focus:border-2 outline-none"
        />
      </label>
      <label htmlFor="password">
        <h3 className="font-semibold">Password</h3>
        <input
          onChange={(e) =>
            setSignupData((prev) => ({ ...prev, password: e.target.value }))
          }
          type="password"
          className="border-[1px] rounded-lg border-gray-700 w-full p-2 focus:border-blue-950 focus:border-2 outline-none"
        />
      </label>
      <label htmlFor="password">
        <h3 className="font-semibold">Career Role</h3>
        <Select
          onChange={(option: { value: string; label: string } | null, _) =>
            setSignupData((prev) => ({
              ...prev,
              role: option?.value as string,
            }))
          }
          options={role_data.map((a) => ({ label: a, value: a }))}
        />
      </label>
      <button className="bg-blue-950 w-full py-2 rounded-xl text-white font-bold hover:bg-blue-700">
        Sign Up
      </button>
    </form>
  );
};

export default SignUp;
