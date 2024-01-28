import { Button } from "flowbite-react";


export default function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
        <div className="flex-1 justify-center flex flex-col">
            <h2>Want to learn more about MERN stack development?</h2>
            <p className="text-gray-500 my-2">Checkout these resources with MERN content</p>
            <Button className="rounded-tl-xl rounded-bl-none" gradientDuoTone='purpleToPink'><a href="" target="_blank" rel="noopener noreferrer">MERN resources</a></Button>
        </div>
        <div className="flex-1 p-7">
            <img src="https://miro.medium.com/v2/resize:fit:678/0*kxPYwfJmkXZ3iCWy.png" alt="MERN"/>
        </div>
    </div>
  )
}
