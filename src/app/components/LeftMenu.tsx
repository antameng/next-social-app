import ProfileCard from "./ProfileCard";
import Link from "next/link";
import Image from "next/image";
import Ad from "./Ad";
export default function LeftMenu({ type }: { type: 'home' | 'profile' }) {
  return (
    <>
      <div className="">
        {type === 'home' && <ProfileCard></ProfileCard>}
        <div className="p-4 bg-white rounded-lg shadow-md text-sm text-gray-500 flex flex-col gap-2">
          <Link href='/' className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100">
            <Image src='/posts.png' width={20} height={20} alt=""></Image>
            <span>My Posts</span>
          </Link>
          <Link href='/' className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100">
            <Image src='/activity.png' width={20} height={20} alt=""></Image>
            <span>Activity</span>
          </Link>
          <Link href='/' className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100">
            <Image src='/market.png' width={20} height={20} alt=""></Image>
            <span>Marketplace</span>
          </Link>
          <Link href='/' className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100">
            <Image src='/events.png' width={20} height={20} alt=""></Image>
            <span>Events</span>
          </Link>
          <Link href='/' className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100">
            <Image src='/albums.png' width={20} height={20} alt=""></Image>
            <span>Albums</span>
          </Link>
          <Link href='/' className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100">
            <Image src='/videos.png' width={20} height={20} alt=""></Image>
            <span>Videos</span>
          </Link>
          <Link href='/' className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100">
            <Image src='/news.png' width={20} height={20} alt=""></Image>
            <span>News</span>
          </Link>
          <Link href='/' className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100">
            <Image src='/courses.png' width={20} height={20} alt=""></Image>
            <span>Courses</span>
          </Link>
          <Link href='/' className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100">
            <Image src='/lists.png' width={20} height={20} alt=""></Image>
            <span>Lists</span>
          </Link>
          <Link href='/' className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100">
            <Image src='/settings.png' width={20} height={20} alt=""></Image>
            <span>Settings</span>
          </Link>
          {/* <hr className="border-t-1 border-gray-50 w-36 self-center" /> */}
        </div>
        <div className="mt-6">
          <Ad size='sm'></Ad>
        </div>
      </div>
    </>
  )
}
