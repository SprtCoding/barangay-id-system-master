import React, { useState } from 'react'
import SideNavBar from "../../navbar/SideNavBar"
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import LogoutIcon from '@mui/icons-material/Logout'

function ListOfIds() {

  const { logout } = UserAuth()
  const navigate = useNavigate()

  const [open, setOpen] = useState(true)
  const handleNavbar = () => {
    setOpen(!open)
  }

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
    <div className='flex'>
      <SideNavBar open={open} />
      <main className='py-4 px-12 flex-1 overflow-auto'>
        <div className='grid grid-cols-1 gap-2 mb-6 lg:grid-cols-1'>
          <AppBar position="static" color='transparent'>
            <Toolbar>
              <IconButton
                onClick={handleNavbar}
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                List of IDs
              </Typography>
              <IconButton onClick={handleLogout} color="primary" aria-label="logout" component="label">
                <LogoutIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </div>
      </main>
    </div>
  )
}

export default ListOfIds
