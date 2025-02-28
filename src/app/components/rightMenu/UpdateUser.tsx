'use client'
import { User } from "@clerk/nextjs/server"
import Image from "next/image"
import { useState } from "react"

const UpdateUser = ({ user }: { user: any }) => {

  const [open, setOpen] = useState(false)
  const handleClose = () => {
    setOpen(false)
  }
  return (
    <>
      <div className="">
        <span className="text-blue-500 text-xs cursor-pointer" onClick={() => setOpen(true)}></span>
        {open && (<div
          className="absolute w-screen h-screen top-0 left-0 bg-black bg-opacity-65 flex items-center justify-center z-50">
          <form action=''
            className="relative p-12 bg-white rounded-lg shadow-md flex-col gap-2 w-full md:w-1/2 xl:w-1/3">TEST
            <h1>Update Profile</h1>
            <div className="mt-4 text-xs text-gray-500">
              Use the navbar profile to change the avatar or username
            </div>
            <div className="flex flex-col gap-4 my-4">
              <label>Cover Picture</label>
              <div className="flex items-center gap-2 cursor-pointer">
                <Image src={user.cover || '/noCover.png'} alt="" width={48} height={32} className="w-12 h-8 rounded-md object-cover"></Image>
                <span className="text-xs underline text-gray-600">Change</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-between gap-2 xl:gap-4">
              <div className="flex flex-col gap-4">
                <label htmlFor="" className="text-xs text-gray-500">First Name</label>
                <input type="text" className="border border-gray-300 rounded-md p-2 text-sm ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  placeholder={user.name || 'No Name'} />
              </div>
              <div className="flex flex-col gap-4">
                <label htmlFor="" className="text-xs text-gray-500">Surename</label>
                <input type="text" className="border border-gray-300 rounded-md p-2 text-sm ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  placeholder={user.surname || 'No surname'} />
              </div>
              <div className="flex flex-col gap-4">
                <label htmlFor="" className="text-xs text-gray-500">Description</label>
                <input type="text" className="border border-gray-300 rounded-md p-2 text-sm ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  placeholder={user.description || 'No description'} />
              </div>
              <div className="flex flex-col gap-4">
                <label htmlFor="" className="text-xs text-gray-500">City</label>
                <input type="text" className="border border-gray-300 rounded-md p-2 text-sm ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  placeholder={user.ctiy || 'No City'} />
              </div>
              <div className="flex flex-col gap-4">
                <label htmlFor="" className="text-xs text-gray-500">School</label>
                <input type="text" className="border border-gray-300 rounded-md p-2 text-sm ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  placeholder={user.school || 'No School'} />
              </div>
              <div className="flex flex-col gap-4">
                <label htmlFor="" className="text-xs text-gray-500">Work</label>
                <input type="text" className="border border-gray-300 rounded-md p-2 text-sm ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  placeholder={user.work || 'No Work'} />
              </div>
              <div className="flex flex-col gap-4">
                <label htmlFor="" className="text-xs text-gray-500">Website</label>
                <input type="text" className="border border-gray-300 rounded-md p-2 text-sm ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  placeholder={user.website || 'No Website'} />
              </div>
            </div>
            <div className='bg-blue-500 p-2 mt-2 rounded-md text-white'>Update</div>
            <div className='absolute text-xl right-2 top-3 cursor-pointer' onClick={handleClose}>X</div>
          </form>
        </div>)}
      </div>
    </>
  )
}

export default UpdateUser
