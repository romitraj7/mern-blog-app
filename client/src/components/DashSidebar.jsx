import { Sidebar } from 'flowbite-react';
import { HiArrowSmRight, HiUser } from 'react-icons/hi';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { signOutSuccess } from '../redux/user/userSlice.js';
export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  const dispatch = useDispatch();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  const handleSignOut = async ()=>{
    try {
        const res = await fetch('/api/user/signout',{
            method:'POST',
        });
        const data = await res.json();
        if(!res.ok){
            console.log(data.message);
        } 
        else{
            dispatch(signOutSuccess());
        }
    } catch (error) {
        console.log(error);
    }
}
  return (
   
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
            <Sidebar.Item href='/dashboard?tab=profile' active={tab === 'profile'} icon={HiUser} label={'User'} labelColor='dark'>
              Profile
            </Sidebar.Item>
          <Sidebar.Item onClick={handleSignOut} icon={HiArrowSmRight} className='cursor-pointer'>
             SignOut
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
