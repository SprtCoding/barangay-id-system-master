import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { faList } from '@fortawesome/free-solid-svg-icons'
import { faSignOut } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import Home from '../component/main/Dashboard'
import ListOfIds from '../component/main/ListOfIds'
import { UserAuth } from '../component/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import blgulogo from '../assets/blgulogo.png'
import kapLogo from '../assets/logokap.png'

const SideNavBar = ({ open }) => {
  const { logout } = UserAuth()
  const navigate = useNavigate()
  const MySwal = withReactContent(Swal)

  const handleLogout = async (e) => {
    try {
      await logout()
      navigate('/login')
      MySwal.fire({
        title: <p>Logout</p>,
        text: 'Logout successful',
        icon: 'success',
      });
    } catch (e) {
      MySwal.fire({
        title: <p>Error!</p>,
        text: e.message,
        icon: 'error',
      });
    }
  }
  return (
    <>
      <aside className={`${open ? "w-60" : "w-20"} flex flex-col sticky top-0 h-screen p-3 shadow pt-8 h-screen duration-300 bg-green-500 relative drop-shadow-2xl`}>
        <div className='space-y-3'>
          <div className='flex gap-x-1 items-center'>
            <img src={blgulogo} className='logo' alt='' />
            <h1 className={`${!open && "scale-0"} text-white origin-left font-bold text-xl duration-300 title1`}>
              Barangay ID's
            </h1>
            <hr />
          </div>
          <ul className='pt-12'>
            <li className='flex items-center gap-x-4 cursor-pointer px-4 pl-3 pt-4 pb-4 hover:bg-green-400 rounded-md text-sm text-white '>
              <Link to={'/'} component={Home}>
                <FontAwesomeIcon icon={faHome} size="lg" inverse className={` mr-4`} />
                <span className={`${!open && 'hidden'} origin-left duration-200 font-medium`}>
                  Home
                </span>
              </Link>
            </li>
            <li className='flex items-center gap-x-4 cursor-pointer px-4 pl-3 pt-4 pb-4 hover:bg-green-400 rounded-md text-sm text-white '>
              <Link to={'/list'} component={ListOfIds}>
                <FontAwesomeIcon icon={faList} size="lg" inverse className={` mr-4`} />
                <span className={`${!open && 'hidden'} origin-left duration-200 font-medium`}>
                  List of Receive ID's
                </span>
              </Link>
            </li>
            <li className='flex items-center gap-x-4 cursor-pointer px-4 pl-3 pt-4 pb-4 hover:bg-green-400 rounded-md text-sm text-white ' onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOut} size="lg" inverse />
              <span className={`${!open && 'hidden'} origin-left duration-200 font-medium`}>
                Logout
              </span>
            </li>
          </ul>
          <div className='static'>
            <div className="absolute bottom-0 right-0 p-4">
              <div className='flex flex-col h-full gap-x-1 items-end'>
                <img src={kapLogo} className='logo' alt='' />
                <h1 className={`${!open && "scale-0"} text-gray-500 origin-left font-bold text-sm duration-300 title1`}>
                  Barangay ID's
                </h1>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default SideNavBar
