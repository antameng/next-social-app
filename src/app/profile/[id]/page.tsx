import AddPost from "@/app/components/AddPost";
import Feed from "@/app/components/Feed";
import LeftMenu from "@/app/components/LeftMenu";
import RightMenu from "@/app/components/RightMenu";
import Stories from "@/app/components/Stories";

export default function Page() {
  return <>
    <div className='flex gap-6 pt-6'>
      <div className="hidden xl:block w-[20%]">
        <LeftMenu type="profile"></LeftMenu>

      </div>
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="flex flex-col gap-6">

          <Feed></Feed>
        </div>
      </div>
      <div className="hidden lg:block w-[30%]">
        <RightMenu userId="test"></RightMenu>
      </div>
    </div>

  </>
}
