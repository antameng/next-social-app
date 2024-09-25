import Link from "next/link";
import Image from "next/image";
import { User } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/client";
import UserInfoCardInteraction from "./UserInfoCardInteraction";
import UpdateUser from "./UpdateUser";
export default async function UserInfoCard({ user }: { user: any }) {
  const createAtDate = new Date(user.createAt)
  const formattedDate = createAtDate.toLocaleDateString('en-Us', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  let isUserBlocked = false
  let isFollowing = false
  let isFollowingSent = false

  const { userId: currentUserId } = auth()
  if (currentUserId) {
    const blockRes = await prisma.block.findFirst({
      where: {
        blockedId: currentUserId,
        blockerId: user.id
      }
    })
    blockRes ? (isUserBlocked = true) : (isUserBlocked = false)

    const followRes = await prisma.follower.findFirst({
      where: {
        followerId: currentUserId,
        followingId: user.id
      }
    })
    followRes ? (isFollowing = true) : (isFollowing = false)

    const followReqRes = await prisma.followRequest.findFirst({
      where: {
        senderId: currentUserId,
        receiverId: user.id
      }
    })
    followReqRes ? (isFollowingSent = true) : (isFollowingSent = false)
  }
  return <>
    <div className="">
      <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
        {/* Top */}
        <div className="flex items-center justify-between font-medium">
          <span className="text-gray-500">User Information</span>
          {currentUserId === user.id ? (<UpdateUser user={user}></UpdateUser>) : (<Link href='/' className="text-blue-500 text-sm">See all</Link>)}
        </div>
        {/* Bottom */}
        <div className="flex flex-col gap-4 text-gray-500">
          <div className="flex items-center gap-2">
            <span className="text-xl text-black">{(user.name && user.surname) ? user.name + ' ' + user.surname : user.username}</span>
            <span className="text-sm">@{user.username}</span>
          </div>
          {user.description && <p className="">
            {user.description}
          </p>}
          {user.city && <div className="flex items-center gap-2">
            <Image width={16} height={16} src='/map.png' alt=''></Image>
            <span>Living in <b>{user.city}</b></span>
          </div>}
          {user.school && <div className="flex items-center gap-2">
            <Image width={16} height={16} src='/school.png' alt=''></Image>
            <span>Went to <b>{user.school}</b></span>
          </div>}
          {user.work && <div className="flex items-center gap-2">
            <Image width={16} height={16} src='/work.png' alt=''></Image>
            <span>Works at <b>{user.work}</b></span>
          </div>}

          <div className="flex items-center justify-between">
            {user.website && <div className="flex gap-1 items-center">
              <Image width={16} height={16} src='/link.png' alt=''></Image>
              <Link href={user.website} className="text-blue-500 font-medium">
                {user.website}
              </Link>
            </div>}

            <div className="flex gap-1 items-center">
              <Image src='/date.png' alt="" width={16} height={16}></Image>
              <span>Joined {formattedDate}</span>
            </div>
          </div>

          {(currentUserId && currentUserId !== user.id) && < UserInfoCardInteraction
            userId={user.id}
            isUserBlocked={isUserBlocked}
            isFollowing={isFollowing}
            isFollowingSent={isFollowingSent}
          >
          </UserInfoCardInteraction>}
        </div>
      </div>
    </div >

  </>
}
