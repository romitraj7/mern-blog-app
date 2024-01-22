import { Alert, Button, TextInput } from "flowbite-react"
import { useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
export default function DashProfile() {
  const {currentUser} = useSelector(state => state.user)
  const[imageFile,setImageFile] = useState(null);
  const [imageFileUrl,setImageFileUrl] = useState(null);
  const[imageFileUploadProgress,setImageFileUploadProgress] = useState(null);
  const[imageFileUploadError,setImageFileUploadError] = useState(null);
  const filePickerRef = useRef();
  const handleProfileChange = (e) =>{
    const file = e.target.files[0];
    if(file){
        setImageFile(file)
        setImageFileUrl(URL.createObjectURL(file));
    }
  }
  useEffect(()=>{
    if(imageFile){
        uploadImage();
    }
  },[imageFile])
  const uploadImage = async () =>{
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime()+imageFile.name;
    const storageRef = ref(storage,fileName);
    const uploadTask =uploadBytesResumable(storageRef,imageFile);
    uploadTask.on(
        'state_changed',
        (snapshot)=>{
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) *100;
            setImageFileUploadProgress(progress.toFixed(0))
        },(error)=>{
            setImageFileUploadError('Could Not Upload Image(File Must be less than 2Mb)');
            setImageFileUploadProgress(null);
            setImageFile(null);
            setImageFileUrl(null);
        },()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{
                setImageFileUrl(downloadUrl)
            })
        }
    )
  }
    return (
    <div className="max-w-lg mx-auto p-3 w-full">
        <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
        <form className="flex flex-col gap-4">
            <input type="file" accept="image/*" onChange={handleProfileChange} ref={filePickerRef} hidden/>
            <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full " onClick={()=> filePickerRef.current.click()}>
            {imageFileUploadProgress && (
                <CircularProgressbar value={imageFileUploadProgress || 0} text={`
                ${imageFileUploadProgress}%`}
                strokeWidth={5}
                styles={{
                    root:{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                    },
                    path: {
                        stroke: `rgba(62,152,199,${imageFileUploadProgress / 100})`,
                    },
                }}
                />
            )}
            <img src={imageFileUrl || currentUser.profilePicture} alt="user" className={`rounded-full w-full h-full object-cover border-8 border-[lightgray]
            ${imageFileUploadProgress && imageFileUploadProgress <100 && 'opacity-60'}`}/>
            </div>
            {imageFileUploadError && <Alert color='failure'>
                {imageFileUploadError}
            </Alert>}
            
            <TextInput type="text" id="username" placeholder="username" defaultValue={currentUser.username}/>
            <TextInput type="email" id="email" placeholder="company@.com" defaultValue={currentUser.email}/>
            <TextInput type="password" id="password" placeholder="********" />
            <Button type="submit" gradientDuoTone='purpleToBlue' outline>Update</Button>
        </form>
        <div className="text-red-600 flex justify-between mt-5 ">
            <span className="cursor-pointer" >Delete Account</span>
            <span className="cursor-pointer" >SignOut</span>
        </div>
    </div>
  )
}
