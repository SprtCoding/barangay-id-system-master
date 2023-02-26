import React, { useContext, useEffect, useState } from "react"
import { createContext } from "react"
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
}
    from 'firebase/auth'
import { auth } from '../../firebase'
import { getDatabase, ref, set } from "firebase/database"
// import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'

const UserContext = createContext()

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({})

    const loginUser = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logout = () => {
        return signOut(auth)
    }

    function writeUserData(Id, Fname, Mname, Sname, suffix, cStatus, dob, RegNo, PreNo, validationUntil, nationality, pAddress, UserImageUrl, UserImageSignUrl) {
        const db = getDatabase();
        set(ref(db, 'barangayResidentID/' + Id), {
            ID: Id,
            FirstName: Fname,
            MiddleName: Mname,
            Surname: Sname,
            Suffix: suffix,
            CivilStatus: cStatus,
            DateOfBirth: dob,
            RegistrationNumber: RegNo,
            PrecinctNumber: PreNo,
            ValidUntil: validationUntil,
            Nationality: nationality,
            Address: pAddress,
            Photo: UserImageUrl,
            SigniturePhoto: UserImageSignUrl
        });
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            // console.log(currentUser)
        })
        return () => {
            unsubscribe()
        }
    }, [])

    return (
        <UserContext.Provider value={{ loginUser, user, logout, writeUserData }}>
            {children}
        </UserContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(UserContext)
}