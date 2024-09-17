import Image from "next/image"
export default function Ad({ size }: {
    size: 'sm' | 'md' | 'lg'
}) {
    return <>
        <div className="p-4 bg-white rounded-lg shadow-md text-sm">
            <div className="flex items-center justify-between text-gray-500 font-medium">
                <span>Sponsored Ads</span>
                <Image src='/more.png' alt="" width={16} height={16} />
            </div>
            <div className={`flex flex-col mt-4 ${size === 'sm' ? 'gap-2' : 'gap-4'}`}>
                <div className={`relative w-full ${size === 'sm' ? 'h-24' : size === 'md' ? 'h-36' : 'h-48'}`}>
                    <Image className="rounded-lg object-cover" src='https://images.pexels.com/photos/26922659/pexels-photo-26922659.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load' alt="" fill></Image>
                </div>
                <div className="flex items-center gap-4">
                    <Image width={24} height={24} className="rounded-full w-6 h-6 object-cover" src='https://images.pexels.com/photos/26922659/pexels-photo-26922659.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load' alt=""></Image>
                    <span className="text-blue-500 font-medium">BigChef</span>
                </div>
                <p className={size === 'sm' ? 'text-xs' : 'text-sm'}>
                    {size === 'sm' ? 'are' : size === 'md' ? 'are you' : 'are you ok'}
                </p>
                <button className="bg-gray-200 p-2 text-gray-500 text-xs rounded-lg">
                    Learn More
                </button>
            </div>
        </div>
    </>
}
