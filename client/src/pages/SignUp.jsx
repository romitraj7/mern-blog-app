import { Button, Label, TextInput } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'

export default function SignUp() {
  return (
    <div className='min-h-screen mt-20 '>
    <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
      {/* div for left side */}
      <div className='flex-1'>
      <Link to={'/'} className='text-4xl
    font-bold dark:text-white' >
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
        rounded-lg text-white'>Romit</span>Blog
    </Link>
    <p className='text-sm mt-5'>This is a demo Project.You can either create an account or login through your Google Acount.</p>
      </div>
      {/* div for side */}
      <div className='flex-1'>
          <form className='flex flex-col gap-4'>
            <div>
              <Label value='Your Username'/>
              <TextInput
              type='text'
              placeholder='Username'
              id='username' />
            </div>
            <div>
              <Label value='Your Email-Id'/>
              <TextInput
              type='text'
              placeholder='name@company.com'
              id='email' />
            </div>
            <div>
              <Label value='Your Password'/>
              <TextInput
              type='text'
              placeholder='Password'
              id='password' />
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit'>
            Sign Up
            </Button>
          </form>
          <div className='flex gap-2 mt-4'>
            Have an Account?
            <Link to={'/sign-in'} className='text-blue-700 '>
              Sign In
            </Link>
          </div>
      </div>
    </div>
    </div>
  )
}
