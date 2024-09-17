import Image from "next/image"
export default function ProfileCard() {
  return (
    <>
      <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-6 mb-6">
        <div className="h-20 relative">
          <Image fill src='https://images.pexels.com/photos/28277493/pexels-photo-28277493.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load' alt=""
            className="rounded-md object-cover" />
          <Image width={48} height={48} src='https://images.pexels.com/photos/27555562/pexels-photo-27555562.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load' alt=""
            className="rounded-full  object-cover w-12 h-12 absolute m-auto bottom-6 ring-1 ring-white z-10" />
        </div>
        <div className="h-20 flex flex-col gap-2 items-center">
          <span className="font-semibold">xxxxxx</span>
          <div className=""></div>
        </div>
      </div>
    </>
  )
}
