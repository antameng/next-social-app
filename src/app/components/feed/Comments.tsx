import Image from "next/image"
export default function Comments() {
  return <>
    <div className="">
      {/* write */}
      <div className="flex items-center gap-4">
        <Image className="w-8 h-8 rounded-full" alt='' width={32} height={32} src='https://images.pexels.com/photos/28374828/pexels-photo-28374828.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load'></Image>
        <div className="flex-1 flex items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-full">
          <input type="text" placeholder="write a comment..." className="bg-transparent outline-none flex-1"></input>
          <Image src='/emoji.png' className="cursor-pointer"
            alt="" width={16} height={16}></Image>
        </div>
      </div>

      <div className="">
        <div className="flex gap-4 justify-between mt-6">
          {/* 头像 */}
          <Image className="w-10 h-10 rounded-full" alt='' width={40} height={40} src='https://images.pexels.com/photos/28374828/pexels-photo-28374828.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load'></Image>
          {/* 描述 */}
          <div className="flex flex-1 flex-col gap-2">
            <span className="font-medium">Rose</span>
            <p>“每个人的生活都是一幅画，而你，就是那持笔的艺术家。不要害怕在画布上留下痕迹，因为每一笔都是你独特故事的一部分。有些线条可能会颤抖，有些色彩可能会混杂，但正是这些不完美的笔触，赋予了你的作品真实与深度。</p>
            <div className="flex items-center gap-8 text-xs text-gray-500 mt-2">
              <div className="flex items-center gap-4">
                <Image src='/like.png' alt=""
                  width={12} height={12}
                  className="cursor-pointer"
                >
                </Image>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500">123 Likes</span>
              </div>
              <div className="">Reply</div>
            </div>
          </div>
          {/* ICON */}
          <Image src='/more.png' alt="" width={16} height={16} className="cursor-pointer w-4 h-4"></Image>
        </div>
      </div>

    </div>
  </>
}
