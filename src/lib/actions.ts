"use server"
import { auth } from "@clerk/nextjs/server"
import prisma from "./client"
import { z } from "zod"
import { revalidatePath } from "next/cache"

export const switchFollow = async (userId: string) => {
  const { userId: currentUserId } = await auth()
  if (!currentUserId) {
    throw new Error('User is not authenticated!')
  }
  try {
    const existingFollow = await prisma.follower.findFirst({
      where: {
        followerId: currentUserId,
        followingId: userId
      }
    })

    if (existingFollow) {
      await prisma.follower.delete({
        where: {
          id: existingFollow.id
        }
      })
    } else {
      const existingFollowRequest = await prisma.followRequest.findFirst({
        where: {
          senderId: currentUserId,
          receiverId: userId
        }
      })

      if (existingFollowRequest) {
        await prisma.followRequest.delete({
          where: {
            id: existingFollowRequest.id
          }
        })
      } else {
        await prisma.followRequest.create({
          data: {
            senderId: currentUserId,
            receiverId: userId
          }
        })
      }

    }
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong!')

  }
}

export const switchBlock = async (userId: string) => {
  const { userId: currentUserId } = await auth()
  if (!currentUserId) {
    throw new Error("User is not Authenticated")
  }
  try {
    const existBlock = await prisma.block.findFirst({
      where: {
        blockerId: currentUserId,
        blockedId: userId
      }
    })

    if (existBlock) {
      await prisma.block.delete({
        where: {
          id: existBlock.id
        }
      })
    } else {
      await prisma.block.create({
        data: {
          blockerId: currentUserId,
          blockedId: userId
        }
      })
    }

  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong!')
  }
}

export const acceptFollowRequest = async (userId: string) => {
  const { userId: currentUserId } = await auth()
  if (!currentUserId) {
    throw new Error('User is not Authenticated!!')
  }
  try {
    const existingFollowRequest = await prisma.followRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: currentUserId
      }
    })
    if (existingFollowRequest) {
      await prisma.followRequest.delete({
        where: {
          id: existingFollowRequest.id
        }
      })
      await prisma.follower.create({
        data: {
          followerId: userId,
          followingId: currentUserId
        }
      })
    }
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong!')
  }

}

export const declineFollowRequest = async (userId: string) => {
  const { userId: currentUserId } = await auth()
  if (!currentUserId) {
    throw new Error('User is not Authenticated!!')
  }
  try {
    const existingFollowRequest = await prisma.followRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: currentUserId
      }
    })
    if (existingFollowRequest) {
      await prisma.followRequest.delete({
        where: {
          id: existingFollowRequest.id
        }
      })
    }
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong!')
  }

}

export const updateProfile = async (prevState: { success: boolean, error: boolean }, payload: {
  formData: FormData,
  cover: string
}) => {
  const { formData, cover } = payload
  const fileds = Object.fromEntries(formData)

  const filteredFields = Object.fromEntries(  // 过滤掉值为空的字段
    Object.entries(fileds).filter(([_, value]) => value !== '')
  )
  const Profile = z.object({
    name: z.string().max(30).optional(),  // optional 表示该字段可以不存在
    surname: z.string().max(30).optional(),
    description: z.string().max(100).optional(),
    city: z.string().max(50).optional(),
    school: z.string().max(50).optional(),
    work: z.string().max(50).optional(),
  })
  const validatedFields = Profile.safeParse({ cover, ...filteredFields })
  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    // throw new Error('Invalid form data')
    return { success: false, error: true }
  }
  const { userId } = await auth()
  if (!userId) {
    // throw new Error('User is not Authenticated')
    return { success: false, error: true }
  }
  try {
    await prisma.user.update({
      where: {
        id: userId
      },
      data: validatedFields.data
    })
    return { success: true, error: false }
  } catch (error) {
    console.log(error);
    // throw new Error('Something went wrong!')
    return { success: false, error: true }
  }
}

export const switchLike = async (postId: number) => {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('User is not Authenticated')
  }
  try {
    const existingLike = await prisma.like.findFirst({  // 查找当前用户是否已经点赞该帖子
      where: {
        postId,
        userId
      }
    })
    if (existingLike) {
      await prisma.like.delete({  // 取消点赞 删除点赞记录
        where: {
          id: existingLike.id
        }
      })
    } else {
      await prisma.like.create({
        data: {
          postId,
          userId
        }
      })
    }
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong!')
  }
}


export const addComment = async (postId: number, desc: string) => {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('User is not Authenticated')
  }
  try {
    const createdComment = await prisma.comment.create({
      data: {
        postId,
        userId,
        desc
      },
      include: {  // 创建评论的同时，包含用户信息
        user: true
      }
    })
    return createdComment  // 返回创建的评论对象
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong!')
  }
}

export const addPost = async (formData: FormData, img: string) => {
  const desc = formData.get('desc')
  const Desc = z.string().min(1).max(500).optional() // desc 不可以为空字符串，但不能超过500字符
  const { userId } = await auth()
  const validatedDesc = Desc.safeParse(desc)
  if (!userId) {
    throw new Error('User is not Authenticated')
  }
  if (!validatedDesc.success) {
    // throw new Error('Post description is invalid!')
    console.log('Post description is invalid!');
    return
  }

  if (!desc && !img) {
    throw new Error('Post cannot be empty!')
  }
  const fileds = Object.fromEntries(formData)


  try {
    await prisma.post.create({
      data: {
        userId,
        desc: validatedDesc.data as string,
        img,
      }
    })
    revalidatePath('/'); // 通知Next.js重新验证该路径，更新缓存
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong!')
  }
}

export const addStory = async (img: string) => {
  const { userId } = await auth();

  if (!userId) throw new Error("User is not authenticated!");

  try {
    const existingStory = await prisma.story.findFirst({
      where: {
        userId,
      },
    });

    if (existingStory) {
      await prisma.story.delete({
        where: {
          id: existingStory.id,
        },
      });
    }
    const createdStory = await prisma.story.create({
      data: {
        userId,
        img,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      include: {
        user: true,
      },
    });

    return createdStory;
  } catch (err) {
    console.log(err);
  }
};
