'use client'
import { useRouter } from 'next/router'
import React from 'react'
import { appConfig } from '../../constants'

const Login = () => {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [authType, setAuthType] = React.useState<'login' | 'register'>('login')

  const router = useRouter()
  const handleSignup = () => {
    setAuthType(authType === 'login' ? 'register' : 'login')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage('')
    if (!username || !password) {
      setMessage('Please fill out all fields')
      return
    }
    try {
      const res = await fetch(`${appConfig.BASE_URL}/auth/${authType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      })
      if (res.ok) {
        if (authType === 'login') {
          return router.push('/')
        } else {
          const data = await res.json()
          setMessage(data.message)
        }
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (error) {
      setMessage(error.message)
    }
  }
  return (
    <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
      <h2 className='py-2 text-red-700'>{message}</h2>
      <div className='w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700'>
        <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
          <h1 className='border-b text-white px-4 py-2 text-2xl font-medium text-center'>
            {authType === 'login' ? 'Please Login' : 'Please Signup'}
          </h1>
          <form className='space-y-4 md:space-y-6' onSubmit={handleSubmit}>
            <div>
              <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Username
              </label>
              <input
                type='username'
                name='username'
                id='username'
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                placeholder='name@company.com'
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Password
              </label>
              <input
                type='password'
                name='password'
                id='password'
                placeholder='••••••••'
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button
              type='submit'
              className='w-full text-white bg-slate-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
            >
              {authType === 'login' ? 'Login' : 'Signup'}
            </button>
            <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
              {authType === 'login'
                ? ` Don’t have an account yet?`
                : ' Already have an account?'}
              <a
                onClick={handleSignup}
                href='#'
                className='font-medium text-primary-600 hover:underline dark:text-primary-500'
              >
                {authType === 'login' ? ' Signup' : ' Login'}
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
