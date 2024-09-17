import Link from "next/link";
import Image from "next/image";
export default function UserInfoCard({ userId }: { userId: string }) {
  return <>
    <div className="">
      <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
        {/* Top */}
        <div className="flex items-center justify-between font-medium">
          <span className="text-gray-500">User Information</span>
          <Link href='/' className="text-blue-500 text-sm">See all</Link>
        </div>
        {/* Bottom */}
        <div className="flex flex-col gap-4 text-gray-500">
          <div className="flex items-center gap-2">
            <span className="text-xl text-black">ai meng</span>
            <span className="text-sm">@xing xing</span>
          </div>
          <p className="">
            李白，唐代杰出诗人，被誉为“诗仙”，作品豪放飘逸，代表作有《将进酒》《庐山谣》等。
          </p>
          <div className="flex items-center gap-2">
            <Image width={16} height={16} src='/map.png' alt=''></Image>
            <span>Living in <b>China</b></span>
          </div>
          <div className="flex items-center gap-2">
            <Image width={16} height={16} src='/work.png' alt=''></Image>
            <span>工作 <b>梦想做说唱男孩</b></span>
          </div>
          <div className="flex items-center gap-2">
            <Image width={16} height={16} src='/school.png' alt=''></Image>
            <span>m78星云 <b>宇宙大队队长</b></span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-1 items-center">
              <Image width={16} height={16} src='/link.png' alt=''></Image>
              <Link href='https://aimeng.fun' className="text-blue-500 font-medium">
                aimeng.fun
              </Link>
            </div>
            <div className="flex gap-1 items-center">
              <Image src='/date.png' alt="" width={16} height={16}></Image>
              <span>1999.09.09</span>
            </div>
          </div>
          <button className="bg-blue-500 text-white text-sm rounded-md p-1">
            Follow
          </button>
          <span className="text-red-400 self-end text-xs">Block User</span>
        </div>
      </div>
    </div >

  </>
}
