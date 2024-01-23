import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import { updateStart,updateSuccess,updateFailure ,deleteUserStart,deleteUserSuccess,deleteUserFailure,signOutSuccess } from "../redux/user/userSlice.js";
import 'react-circular-progressbar/dist/styles.css';
import {HiOutlineExclamationCircle} from 'react-icons/hi';
import {Link} from 'react-router-dom';
export default function DashProfile() {
  const {currentUser, error , loading} = useSelector(state => state.user)
  const[imageFile,setImageFile] = useState(null);
  const [imageFileUrl,setImageFileUrl] = useState(null);
  const[imageFileUploadProgress,setImageFileUploadProgress] = useState(null);
  const[imageFileUploadError,setImageFileUploadError] = useState(null);
  const[imageFileUploading,setImageFileUploading] = useState(false);
  const[updateUserSuccess,setUpdateUserSuccess] = useState(null);
  const[updateUserError,setUpdateUserError] = useState(null);
  const[formData,setFormData] = useState({});
  const[showModal,setShowModal] = useState(null);
  const filePickerRef = useRef();
  const dispatch = useDispatch();
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
    setImageFileUploading(true);
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
            setImageFileUploading(false);
        },()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{
                setImageFileUrl(downloadUrl);
                setFormData({...formData,profilePicture:downloadUrl});
                setImageFileUploading(false);
            })
        }
    )
  }
    const handleChange = (e) =>{
        setFormData({...formData, [e.target.id]: e.target.value})
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setUpdateUserSuccess(null);
        setUpdateUserError(null);
        if(Object.keys(formData).length === 0){
            setUpdateUserError('No Changes Made');
            return;
        }
        if(imageFileUploading){
            setUpdateUserError('Please wait for the changes to be made');
            return;
        }
        try {
            dispatch(updateStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`,{
                method: 'PUT',
                headers:{
                'Content-Type':'application/json'},
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if(!res.ok){
                dispatch(updateFailure(data.message));
                setUpdateUserError(data.message);
            } else{
                dispatch(updateSuccess(data));
                setUpdateUserSuccess("User Profile Updated Succesfully");
            }
        } catch (error) {
            dispatch(updateFailure(error.message));
            setUpdateUserError(error.message);
        }
    }
    const handleDeleteUser = async ()=>{
        setShowModal(false);
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`,{
                method: 'DELETE',
            });
            const data = await res.json();
            if(!res.ok){
                dispatch(deleteUserFailure(data.message));
            }
            else{
                dispatch(deleteUserSuccess(data));
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    }
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
    <div className="max-w-lg mx-auto p-3 w-full">
        <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            
            <TextInput type="text" id="username" placeholder="username" defaultValue={currentUser.username} onChange={handleChange}/>
            <TextInput type="email" id="email" placeholder="company@.com" defaultValue={currentUser.email} onChange={handleChange}/>
            <TextInput type="password" id="password" placeholder="********"  onChange={handleChange}/>
            <Button type="submit" gradientDuoTone='purpleToBlue' outline disabled={ loading || imageFileUploading}>{loading ? 'Loading..': 'Update'}</Button>
            {currentUser.isAdmin && (
            <Link to= {'/create-post'}>
            <Button 
            type="button"
            gradientDuoTone='purpleToPink'
            className="w-full">
                Create a post
            </Button>
            </Link>)}
        </form>
        <div className="text-red-600 flex justify-between mt-5 ">
            <span onClick={()=> setShowModal(true)} className="cursor-pointer" >Delete Account</span>
            <span onClick={handleSignOut} className="cursor-pointer" >SignOut</span>
        </div>
        {updateUserSuccess && 
        (<Alert color='success' className="mt-5">
            {updateUserSuccess}
        </Alert>)}
        {updateUserError && 
        (<Alert color='failure' className="mt-5">
            {updateUserError}
        </Alert>)}
        {error && 
        (<Alert color='failure' className="mt-5">
            {error}
        </Alert>)}
        <Modal show={showModal} onClose={()=> setShowModal(false)} popup size='md' >
            <Modal.Header/>
                <Modal.Body>
                    <div className="text-center ">
                        <HiOutlineExclamationCircle className=" h-14 w-14 text-red-700 dark:text-gray-200 mb-4 mx-auto"/>
                        <h3 className="mb-5 text-lg text-red-700 dark:text-red-700">Are you sure you want to delete your account?</h3>
                    </div>
                    <div className="flex justify-center gap-10">
                        <Button color="failure" onClick={handleDeleteUser}>Yes, I am sure!</Button>
                        <Button color="gray" onClick={()=> setShowModal(false)}>No , cancel</Button>
                    </div>
                </Modal.Body>
        </Modal>
    </div>
  )
}
