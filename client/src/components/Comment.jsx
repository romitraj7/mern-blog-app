import { useEffect, useState } from "react"
import moment from 'moment';
export default function Comment({comment}) {
    const[user,setUser] = useState({});
    console.log(user)
    useEffect(()=>{
        const getUser = async ()=>{
            const res = await fetch(`/api/user/${comment.userId}`);
            const data =await res.json();
            if(res.ok){
                setUser(data);
            }

        }
        getUser();
    },[comment])
  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
        <div className="flex-shrink-0 mr-3">
            <img className="h-10 w-10 rounded-full bg-gray-200" src={user.profilePicture} alt={user.username}></img>
        </div>
        <div className="flex-1">
            <div className="flex items-center mb-1">
                <span className="font-bold mr-1 text-sm truncate ">{user ? `@${user.username}`: 'anonymous user'}</span>
                <span className="text-gray-500 text-xs">{moment(comment.createdAt).fromNow()}</span>
            </div>
            <p className="text-gray-500 pb-2">{comment.content}</p>
        </div>
    </div>
  )
}