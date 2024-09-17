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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image width={40} height={40} className="w-10 h-10 rounded-full object-cover" alt="" src="https://images.pexels.com/photos/14475824/pexels-photo-14475824.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"></Image>
            <span className="font-semibold">张伟</span>
          </div>
          <div className="flex gap-3 justify-end">
            <Image alt="" width={20} height={20} src='/accept.png' className="cursor-pointer"></Image>
            <Image alt="" width={20} height={20} src='/reject.png' className="cursor-pointer"></Image>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image width={40} height={40} className="w-10 h-10 rounded-full object-cover" alt="" src="https://images.pexels.com/photos/14475824/pexels-photo-14475824.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"></Image>
            <span className="font-semibold">张伟</span>
          </div>
          <div className="flex gap-3 justify-end">
            <Image alt="" width={20} height={20} src='/accept.png' className="cursor-pointer"></Image>
            <Image alt="" width={20} height={20} src='/reject.png' className="cursor-pointer"></Image>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image width={40} height={40} className="w-10 h-10 rounded-full object-cover" alt="" src="https://images.pexels.com/photos/14475824/pexels-photo-14475824.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"></Image>
            <span className="font-semibold">张伟</span>
          </div>
          <div className="flex gap-3 justify-end">
            <Image alt="" width={20} height={20} src='/accept.png' className="cursor-pointer"></Image>
            <Image alt="" width={20} height={20} src='/reject.png' className="cursor-pointer"></Image>
          </div>
        </div>
      </div>
    </>
  )
}
