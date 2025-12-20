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
  if (currentUserId === userId) {
    throw new Error("You can't follow yourself!")
  }
  try {
    return await prisma.$transaction(async (tx) => {
      const existingFollow = await tx.follow.findFirst({
        where: {
          followerId: currentUserId,
          followingId: userId,
        },
      })

      if (existingFollow) {
        const reciprocalFollow = await tx.follow.findFirst({
          where: {
            followerId: userId,
            followingId: currentUserId,
          },
        })

        if (reciprocalFollow) {
          await Promise.all([
            tx.follow.delete({
              where: {
                followerId_followingId: {
                  followerId: currentUserId,
                  followingId: userId,
                },
              },
            }),
            tx.follow.delete({
              where: {
                followerId_followingId: {
                  followerId: userId,
                  followingId: currentUserId,
                },
              },
            }),
          ])
        } else {
          await tx.follow.delete({
            where: {
              followerId_followingId: {
                followerId: currentUserId,
                followingId: userId,
              },
            },
          })
        }

        await tx.followRequest.deleteMany({
          where: {
            OR: [
              { senderId: currentUserId, receiverId: userId },
              { senderId: userId, receiverId: currentUserId },
            ],
          },
        })

        return { following: false, followingRequestSent: false }
      }

      const incomingRequest = await tx.followRequest.findFirst({
        where: {
          senderId: userId,
          receiverId: currentUserId,
        },
      })

      if (incomingRequest) {
        await tx.followRequest.delete({
          where: {
            senderId_receiverId: {
              senderId: userId,
              receiverId: currentUserId,
            },
          },
        })

        await tx.followRequest.deleteMany({
          where: {
            senderId: currentUserId,
            receiverId: userId,
          },
        })

        const [aFollowsB, bFollowsA] = await Promise.all([
          tx.follow.findFirst({
            where: { followerId: currentUserId, followingId: userId },
          }),
          tx.follow.findFirst({
            where: { followerId: userId, followingId: currentUserId },
          }),
        ])

        if (!aFollowsB) {
          await tx.follow.create({
            data: { followerId: currentUserId, followingId: userId },
          })
        }
        if (!bFollowsA) {
          await tx.follow.create({
            data: { followerId: userId, followingId: currentUserId },
          })
        }

        return { following: true, followingRequestSent: false }
      }

      const existingFollowRequest = await tx.followRequest.findFirst({
        where: {
          senderId: currentUserId,
          receiverId: userId,
        },
      })

      if (existingFollowRequest) {
        await tx.followRequest.delete({
          where: {
            senderId_receiverId: {
              senderId: currentUserId,
              receiverId: userId,
            },
          },
        })
        return { following: false, followingRequestSent: false }
      }

      await tx.followRequest.create({
        data: {
          senderId: currentUserId,
          receiverId: userId,
        },
      })

      return { following: false, followingRequestSent: true }
    })
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
          blockerId_blockedId: {
            blockerId: currentUserId,
            blockedId: userId,
          },
        },
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
    return await prisma.$transaction(async (tx) => {
      const existingFollowRequest = await tx.followRequest.findFirst({
        where: {
          senderId: userId,
          receiverId: currentUserId,
        },
      })

      if (!existingFollowRequest) {
        return false
      }

      await tx.followRequest.delete({
        where: {
          senderId_receiverId: {
            senderId: userId,
            receiverId: currentUserId,
          },
        },
      })

      await tx.followRequest.deleteMany({
        where: {
          senderId: currentUserId,
          receiverId: userId,
        },
      })

      const [aFollowsB, bFollowsA] = await Promise.all([
        tx.follow.findFirst({
          where: { followerId: userId, followingId: currentUserId },
        }),
        tx.follow.findFirst({
          where: { followerId: currentUserId, followingId: userId },
        }),
      ])

      if (!aFollowsB) {
        await tx.follow.create({
          data: {
            followerId: userId,
            followingId: currentUserId,
          },
        })
      }

      if (!bFollowsA) {
        await tx.follow.create({
          data: {
            followerId: currentUserId,
            followingId: userId,
          },
        })
      }

      return true
    })
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
          senderId_receiverId: {
            senderId: userId,
            receiverId: currentUserId,
          },
        },
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
    cover: z.string().optional(),  // 添加封面图字段
    avatar: z.string().optional(),  // 添加头像字段
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
    const existingLike = await prisma.postLike.findFirst({  // 查找当前用户是否已经点赞该帖子
      where: {
        postId,
        userId
      }
    })
    if (existingLike) {
      await prisma.postLike.delete({  // 取消点赞 删除点赞记录
        where: {
          id: existingLike.id
        }
      })
    } else {
      await prisma.postLike.create({
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
        content: desc
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
        content: validatedDesc.data as string,
        img,
      }
    })
    revalidatePath('/'); // 通知Next.js重新验证该路径，更新缓存
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong!')
  }
}

export const deletePost = async (postId: number) => {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('User is not Authenticated')
  }
  try {
    const existingPost = await prisma.post.findFirst({
      where: {
        id: postId,
        userId
      }
    })
    if (!existingPost) {
      throw new Error('Post not found or you are not authorized to delete it!')
    }
    await prisma.post.delete({
      where: {
        id: postId
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
        mediaUrl: img,
        img,
        mediaType: 'IMAGE',
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
