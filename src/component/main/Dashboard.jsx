import React, { useState, useRef, useCallback } from 'react'
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
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CameraIcon from '@mui/icons-material/Camera';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Webcam from 'react-webcam'
import { AutoGraph, Clear, Save } from '@mui/icons-material'
import SignaturePad from 'react-signature-canvas'

const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: 'user',
}

function Dashboard() {
  const { logout } = UserAuth()
  const navigate = useNavigate()

  const [fname, setFName] = useState('')
  const handleFName = (e) => {
    e.preventDefault()
    setFName(e.target.value)
  }
  const [mname, setMName] = useState('')
  const handleMName = (e) => {
    e.preventDefault()
    setMName(e.target.value)
  }
  const [sname, setSName] = useState('')
  const handleSName = (e) => {
    e.preventDefault()
    setSName(e.target.value)
  }
  const [suffix, setSuffix] = useState('')
  const handleSuffix = (e) => {
    e.preventDefault()
    setSuffix(e.target.value)
  }
  // eslint-disable-next-line no-self-compare, no-mixed-operators
  const [dob, setDOB] = useState(new Date(''))
  const [cStat, setCStatus] = useState('')
  const [nationality, setNationality] = useState('')
  const handleNationality = (e) => {
    e.preventDefault()
    setNationality(e.target.value)
  }
  const [regNo, setRegNo] = useState('')
  const handleRegNo = (e) => {
    e.preventDefault()
    setRegNo(e.target.value)
  }
  const [preNo, setPreNo] = useState('')
  const handlePreNo = (e) => {
    e.preventDefault()
    setPreNo(e.target.value)
  }
  const [validUntil, setValidition] = useState(new Date(''))
  const [address, setAddress] = useState('')
  const handleAddress = (e) => {
    e.preventDefault()
    setAddress(e.target.value)
  }
  const sigCanvas = useRef()
  const [sign, setSign] = useState('')
  const saveSign = () => {
    setSign(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"))
  }
  
  const clear = () => {
    sigCanvas.current.clear()
  }
  const [picture, setPicture] = useState('')

  const manageInputs = () => {
    if (fname === '' || fname === null) {
      MySwal.fire({
        title: <p>Error!</p>,
        text: 'First name is required.',
        icon: 'error',
      });
    }else if (mname === '' || mname === null) {
      MySwal.fire({
        title: <p>Error!</p>,
        text: 'Middle name is required.',
        icon: 'error',
      });
    }else if (sname === '' || sname === null) {
      MySwal.fire({
        title: <p>Error!</p>,
        text: 'Surname is required.',
        icon: 'error',
      });
    }else if (cStat === '' || cStat === null) {
      MySwal.fire({
        title: <p>Error!</p>,
        text: 'Civil status is required.',
        icon: 'error',
      });
    }else if (dob === '' || dob === null) {
      MySwal.fire({
        title: <p>Error!</p>,
        text: 'Date of birth is required.',
        icon: 'error',
      });
    }else if (regNo === '' || regNo === null) {
      MySwal.fire({
        title: <p>Error!</p>,
        text: 'Registration Number is required.',
        icon: 'error',
      });
    }else if (validUntil === '' || validUntil === null) {
      MySwal.fire({
        title: <p>Error!</p>,
        text: 'Validation of ID is required.',
        icon: 'error',
      });
    }else if (nationality === '' || nationality === null) {
      MySwal.fire({
        title: <p>Error!</p>,
        text: 'Nationality is required.',
        icon: 'error',
      });
    }else if (address === '' || address === null) {
      MySwal.fire({
        title: <p>Error!</p>,
        text: 'Permanent Address is required.',
        icon: 'error',
      });
    }else if (picture === null || picture === '') {
      MySwal.fire({
        title: <p>Error!</p>,
        text: 'Please capture a picture.',
        icon: 'error',
      });
    }else if (sign === null || sign === '') {
      MySwal.fire({
        title: <p>Error!</p>,
        text: 'Please sign before proceed.',
        icon: 'error',
      });
    } else {
      MySwal.fire({
        title: <p>Success!</p>,
        text: dob,
        icon: 'success',
      });
    }
  }

  const webcamRef = useRef(null)
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPicture(imageSrc);
  }, [webcamRef]);

  const [open1, setOpen1] = useState(false)

  const handleChange = (event) => {
    setCStatus(event.target.value);
  };

  const handleClose = () => {
    setOpen1(false);
  };

  const handleOpen = () => {
    setOpen1(true);
  };

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

  const [open, setOpen] = useState(true)
  const handleNavbar = () => {
    setOpen(!open)
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
                Home
              </Typography>
              <IconButton onClick={handleLogout} color="primary" aria-label="logout" component="label">
                <LogoutIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <div className='p-10'>
            <div className="mt-10 sm:mt-0 w-full">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <div className="px-4 sm:px-0">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">Generate ID Card</h1>
                    <h3 className="text-base font-semibold leading-6 text-gray-900">Personal Information</h3>
                    <p className="mt-1 text-sm text-gray-600">Use a permanent address where you can receive mail.</p>
                  </div>
                  <div className='flex flex-col justify-center my-4'>
                    <h5 className='text-base text-center font-semibold pb-2'>Camera</h5>
                    <div className='flex flex-col justify-center'>
                      {picture === null ? (
                        <>
                          <Webcam
                            className='rounded'
                            audio={false}
                            height={400}
                            ref={webcamRef}
                            width={400}
                            imageSmoothing={true}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                          />
                          <IconButton
                            onClick={(e) => {
                              e.preventDefault()
                              capture()
                            }}
                            color="gray"
                            aria-label="logout"
                            component="label">
                            <CameraIcon />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <img src={picture} className='rounded' alt='' />
                          <IconButton
                            onClick={(e) => {
                              e.preventDefault()
                              setPicture(null)
                            }}
                            color="gray"
                            aria-label="logout"
                            component="label">
                            <CameraAltIcon />
                          </IconButton>
                        </>
                      )}
                    </div>
                  </div>
                  <div className='flex flex-col justify-center my-4'>
                    <h5 className='text-base text-center font-semibold pb-2'>Draw Signature Here</h5>
                    <SignaturePad ref={sigCanvas}
                      canvasProps={{
                        className: 'card'
                      }} />
                    <div className='grid grid-cols-2'>
                      <IconButton
                        onClick={saveSign}
                        color="gray"
                        aria-label="logout"
                        component="label">
                        <Save />
                      </IconButton>
                      <IconButton
                        onClick={clear}
                        color="gray"
                        aria-label="logout"
                        component="label">
                        <Clear />
                      </IconButton>
                    </div>
                  </div>
                </div>
                <div className="mt-2 md:col-span-2 md:mt-0 w-full h-full">
                  <form>
                    <div className="overflow-hidden shadow sm:rounded-md w-full">
                      <div className="bg-white px-4 sm:p-6 h-full">
                        <div className="grid grid-cols-6 gap-6 h-full">
                          <div className='grid grid-cols-7 gap-2 col-span-6'>
                            <div className="col-span-7 sm:col-span-6 lg:col-span-2">
                              <label className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-gray-700">First Name</label>
                              <input type="text" className="mt-1 block w-full border-gray-300 shadow-sm focus:outline-none sm:text-sm py-2 border-b-2 border-gray-400" value={fname} onChange={handleFName} />
                            </div>

                            <div className="col-span-7 sm:col-span-3 lg:col-span-2">
                              <label className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-gray-700">Middle Name</label>
                              <input type="text" className="mt-1 block w-full border-gray-300 shadow-sm focus:outline-none sm:text-sm py-2 border-b-2 border-gray-400" value={mname} onChange={handleMName}  />
                            </div>

                            <div className="col-span-7 sm:col-span-3 lg:col-span-2">
                              <label className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-gray-700">Surname</label>
                              <input type="text" className="mt-1 block w-full border-gray-300 shadow-sm focus:outline-none sm:text-sm py-2 border-b-2 border-gray-400" value={sname} onChange={handleSName}  />
                            </div>

                            <div className="col-span-7 sm:col-span-3 lg:col-span-1">
                              <label className="block text-sm font-medium text-gray-700">Suffix</label>
                              <input type="text" className="mt-1 block w-full border-gray-300 shadow-sm focus:outline-none sm:text-sm py-2 border-b-2 border-gray-400" value={suffix} onChange={handleSuffix}  />
                            </div>
                          </div>

                          <div className="col-span-6 sm:col-span-3 lg:col-span-3">
                            <label className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-gray-700 pb-2">Civil Status</label>
                            <FormControl className="mt-1 block w-full border-gray-300 shadow-sm focus:outline-none sm:text-sm py-2 border-b-2 border-gray-400">
                              <Select
                                labelId="demo-controlled-open-select-label"
                                id="demo-controlled-open-select"
                                open={open1}
                                onClose={handleClose}
                                onOpen={handleOpen}
                                value={cStat}
                                onChange={handleChange}
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                <MenuItem value={'Single'}>Single</MenuItem>
                                <MenuItem value={'Married'}>Married</MenuItem>
                                <MenuItem value={'Widowed'}>Widowed</MenuItem>
                                <MenuItem value={'Divorced'}>Divorced</MenuItem>
                                <MenuItem value={'Separated'}>Separated</MenuItem>
                                <MenuItem value={'In certain cases'}>In certain cases</MenuItem>
                                <MenuItem value={'Registered partnership'}>Registered partnership</MenuItem>
                              </Select>
                            </FormControl>
                          </div>

                          <div className="col-span-6 sm:col-span-3 lg:col-span-3">
                            <label className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-gray-700 pb-2">Date of Birth</label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                value={dob}
                                onChange={(newValue) => {
                                  setDOB(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} className="mt-1 block w-full border-gray-300 shadow-sm focus:outline-none sm:text-sm py-2 border-b-2 border-gray-400" />}
                              />
                            </LocalizationProvider>
                          </div>

                          <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                            <label className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-gray-700 pb-4">Registration Number</label>
                            <input type="text" className="mt-1 block w-full border-gray-300 shadow-sm focus:outline-none sm:text-sm py-2 border-b-2 border-gray-400" value={regNo} onChange={handleRegNo}  />
                          </div>

                          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 pb-4">Precinct Number</label>
                            <input type="text" className="mt-1 block w-full border-gray-300 shadow-sm focus:outline-none sm:text-sm py-2 border-b-2 border-gray-400" value={preNo} onChange={handlePreNo}  />
                          </div>

                          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                            <label className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-gray-700 pb-2">Valid until</label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                value={validUntil}
                                onChange={(newValue) => {
                                  setValidition(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} className="mt-1 block w-full border-gray-300 shadow-sm focus:outline-none sm:text-sm py-2 border-b-2 border-gray-400" />}
                              />
                            </LocalizationProvider>
                          </div>

                          <div className="col-span-6">
                            <label className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-gray-700">Nationality</label>
                            <input type="text" className="mt-1 block w-full border-gray-300 shadow-sm focus:outline-none sm:text-sm py-2 border-b-2 border-gray-400" value={nationality} onChange={handleNationality}  />
                          </div>

                          <div className="col-span-6">
                            <label className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-gray-700">Permanent Address</label>
                            <input type="text" className="mt-1 block w-full border-gray-300 shadow-sm focus:outline-none sm:text-sm py-2 border-b-2 border-gray-400" value={address} onChange={handleAddress}  />
                          </div>

                          {/* <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                            <label className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-gray-700">City</label>
                            <input type="text" className="mt-1 block w-full border-gray-300 shadow-sm focus:outline-none sm:text-sm py-2 border-b-2 border-gray-400" />
                          </div>

                          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                            <label className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-gray-700">State / Province</label>
                            <input type="text" className="mt-1 block w-full border-gray-300 shadow-sm focus:outline-none sm:text-sm py-2 border-b-2 border-gray-400" />
                          </div>

                          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                            <label className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-gray-700">ZIP / Postal code</label>
                            <input type="text" className="mt-1 block w-full border-gray-300 shadow-sm focus:outline-none sm:text-sm py-2 border-b-2 border-gray-400" />
                          </div> */}
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                        <button onClick={manageInputs} type="button" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Save</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
