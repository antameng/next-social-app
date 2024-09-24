import Link from "next/link";
import Image from "next/image";
import { User } from "@prisma/client";
import prisma from "@/lib/client";
export default async function UserMediaCard({ user }: { user: User }) {

  const postsWithMedia = await prisma.post.findMany({
    where: {
      userId: user.id,
      img: {
        not: null
      }
    },
    take: 8,
    orderBy: {
      createAt: "desc"
    }
  })

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
          {postsWithMedia.length ? postsWithMedia.map(post => {
            return (<div key={post.id} className="relative w-1/5 h-24">
              <Image src={post.img!} alt="" className="object-cover rounded-md" fill></Image>
            </div>)
          }) : 'No media found!'}
        </div>
      </div>

    </div>
  </>
}
