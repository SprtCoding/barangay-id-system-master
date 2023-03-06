import React, { useContext, useEffect, useState } from "react"
import { createContext } from "react"
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
}
    from 'firebase/auth'
import { auth } from '../../firebase'
import { getDatabase, ref, set, update } from "firebase/database"
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

    function updateUserDataSign(Id, UserImageSignUrl, setPrinted) {
        const db = getDatabase();
        update(ref(db, 'barangayResidentID/' + Id), {
            SigniturePhoto: UserImageSignUrl,
            isPrinted: setPrinted
        })
    }

    function writeUserData(Id, Fname, Mname, Sname, suffix, cStatus, dob, RegNo, PreNo, validationUntil, nationality, pAddress, idType, UserImageUrl, UserImageSignUrl, setPrinted) {
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
            IDType: idType,
            Photo: UserImageUrl,
            SigniturePhoto: UserImageSignUrl,
            isPrinted: setPrinted
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
        <UserContext.Provider value={{ loginUser, user, logout, writeUserData, updateUserDataSign }}>
            {children}
        </UserContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(UserContext)
}