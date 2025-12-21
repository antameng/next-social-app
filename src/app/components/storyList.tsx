"use client";

import { addStory } from "@/lib/actions";
import { useUser } from "@clerk/nextjs";
import { Story, User } from "@prisma/client";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useOptimistic, useState } from "react";

type StoryWithUser = Story & {
  user: User;
};

const StoryList = ({
  stories,
  userId,
}: {
  stories: StoryWithUser[];
  userId: string;
}) => {
  const [storyList, setStoryList] = useState(stories);
  const [img, setImg] = useState<any>();

  const { user, isLoaded } = useUser();

  const add = async () => {
    if (!img?.secure_url) return;

    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();
    // eslint-disable-next-line react-hooks/purity
    const tempId = Math.random();

    addOptimisticStory({
      id: tempId,
      mediaUrl: img.secure_url,
      img: img.secure_url,
      mediaType: 'IMAGE' as const,
      viewCount: 0,
      createdAt: new Date(now),
      expiresAt: new Date(now + 24 * 60 * 60 * 1000),
      userId: userId,
      user: {
        id: userId,
        username: "Sending...",
        email: null,
        phone: null,
        password: null,
        avatar: user?.imageUrl || "/noAvatar.png",
        cover: '/noCover.png',
        name: null,
        surname: null,
        bio: null,
        website: null,
        location: null,
        birthday: null,
        isPrivate: false,
        isVerified: false,
        role: 'USER' as const,
        status: 'ACTIVE' as const,
        postCount: 0,
        followerCount: 0,
        followingCount: 0,
        createdAt: new Date(now),
        updatedAt: new Date(now)
      },
    });

    try {
      const createdStory = await addStory(img.secure_url);
      setStoryList((prev) => [createdStory!, ...prev]);
      setImg(null)
    } catch (err) { }
  };

  const [optimisticStories, addOptimisticStory] = useOptimistic(
    storyList,
    (state, value: StoryWithUser) => [value, ...state]
  );
  return (
    <>
      <CldUploadWidget
        uploadPreset="social"
        onSuccess={(result, { widget }) => {
          setImg(result.info);
          widget.close();
        }}
      >
        {({ open }) => {
          return (
            <div className="flex flex-col items-center gap-2 cursor-pointer relative">
              <Image
                src={img?.secure_url || user?.imageUrl || "/noAvatar.png"}
                alt=""
                width={80}
                height={80}
                className="w-20 h-20 rounded-full ring-2 object-cover"
                onClick={() => open()}
              />
              {img ? (
                <button
                  onClick={add}
                  className="text-xs bg-blue-500 p-1 rounded-md text-white"
                >
                  Send
                </button>
              ) : (
                <span className="font-medium">Add a Story</span>
              )}
              <div className="absolute text-6xl text-gray-200 top-1">+</div>
            </div>
          );
        }}
      </CldUploadWidget>
      {/* STORY */}
      {optimisticStories.map((story) => (
        <div
          className="flex flex-col items-center gap-2 cursor-pointer"
          key={story.id}
        >
          <Image
            src={story.user.avatar || "/noAvatar.png"}
            alt=""
            width={80}
            height={80}
            className="w-20 h-20 rounded-full ring-2"
          />
          <span className="font-medium">
            {story.user.name || story.user.username}
          </span>
        </div>
      ))}
    </>
  );
};

export default StoryList;
