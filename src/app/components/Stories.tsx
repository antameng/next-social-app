import Image from 'next/image';
import prisma from "@/lib/client";
import { auth } from '@clerk/nextjs/server';
export default async function Stories() {
  const { userId: currentUserId } = await auth()
  if (!currentUserId) {
    return null;
  }
  const stories = await prisma.story.findMany(
    {
      where: {
        // 条件1: 只查询未过期的故事
        expiresAt: {
          gt: new Date() // expiresAt（过期时间）大于当前时间
        },
        // 条件2: 满足以下任一条件（OR）
        OR: [
          // 当前的 OR 数组只包含一个条件，这是不太常见的。通常 OR 用于多个条件的情况。
          {
            // 查询当前用户关注的人发布的故事
            user: {
              followers: {
                some: {
                  followerId: currentUserId // 关注者ID是当前用户
                }
              }
            }
          },
          {
            // 用户自己发布的故事
            userId: currentUserId
          }
        ]
      },
      include: {
        user: true // 包含发布故事的用户信息
      },
      orderBy: {
        createdAt: "desc" // 按创建时间降序排列
      }

    }
  )

  return (
    <>
      <div>


        <div className="p-4 bg-white rounded-lg shadow-md overflow-scroll text-xs scrollbar-hide">
          <div className="flex gap-8 w-max">
            <div className="flex flex-col items-center gap-2 cursor-pointer">
              <Image src="https://images.pexels.com/photos/28375938/pexels-photo-28375938.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" alt="" width={80} height={80} className="w-20 h-20 rounded-full right-2" />
              <span className='font-medium'>kangkang</span>
            </div>
            <div className="flex flex-col items-center gap-2 cursor-pointer">
              <Image src="https://images.pexels.com/photos/28375938/pexels-photo-28375938.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" alt="" width={80} height={80} className="w-20 h-20 rounded-full right-2" />
              <span className='font-medium'>kangkang</span>
            </div>
            <div className="flex flex-col items-center gap-2 cursor-pointer">
              <Image src="https://images.pexels.com/photos/28375938/pexels-photo-28375938.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" alt="" width={80} height={80} className="w-20 h-20 rounded-full right-2" />
              <span className='font-medium'>kangkang</span>
            </div>
            <div className="flex flex-col items-center gap-2 cursor-pointer">
              <Image src="https://images.pexels.com/photos/28375938/pexels-photo-28375938.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" alt="" width={80} height={80} className="w-20 h-20 rounded-full right-2" />
              <span className='font-medium'>kangkang</span>
            </div>
            <div className="flex flex-col items-center gap-2 cursor-pointer">
              <Image src="https://images.pexels.com/photos/28375938/pexels-photo-28375938.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" alt="" width={80} height={80} className="w-20 h-20 rounded-full right-2" />
              <span className='font-medium'>kangkang</span>
            </div>
            <div className="flex flex-col items-center gap-2 cursor-pointer">
              <Image src="https://images.pexels.com/photos/28375938/pexels-photo-28375938.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" alt="" width={80} height={80} className="w-20 h-20 rounded-full right-2" />
              <span className='font-medium'>kangkang</span>
            </div>
            <div className="flex flex-col items-center gap-2 cursor-pointer">
              <Image src="https://images.pexels.com/photos/28375938/pexels-photo-28375938.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" alt="" width={80} height={80} className="w-20 h-20 rounded-full right-2" />
              <span className='font-medium'>kangkang</span>
            </div>
            <div className="flex flex-col items-center gap-2 cursor-pointer">
              <Image src="https://images.pexels.com/photos/28375938/pexels-photo-28375938.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" alt="" width={80} height={80} className="w-20 h-20 rounded-full right-2" />
              <span className='font-medium'>kangkang</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
