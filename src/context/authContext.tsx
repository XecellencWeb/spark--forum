import { createContext, ReactNode, useContext, useState } from "react"


const UserContext = createContext({})

export type UserContextType = {
    currentUser:string,
    setCurrentUser: ()=>void
}

const AuthContext = ({children}:{children:ReactNode}) => {
   const [currentUser,setCurrentUser] = useState()

  return (
    <UserContext.Provider value={{currentUser,setCurrentUser}}>
        {children}
    </UserContext.Provider>
  )
}

export const useAuth = ()=>useContext(UserContext)

export default AuthContext
