"use client"
import { useUser } from '@clerk/nextjs';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { useState } from 'react';
import Ad from './Ad';
import AddPostButton from './AddPostButton';
import { addPost } from '@/lib/actions';
export default function AddPost() {
  const { user, isLoaded } = useUser()
  const [desc, setDesc] = useState();
  const [img, setImg] = useState<any>();
  if (!isLoaded) {
    return null;
  }



  return (
    <>
      <div className="p-4 bg-white rounded-lg shadow-md flex gap-4 justify-between">
        {/* AVATAR */}
        <Image width={48} height={48} src={user?.imageUrl || '/noAvator.png'} alt='' className="w-12 h-12 object-cover rounded-full"></Image>
        {/* Post */}
        <div className="flex-1">
          {/* Text input */}
          <form action={(formData) => addPost(formData, img?.secure_url || '')} className="flex gap-4">
            <textarea onChange={(e: any) => setDesc(e.target.value)} name='desc' placeholder='what is you mind?' className='bg-slate-100 p-2 rounded-lg flex-1'></textarea>
            <div>
              <Image
                width={20}
                height={20} src='/emoji.png' alt=''
                className="w-5 h-5 cursor-pointer self-end"></Image>
              <AddPostButton></AddPostButton>
            </div>
          </form>
          {/* Post options */}
          <div className="flex items-center gap-4 mt-4 text-gray-400 flex-wrap">

            <CldUploadWidget uploadPreset="social"
              onSuccess={(results, { widget }) => { setImg(results.info); widget.close() }}>
              {({ open }) => {
                return (
                  <div className='flex items-center  gap-2 cursor-pointer' onClick={() => open()}>
                    <Image
                      width={20}
                      height={20}
                      src='/addimage.png'
                      alt=''
                    >
                    </Image>
                    Photo
                  </div>
                );
              }}
            </CldUploadWidget>



            <div className='flex items-center  gap-2 cursor-pointer'>
              <Image
                width={20}
                height={20}
                src='/addVideo.png'
                alt=''
              >
              </Image>
              Video
            </div>

            <div className='flex items-center  gap-2 cursor-pointer'>
              <Image
                width={20}
                height={20}
                src='/poll.png'
                alt=''
              >
              </Image>
              Poll
            </div>

            <div className='flex items-center  gap-2 cursor-pointer'>
              <Image
                width={20}
                height={20}
                src='/addevent.png'
                alt=''
              >
              </Image>
              Event
            </div>
          </div>
        </div>
      </div >
    </>
  )
}
