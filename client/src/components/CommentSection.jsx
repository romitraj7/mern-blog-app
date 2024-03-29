import { Alert, Button, Modal, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import {useSelector} from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {HiOutlineExclamationCircle} from 'react-icons/hi';
import Comment from './Comment';
export default function CommentSection({postId}) {
    const {currentUser} = useSelector((state)=>state.user);
    const[comment,setComment] = useState('');
    const[commentError,setCommentError] = useState(null);
    const[showComments,setShowComments] = useState([]);
    const[showModal,setShowModal] = useState(false);
    const[commentToDelete,setCommentToDelete] = useState(null);
    const navigate = useNavigate();
    const handleSubmit = async (e) =>{
        e.preventDefault();
        if(comment.length>200){
            return;
        }
        try {
            const res = await fetch(`/api/comment/create`,{
                method: 'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({content: comment,postId,userId: currentUser._id}),
            });
             const data = await res.json();
            if(res.ok){
                setComment('');
                setCommentError(null);
                setShowComments([data,...showComments]);
            }       
        } 
        catch (error) {
            setCommentError(error.message);
        }
    }
    useEffect(()=>{
        const getComments = async () =>{
            try {
                const res = await fetch(`/api/comment/getPostComments/${postId}`);
                if(res.ok){
                    const data = await res.json();
                    setShowComments(data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        getComments();
    },[postId]);
    const handleLike = async (commentId) =>{
        try {
            if(!currentUser){
                navigate('/sign-in');
                return;
            }
            const res = await fetch(`/api/comment/likeComment/${commentId}`,{
                method: 'PUT',
            });
            if(res.ok){
                const data = await res.json();
                setShowComments((prevComments) =>
                prevComments.map((comment) =>
                    comment._id === commentId
                        ? {
                              ...comment,
                              likes: data.likes,
                              numberOfLikes: data.likes.length,
                          }
                        : comment
                )
            );
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleEdit = async (comment,editedContent) =>{
        setShowComments(
            showComments.map((c)=>
            c._id === comment._id?{...c , content: editedContent}: c)
        )
    }
    const handleDelete = async (commentId) => {
        setShowModal(false);
        try {
            if(!currentUser){
                navigate('/sign-in');
                return;
            }
            const res = await fetch(`/api/comment/deleteComment/${commentId}`,{
                method: 'DELETE',
            });
            if(res.ok){
                const data =await res.json();
                setShowComments(
                    showComments.filter((comment)=> comment._id !== commentId)
                );
            }
            } catch (error) {
            console.log(error);
        }
    }
  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
    {currentUser ? (
        <div className='flex items-center gap-1 my-5 text-sm'>
            <p>Signed in as: </p>
            <img className='h-10 w-10 object-cover rounded-full' src={currentUser.profilePicture}/>
            <Link className='text-blue-500 hover:underline' to={`/dashboard?tab=profile`}>@{currentUser.username}</Link>
        </div>
    ):
    (
        <div className='flex gap-1 my-5'>
            You must be signed in to comment.
            <Link className='text-blue-500 hover:underline' to={`/sign-in`}>Sign In</Link>
        </div>
    )}
    {currentUser && (
        <form onSubmit={handleSubmit} className='border border-teal-500 rounded-md p-3'>
            <Textarea placeholder='Add a comment...'
                rows='3'
                maxLength='200'
                onChange={(e)=> setComment(e.target.value)}
                value={comment}
            />
            <div className='flex justify-between items-center mt-5'>
                <p className='text-gray-500 text-sm'>{200 - comment.length} characters remaining</p>
                <Button color='blue' outline type='submit'>Submit</Button>
            </div>
            {commentError && (
            <Alert color='failure'>
                {commentError};
            </Alert>)}
            
        </form>
    )}
    {showComments.length === 0 ? (
        <p className='my-5'>No Comments Yet!</p>
    ):(
        <>
        <div className='text-sm flex items-center gap-1 my-5'>
            <p>Comments:</p>
            <div className='border border-gray-400 py-1 px-2 rounded-sm'>
                <p>{showComments.length}</p>
            </div>
        </div>
        {showComments.map(comment => (
            <Comment 
            key={comment._id}
            comment= {comment}
            onLike = {handleLike}
            onEdit = {handleEdit}
            onDelete = {(commentId)=>{
                setShowModal(true)
                setCommentToDelete(commentId)
            }}
            />
            ))
        }
        </>
    )}
    <Modal show={showModal} onClose={()=> setShowModal(false)} popup size='md' >
            <Modal.Header/>
                <Modal.Body>
                    <div className="text-center ">
                        <HiOutlineExclamationCircle className=" h-14 w-14 text-red-700 dark:text-gray-200 mb-4 mx-auto"/>
                        <h3 className="mb-5 text-lg text-red-700 dark:text-red-700">Are you sure you want to delete your comment?</h3>
                    </div>
                    <div className="flex justify-center gap-10">
                        <Button color="failure" onClick={()=>handleDelete(commentToDelete)}>Yes, I am sure!</Button>
                        <Button color="gray" onClick={()=> setShowModal(false)}>No , cancel</Button>
                    </div>
                </Modal.Body>
        </Modal>
    </div>
  )
}
