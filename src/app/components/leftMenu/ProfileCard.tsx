import prisma from "@/lib/client"
import { auth } from "@clerk/nextjs/server"
import Image from "next/image"
export default async function ProfileCard() {

  const { userId } = auth()
  if (!userId) return
  const user = await prisma.user.findUnique(
    {
      where: {
        id: userId
      },
      include: {
        _count: {
          select: {
            followers: true
          }
        }
      }
    }
  )
  console.log(user, 6666);
  if (!user) return null
  return (
    <>
      <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-6 mb-6">
        <div className="h-20 relative">
          <Image fill src={user.cover || '/noCover.png'} alt=""
            className="rounded-md object-cover" />
          <Image width={48} height={48} src={user.avatar || '/noAvatar.png'} alt=""
            className="rounded-full object-cover w-12 h-12 absolute left-0 right-0 m-auto -bottom-6 ring-1 ring-white z-10" />
        </div>
        <div className="h-20 flex flex-col gap-2 items-center">
          <span className="font-semibold">{(user.name && user.surname) ? user.name + ' ' + user.surname : user.username}</span>
          <div className="flex items-center gap-4">
            <div className="flex">
              <Image width={12} height={12} src='https://images.pexels.com/photos/27555562/pexels-photo-27555562.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load' alt=""
                className="rounded-full object-cover w-3 h-3" />
              <Image width={12} height={12} src='https://images.pexels.com/photos/27555562/pexels-photo-27555562.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load' alt=""
                className="rounded-full object-cover w-3 h-3" />
              <Image width={12} height={12} src='https://images.pexels.com/photos/27555562/pexels-photo-27555562.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load' alt=""
                className="rounded-full object-cover w-3 h-3" />
            </div>
            <span className="text-xs text-gray-500">{user._count.followers} Followers</span>
          </div>
          <button className="bg-blue-500 text-white text-xs p-2 rounded-md">My Profile</button>
        </div>
      </div>
    </>
  )
}
