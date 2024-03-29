import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import DashSidebar from '../components/DashSidebar.jsx'
import DashProfile from '../components/DashProfile.jsx'
import DashPost from "../components/DashPost.jsx";
import DashUsers from "../components/DashUsers.jsx";
import DashComments from "../components/DashComments.jsx";
import DashBoardComp from "../components/DashBoardComp.jsx";
export default function Dashboard() {
  const location = useLocation();
  const[tab,setTab] = useState('')
  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
   if(tabFromUrl){
    setTab(tabFromUrl)
   }
  },[location.search])
  return <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
          <DashSidebar/>
      </div>
       {tab === 'profile' && <DashProfile/>}
       {tab === 'posts' && <DashPost/>}
       {tab === 'users' && <DashUsers/>}
       {tab === 'comments' && <DashComments/>}
       {tab === 'dash' && <DashBoardComp/>}

    </div>
}
