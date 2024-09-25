import Link from "next/link";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/client";
import FriendRequestsList from "./FriendRequestList";
export default async function FriendRequests() {

  const { userId } = auth()
  if (!userId) {
    return null
  }

  const requests = await prisma.followRequest.findMany({
    where: {
      receiverId: userId
    },
    include: {
      sender: true
    }
  })

  if (requests.length === 0) return null
  return (
    <>
      <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
        {/* Top */}
        <div className="flex items-center justify-between font-medium">
          <span className="text-gray-500">Friend Requests</span>
          <Link href='/' className="text-blue-500 text-sm">See all</Link>
        </div>
        {/* User */}
        <FriendRequestsList requests={requests}></FriendRequestsList>
      </div>
    </>
  )
}
