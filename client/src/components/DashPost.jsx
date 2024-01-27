import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {useSelector} from 'react-redux';
import { Link } from "react-router-dom";
export default function DashPost() {
  const {currentUser} = useSelector((state)=>state.user);
  const[userPosts,setUserPosts] = useState([]);
  const[showMore,setShowMore] = useState(true);
  const[showModal,setShowModal] = useState(false);
  const[postIdToDelete,setPostIdToDelete] = useState('');
  console.log(userPosts);
  useEffect(()=>{
    const fetchPosts = async()=>{
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if(res.ok){
          setUserPosts(data.posts);
          if(data.posts.length < 9){
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if(currentUser.isAdmin){
      fetchPosts();
    }
  },[currentUser._id]);

  const handleShowMore = async () =>{
    const startIndex = userPosts.length;
    try {
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();
      if(res.ok){
        setUserPosts((prev)=>[...prev,...data.posts]);
        if(data.posts.length < 9){
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,{
        method: 'DELETE',
      });
      const data = await res.json();
      if(!res.ok)
      {
        console.log(data.message);
      }
      else{
        setUserPosts((prev) => 
          prev.filter((post) => post._id !== postIdToDelete))
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100
    scrollbar-thumb-slate-400  dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 ">
    {currentUser.isAdmin && userPosts.length > 0 ? (
      <>
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Date Updated</Table.HeadCell>
            <Table.HeadCell>Post Image</Table.HeadCell>
            <Table.HeadCell>Post Title</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
            <Table.HeadCell>Edit</Table.HeadCell>
          </Table.Head>
          {userPosts.map((post)=> (
            <Table.Body className="divide-y " key={post._id}>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-900 ">
                <Table.Cell>
                {new Date(post.updatedAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <Link to = {`/post/${post.slug}`}>
                    <img src={post.image}
                      alt={post.title}
                      className="w-20 h-10 object-cover bg-gray-500"
                    />
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Link className="font-medium text-gray-900 dark:text-white" to={`/post/${post.slug}`}>
                    {post.title}
                  </Link>
                </Table.Cell>
                <Table.Cell>{post.category}</Table.Cell>
                <Table.Cell><span onClick={()=> {
                  setShowModal(true);
                  setPostIdToDelete(post._id);
                }} className="font-medium text-red-500 cursor-pointer hover:underline">Delete</span> </Table.Cell>
                <Table.Cell>
                  <Link className="text-teal-500 cursor-pointer hover:underline" to={`/update-post/${post._id}`}>
                    Edit
                  </Link>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
        {showMore && (
          <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">Show More</button>
        )}
      </>
    ): (
       <p> You have no posts yet!</p>
    )}
    <Modal show={showModal} onClose={()=> setShowModal(false)} popup size='md' >
            <Modal.Header/>
                <Modal.Body>
                    <div className="text-center ">
                        <HiOutlineExclamationCircle className=" h-14 w-14 text-red-700 dark:text-gray-200 mb-4 mx-auto"/>
                        <h3 className="mb-5 text-lg text-red-700 dark:text-red-700">Are you sure you want to delete your Post?</h3>
                    </div>
                    <div className="flex justify-center gap-10">
                        <Button color="failure" onClick={handleDeletePost}>Yes, I am sure!</Button>
                        <Button color="gray" onClick={()=> setShowModal(false)}>No , cancel</Button>
                    </div>
                </Modal.Body>
        </Modal>
    </div>
  )
}
