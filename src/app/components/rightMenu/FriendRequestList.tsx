'use client'
import { acceptFollowRequest, declineFollowRequest } from "@/lib/actions";
import prisma from "@/lib/client";
import { FollowRequest, User } from "@prisma/client";
import Image from "next/image";
import { userAgent } from "next/server";
import { useOptimistic, useState } from "react";

type RequestWithUser = FollowRequest & {
  sender: User
}

const FriendRequestsList = ({ requests }: { requests: RequestWithUser[] }) => {

  const [requestState, setRequestState] = useState(requests)
  const accept = async (requestId: number, userId: string) => {
    removeOptimisticRequest(requestId)
    try {
      await acceptFollowRequest(userId)
      setRequestState(prev => prev.filter(req => req.id !== requestId))
    } catch (error) {

    }
  }

  const decline = async (requestId: number, userId: string) => {
    removeOptimisticRequest(requestId)
    try {
      await declineFollowRequest(userId)
      setRequestState(prev => prev.filter(req => req.id !== requestId))
    } catch (error) {

    }
  }

  const [optimisticRequests, removeOptimisticRequest] = useOptimistic(requestState, (state, value: number) => {
    return state.filter(req => req.id !== value)
  })

  return <>
    <div className="">
      {optimisticRequests.map((request) => (<div key={request.id} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image width={40} height={40} className="w-10 h-10 rounded-full object-cover" alt="" src={request.sender.avatar || '/noAvator.png'}></Image>
          <span className="font-semibold">
            {request.sender.name && request.sender.surname ? request.sender.name + " " + request.sender.surname : request.sender.username}
          </span>
        </div>
        <div className="flex gap-3 justify-end">
          <form action={() => accept(request.id, request.sender.id)}>
            <button>
              <Image alt="" width={20} height={20} src='/accept.png' className="cursor-pointer"></Image>
            </button>
          </form>
          <form action={() => decline(request.id, request.sender.id)}>
            <button>
              <Image alt="" width={20} height={20} src='/reject.png' className="cursor-pointer"></Image>
            </button>
          </form>

        </div>
      </div>))}


    </div>
  </>
}

export default FriendRequestsList
