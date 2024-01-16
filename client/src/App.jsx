import {React} from 'react'
import { BrowserRouter, Routes , Route } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import About from './pages/About'
import SignIn from './pages/SignIn'
import Projects from './pages/Projects'
import Dashboard from './pages/Dashboard'
import Header from './components/header'

export default function App() {
  return (
   <BrowserRouter>
    <Header />
    <Routes>
      <Route path='/' element = {<Home></Home>} />
      <Route path='/sign-up' element={<SignUp/>}/>
      <Route path = '/about' element={<About/>}/>
      <Route path = '/sign-in' element={<SignIn/>}/>
      <Route path = '/projects' element={<Projects/>}/>
      <Route path = '/dashboard' element={<Dashboard/>}/>

    </Routes>
   </BrowserRouter>
  )
}
