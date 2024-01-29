import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {useSelector} from 'react-redux';
export default function DashComments() {
  const {currentUser} = useSelector((state)=>state.user);
  const[comments,setComments] = useState([]);
  const[showMore,setShowMore] = useState(true);
  const[showModal,setShowModal] = useState(false);
  const[commentToDelete,setCommentToDelete] = useState('');
  useEffect(()=>{
    const fetchComments = async()=>{
      try {
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();
        if(res.ok){
          setComments(data.comments);
          if(data.comments.length < 9){
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if(currentUser.isAdmin){
      fetchComments();
    }
  },[currentUser._id]);

  const handleShowMore = async () =>{
    const startIndex = comments.length;
    try {
      const res = await fetch(`/api/comments/getcomments?startIndex=${startIndex}`);
      const data = await res.json();
      if(res.ok){
        setComments((prev)=>[...prev,...data.comments]);
        if(data.comments.length < 9){
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentToDelete}`,{
        method: 'DELETE',
      });
      const data = await res.json();
      if(!res.ok)
      {
        console.log(data.message);
      }
      else{
        setComments((prev) => 
          prev.filter((comment) => comment._id !== commentToDelete))
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100
    scrollbar-thumb-slate-400  dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 ">
    {currentUser.isAdmin && comments.length > 0 ? (
      <>
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Date Updated</Table.HeadCell>
            <Table.HeadCell>Comment Content</Table.HeadCell>
            <Table.HeadCell>Number of likes</Table.HeadCell>
            <Table.HeadCell>Post Id</Table.HeadCell>
            <Table.HeadCell>User Id</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
          </Table.Head>
          {comments.map((comment)=> (
            <Table.Body className="divide-y " key={comment._id}>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-900 ">
                <Table.Cell>
                {new Date(comment.updatedAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                    {comment.content}
                </Table.Cell>
                <Table.Cell>
                    {comment.numberOfLikes}
                </Table.Cell>
                <Table.Cell>{comment.postId}</Table.Cell>
                <Table.Cell>{comment.userId}</Table.Cell>
                <Table.Cell><span onClick={()=> {
                  setShowModal(true);
                  setCommentToDelete(comment._id);
                }} className="font-medium text-red-500 cursor-pointer hover:underline">Delete</span> </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
        {showMore && (
          <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">Show More</button>
        )}
      </>
    ): (
       <p> You have no comments yet!</p>
    )}
    <Modal show={showModal} onClose={()=> setShowModal(false)} popup size='md' >
            <Modal.Header/>
                <Modal.Body>
                    <div className="text-center ">
                        <HiOutlineExclamationCircle className=" h-14 w-14 text-red-700 dark:text-gray-200 mb-4 mx-auto"/>
                        <h3 className="mb-5 text-lg text-red-700 dark:text-red-700">Are you sure you want to delete this comment?</h3>
                    </div>
                    <div className="flex justify-center gap-10">
                        <Button color="failure" onClick={handleDeleteComment}>Yes, I am sure!</Button>
                        <Button color="gray" onClick={()=> setShowModal(false)}>No , cancel</Button>
                    </div>
                </Modal.Body>
        </Modal>
    </div>
  )
}
