import Image from 'next/image';
import Comments from './Comments';
export default function Post() {
  return (
    <>
      <div className="flex flex-col gap-4">
        {/* User */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src='https://images.pexels.com/photos/17939186/pexels-photo-17939186.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load'
              width={40} height={40} alt='' className='w-10 h-10 rounded-full'></Image>
            <span className='font-medium'>jack</span>
          </div>
          <Image src='/more.png'
            width={16} height={16} alt=''></Image>
        </div>
        {/* Desc */}
        <div className="flex flex-col gap-4">
          <div className='w-full min-h-96 relative'>
            <Image src='https://images.pexels.com/photos/27980945/pexels-photo-27980945.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load'
              fill alt=''
              className='object-cover rounded-md'
            ></Image>
          </div>
          <p>“生活就像一场马拉松，不在乎你起跑的速度有多快，而在乎你能否坚持到最后。每个人的路途都不会一帆风顺，但正是那些曲折和坎坷，塑造了我们坚韧不拔的意志。不要害怕失败，因为每一次跌倒，都是向成功更近一步。记住，没有付出就没有收获，没有挑战就没有成长。所以，当你感到疲惫时，不妨停下来，深呼吸，然后带着新的力量继续前行。因为在你的内心深处，有着无限的潜力等待你去发掘。相信自己，你比你想象的要强大得多。”</p>
        </div>
        {/* Interaction */}
        <div className="flex items-center justify-between text-sm my-4">
          <div className='flex gap-8'>
            <div className='flex items-center gap-4 bg-slate-50 p-2 rounded-xl'>
              <Image src='/like.png' width={16} height={16} alt='' className='cursor-pointer'></Image>
              <span className='text-gray-300'>|</span>
              <span className='text-gray-500'>41<span className='hidden md:inline'>Likes</span></span>
            </div>
            <div className='flex items-center gap-4 bg-slate-50 p-2 rounded-xl'>
              <Image src='/comment.png' width={16} height={16} alt='' className='cursor-pointer'></Image>
              <span className='text-gray-300'>|</span>
              <span className='text-gray-500'>41<span className='hidden md:inline'>Commnets</span></span>
            </div>
          </div>
          <div className='flex gap-8'>
            <div className='flex items-center gap-4 bg-slate-50 p-2 rounded-xl'>
              <Image src='/share.png' width={16} height={16} alt='' className='cursor-pointer'></Image>
              <span className='text-gray-300'>|</span>
              <span className='text-gray-500'>41<span className='hidden md:inline'>Shares</span></span>
            </div>
          </div>
        </div>
        <Comments></Comments>
      </div>
    </>
  )
}
