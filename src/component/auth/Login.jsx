import React, { useState } from 'react'
import blgulogo from '../../assets/blgulogo.png'
import blguImg1 from '../../assets/blgu.png'
import kapLogo from '../../assets/logokap.png'
import { useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const MySwal = withReactContent(Swal)

  const navigate = useNavigate()

  const { loginUser } = UserAuth()

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('')
    if (email === '' && password === '') {
      MySwal.fire({
        title: <p>Error!</p>,
        text: 'email and password is empty!',
        icon: 'error',
      });
    } else if (email === '') {
      MySwal.fire({
        title: <p>Error!</p>,
        text: 'email is empty!',
        icon: 'error',
      });
    } else if (password === '') {
      MySwal.fire({
        title: <p>Error!</p>,
        text: 'password is empty!',
        icon: 'error',
      });
    } else {
      try {
        await loginUser(email, password);
        navigate('/')
        MySwal.fire({
          title: <p>Login</p>,
          text: 'Login successful',
          icon: 'success',
        });
      } catch (e) {
        setError(e.message)
        MySwal.fire({
          title: <p>Error!</p>,
          text: error,
          icon: 'error',
        });
      }
    }
  }

  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-2 h-screen w-full'>
        <div className='hidden sm:block bg drop-shadow-2xl'>
          <div className='flex flex-col w-full h-full p-4'>
            <div className="relative h-40 w-full">
              <div className="absolute top-0 left-0 h-32 w-26">
                <div className='flex'>
                  <img className='w-32 object-contain' src={blgulogo} alt=''/>
                  <div className='flex flex-col'>
                    <h1 className='py-2 text-2xl font-bold text-white h-7 title'>Barangay Semirara</h1>
                    <h4 className='py-2 text-xl font-bold text-white title1'>Semirara island, Caluya, Antique</h4>
                  </div>
                </div>
              </div>
            </div>
            <img className='w-full h-full object-contain' src={blguImg1} alt=''/>
            <div className="relative h-32 w-full">
              <div className="absolute bottom-0 right-0 h-26 w-40">
                <img className='w-32 object-contain' src={kapLogo} alt=''/>
              </div>
            </div>
          </div>
        </div>
        <div className='grid w-full h-full place-items-center'>
          <div className='max-w-[500px] w-full mx-auto my-auto p-4'>
            <div className='card text-black-700 shadow-2xl p-8 px-8'>
              <h1 className='py-2 text-3xl font-bold title'>Barangay ID System</h1>
              <h2 className='py-2 text-2xl font-bold'>Log in to your account</h2>
              <form onSubmit={handleSignIn}>
                <label className="block mt-4">
                  <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-medium font-semibold text-slate-700 mb-4">Email</span>
                  <input className='peer border border-green-600 focus:border-green-500 focus:outline-none rounded p-3 w-full' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <p className="mt-2 invisible peer-invalid:visible text-pink-600 text-sm">
                    Please provide a valid email address.
                  </p>
                </label>
                <div className='flex flex-col pb-4'>
                  <label className='py-2 font-semibold'>Password</label>
                  <input className='border border-green-600 focus:border-green-500 focus:outline-none rounded p-3' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button className='border shadow-2xl rounded border-green-600 bg-green-600 hover:bg-green-500 hover:border-green-500 w-full p-3 my-2 text-white font-semibold text-base font-sans' type='submit'>Log in</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>

  )
}

export default Login
