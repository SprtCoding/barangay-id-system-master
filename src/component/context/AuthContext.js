import React, { useContext, useEffect, useState } from "react"
import { createContext } from "react"
import { 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged } 
    from 'firebase/auth'
import { auth } from '../../firebase'

const UserContext = createContext()

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState({})

    const loginUser = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logout = () => {
        return signOut(auth)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            console.log(currentUser)
        })
        return () => {
            unsubscribe()
        }
    },[])

    return (
        <UserContext.Provider value={{loginUser, user, logout}}>
            {children}
        </UserContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(UserContext)
}