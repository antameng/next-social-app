import prisma from '@/lib/client';
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
export default function AddPost() {
  const { userId } = auth()
  const testAction = async (formData: FormData) => {
    "use server"

    const desc = formData.get('desc') as string
    if (!userId) return
    try {
      const res = await prisma.post.create({
        data: {
          userId,
          desc
        }
      })
      console.log(res, 7777777);

    } catch (error) {
      console.log(error);

    }
  }
  return (
    <>
      <div className="p-4 bg-white rounded-lg shadow-md flex gap-4 justify-between">
        {/* AVATAR */}
        <Image width={48} height={48} src='https://images.pexels.com/photos/25652364/pexels-photo-25652364.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load' alt='' className="w-12 h-12 object-cover rounded-full"></Image>
        {/* Post */}
        <div className="flex-1">
          {/* Text input */}
          <form action={testAction} className="flex gap-4">
            <textarea name='desc' placeholder='what is you mind?' className='bg-slate-100 p-2 rounded-lg flex-1'></textarea>
            <Image width={20} height={20} src='/emoji.png' alt='' className="w-5 h-5 cursor-pointer self-end"></Image>
            <button>Send</button>
          </form>
          {/* Post options */}
          <div className="flex items-center gap-4 mt-4 text-gray-400 flex-wrap">
            <div className='flex items-center  gap-2 cursor-pointer'>
              <Image
                width={20}
                height={20}
                src='/addimage.png'
                alt=''
              >
              </Image>
              Photo
            </div>

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
      </div>
    </>
  )
}
