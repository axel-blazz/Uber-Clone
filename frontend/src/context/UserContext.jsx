import React, { createContext, useState } from 'react'

export const userDataContext = createContext()

const UserContext = ({children}) => {
    
    const [user, setuser] = useState({
        fullname: {
            firstname: "",
            lastname: ""
        },
        email: "",
    });


  return (
    <div>
        <userDataContext.Provider value={[user, setuser]}>
            {children}
        </userDataContext.Provider>
    </div>
  )
}

export default UserContext