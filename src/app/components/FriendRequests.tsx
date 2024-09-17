import Link from "next/link";
import Image from "next/image";
export default function FriendRequests() {
  return (
    <>
      <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
        {/* Top */}
        <div className="flex items-center justify-between font-medium">
          <span className="text-gray-500">Friend Requests</span>
          <Link href='/' className="text-blue-500 text-sm">See all</Link>
        </div>
        {/* User */}
        <div className="flex items-center justify-center">
          <div className="">
            <Image></Image>
          </div>
          <div className=""></div>
        </div>
      </div>
    </>
  )
}
