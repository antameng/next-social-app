"use server"
import { auth } from "@clerk/nextjs/server"
import prisma from "./client"
import z from "zod"

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

export const updateProfile = async (prevState:{success:boolean,error:boolean}, payload: {
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
    const validatedFields = Profile.safeParse({cover, ...filteredFields})
    if (!validatedFields.success) {
      console.log(validatedFields.error.flatten().fieldErrors);
      throw new Error('Invalid form data')
    }
    const { userId } = await auth()
    if (!userId) {
      throw new Error('User is not Authenticated')
    }
    try {
      await prisma.user.update({
        where: {
          id: userId
        },
        data: validatedFields.data
      })
    } catch (error) {
      console.log(error);
      throw new Error('Something went wrong!')
    }
}
