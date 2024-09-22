import Link from "next/link";
import Image from "next/image";
import { User } from "@prisma/client";
export default function UserMediaCard({ user }: { user: User }) {
  return <>
    <div className="">
      <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
        {/* Top */}
        <div className="flex items-center justify-between font-medium">
          <span className="text-gray-500">User Media</span>
          <Link href='/' className="text-blue-500 text-sm">See all</Link>
        </div>
        {/* Bottom */}
        <div className="flex gap-4 justify-between flex-wrap">
          <div className="relative w-1/5 h-24">
            <Image src='https://images.pexels.com/photos/28055801/pexels-photo-28055801.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load' alt="" className="object-cover rounded-md" fill></Image>
          </div>
          <div className="relative w-1/5 h-24">
            <Image src='https://images.pexels.com/photos/28055801/pexels-photo-28055801.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load' alt="" className="object-cover rounded-md" fill></Image>
          </div>
          <div className="relative w-1/5 h-24">
            <Image src='https://images.pexels.com/photos/28055801/pexels-photo-28055801.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load' alt="" className="object-cover rounded-md" fill></Image>
          </div>
          <div className="relative w-1/5 h-24">
            <Image src='https://images.pexels.com/photos/28055801/pexels-photo-28055801.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load' alt="" className="object-cover rounded-md" fill></Image>
          </div>
          <div className="relative w-1/5 h-24">
            <Image src='https://images.pexels.com/photos/28055801/pexels-photo-28055801.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load' alt="" className="object-cover rounded-md" fill></Image>
          </div>
        </div>
      </div>

    </div>
  </>
}
