
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React , { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function SignIn() {
  const[formData,setFormData] = useState({})
  const[errorMessage,setErrorMessage] = useState(null)
  const[loading,setLoading] = useState(false)
  const navigate = useNavigate();
  const handleChange =(e)=>{
   setFormData({...formData,[e.target.id]:e.target.value.trim()})
  }
  console.log(formData)
  const handleSubmit= async (e)=>{
    e.preventDefault();
    if(!formData.email || !formData.password){
      return setErrorMessage('Please fill out all the details')
    }
    try {
      setLoading(true);
      setErrorMessage(null);
     const res = await fetch('/api/auth/signin',{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(formData),
     });
     const data = await res.json();
     if (data.success === false){
      return setErrorMessage(data.message)
     }
    //  console.log(data)
     setLoading(false)
     if(res.ok){
      navigate('/')
     }
    } catch (error) {
      setErrorMessage(error.message)
      setLoading(false)
    }
    
  };
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
    <p className='text-sm mt-5'>This is a demo Project.You can login through your created account.</p>
      </div>
      {/* div for side */}
      <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your Email-Id'/>
              <TextInput
              type='email'
              placeholder='name@company.com'
              id='email' onChange={handleChange}/>
            </div>
            <div>
              <Label value='Your Password'/>
              <TextInput
              type='password'
              placeholder='Password'
              id='password' onChange={handleChange}/>
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
            {
              loading ? (<>
                <Spinner size = 'sm' />
                <span className='pl-3'>Loading...</span>
                </>
              ) : 'Sign In'
            }
            </Button>
          </form>
          <div className='flex gap-2 mt-4'>
          Don't Have an Account?
            <Link to={'/sign-up'} className='text-blue-700 '>
             Sign Up
            </Link>
          </div>
          {
            errorMessage && (
              <Alert className='mt-5' color= 'failure'>
                {errorMessage}
              </Alert>
            )
          }
      </div>
    </div>
    </div>
  )
}
