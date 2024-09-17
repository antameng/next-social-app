import Image from "next/image"
import Link from "next/link"
export default function Birthdays() {
  return <>
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      {/* Top */}
      <div className="flex items-center justify-between font-medium">
        <span className="text-gray-500">Birthday</span>
        <Link href='/' className="text-blue-500 text-sm">See all</Link>
      </div>
      {/* User */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image width={40} height={40} className="w-10 h-10 rounded-full object-cover" alt="" src="https://images.pexels.com/photos/14475824/pexels-photo-14475824.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"></Image>
          <span className="font-semibold">张伟</span>
        </div>
        <div className="flex gap-3 justify-end">
          <button className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md">celebrate</button>
        </div>
      </div>
      {/* upcoming */}
      <div className="p-4 bg-slate-100 rounded-lg flex items-center gap-4">
      <Image width={24} height={24} className="rounded-full object-cover" alt="" src='/gift.png'></Image>
        <Link href='/' className="flex flex-col gap-1 text-xs">
          <span className="text-gray-700 font-semibold">Upcoming Birthday</span>
          <span className="text-gray-500">See other 16 have upcoming birthdays</span>
        </Link>
      </div>
    </div>
  </>
}
