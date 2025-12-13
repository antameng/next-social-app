'use client'
import { User } from "@clerk/nextjs/server"
import Image from "next/image"
import {useActionState, useState} from "react"
import { updateProfile } from "@/lib/actions";
import { CldUploadWidget } from "next-cloudinary";

const UpdateUser = ({ user }: { user: any }) => {

  const [open, setOpen] = useState(true)
  const [cover, setCover] = useState<any>(false)
  const handleClose = () => {
    setOpen(false)
  }
  const [  state,formAction  ] = useActionState(updateProfile, {success:false,error:false})
  return (
    <>
      <div className="">
        <span className="text-blue-500 text-xs cursor-pointer" onClick={() => setOpen(true)}></span>
        {open && (<div
          className="absolute w-screen h-screen top-0 left-0 bg-black bg-opacity-65 flex items-center justify-center z-50">
          <form action={(formData) => updateProfile(formData, cover?.secure_url)}
            className="relative p-12 bg-white rounded-lg shadow-md flex-col gap-2 w-full md:w-1/2 xl:w-1/3">TEST
            <h1>Update Profile</h1>
            <div className="mt-4 text-xs text-gray-500">
              Use the navbar profile to change the avatar or username
            </div>
            <CldUploadWidget uploadPreset="social" onSuccess={(results) => setCover(results.info)}>
              {({ open }) => {
                return (
                  <div className="flex flex-col gap-4 my-4" onClick={() => open()}>
                    <label>Cover Picture</label>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <Image src={user.cover || '/noCover.png'} alt="" width={48} height={32} className="w-12 h-8 rounded-md object-cover"></Image>
                      <span className="text-xs underline text-gray-600">Change</span>
                    </div>
                  </div>
                );
              }}
            </CldUploadWidget>

            <div className="flex flex-wrap justify-between gap-2 xl:gap-4">
              <div className="flex flex-col gap-4">
                <label htmlFor="" className="text-xs text-gray-500">First Name</label>
                <input name='name' type="text" className="border border-gray-300 rounded-md p-2 text-sm ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  placeholder={user.name || 'No Name'} />
              </div>
              <div className="flex flex-col gap-4">
                <label htmlFor="" className="text-xs text-gray-500">Surename</label>
                <input name='surname' type="text" className="border border-gray-300 rounded-md p-2 text-sm ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  placeholder={user.surname || 'No surname'} />
              </div>
              <div className="flex flex-col gap-4">
                <label htmlFor="" className="text-xs text-gray-500">Description</label>
                <input name='description' type="text" className="border border-gray-300 rounded-md p-2 text-sm ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  placeholder={user.description || 'No description'} />
              </div>
              <div className="flex flex-col gap-4">
                <label htmlFor="" className="text-xs text-gray-500">City</label>
                <input name='city' type="text" className="border border-gray-300 rounded-md p-2 text-sm ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  placeholder={user.ctiy || 'No City'} />
              </div>
              <div className="flex flex-col gap-4">
                <label htmlFor="" className="text-xs text-gray-500">School</label>
                <input name='school' type="text" className="border border-gray-300 rounded-md p-2 text-sm ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  placeholder={user.school || 'No School'} />
              </div>
              <div className="flex flex-col gap-4">
                <label htmlFor="" className="text-xs text-gray-500">Work</label>
                <input name='work' type="text" className="border border-gray-300 rounded-md p-2 text-sm ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  placeholder={user.work || 'No Work'} />
              </div>
              <div className="flex flex-col gap-4">
                <label htmlFor="" className="text-xs text-gray-500">Website</label>
                <input name='website' type="text" className="border border-gray-300 rounded-md p-2 text-sm ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  placeholder={user.website || 'No Website'} />
              </div>
            </div>
            <button className='bg-blue-500 p-2 mt-2 rounded-md text-white text-center w-full cursor-pointer'>Update</button>
            {state.success && <span className="text-green-500 ">Profile updated successfully!</span>}
            {state.error && <span className="text-red-500 ">Error updating profile. Please try again.</span>}
            <div className='absolute text-xl right-2 top-3 cursor-pointer' onClick={handleClose}>X</div>
          </form>
        </div>)}
      </div>
    </>
  )
}

export default UpdateUser
