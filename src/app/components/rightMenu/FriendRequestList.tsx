'use client'
import { FollowRequest, User } from "@prisma/client";
import Image from "next/image";

type RequestWithUser = FollowRequest & {
  sender: User
}

const FriendRequestsList = ({ requests }: { requests: RequestWithUser[] }) => {
  return <>
    <div className="">
      {requests.map((request) => (<div key={request.id} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image width={40} height={40} className="w-10 h-10 rounded-full object-cover" alt="" src="https://images.pexels.com/photos/14475824/pexels-photo-14475824.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"></Image>
          <span className="font-semibold">张伟</span>
        </div>
        <div className="flex gap-3 justify-end">
          <Image alt="" width={20} height={20} src='/accept.png' className="cursor-pointer"></Image>
          <Image alt="" width={20} height={20} src='/reject.png' className="cursor-pointer"></Image>
        </div>
      </div>))}


    </div>
  </>
}

export default FriendRequestsList
