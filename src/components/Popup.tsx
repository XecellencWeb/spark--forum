import { ReactNode } from "react"


const Popup = ({children,open}:{children:ReactNode,open:boolean}) => {
  return (
   open && <div className="fixed z-50 inset-0 bg-black bg-opacity-80 backdrop-blur-xl grid place-content-center">
    <div className="bg-white rounded-3xl shadow-2xl p-8 mx-4">
        {children}
    </div>
   </div>

  )
}

export default Popup
