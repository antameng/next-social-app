import { auth } from "@clerk/nextjs/server";
import Post from "./Post";
import prisma from "@/lib/client";
export default async function Feed({ username }: { username?: string }) {

  const { userId } = await auth()

  let posts: any = []

  if (username) {
    posts = await prisma.post.findMany({
      where: {
        user: {
          username: username
        }
      },
      include: {
        user: true,
        likes: {
          select: {
            userId: true
          }
        },
        _count: {
          select: {
            comments: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })
  }
  if (!username && userId) {
    const following = await prisma.follower.findMany({
      where: {
        followerId: userId
      },
      select: {
        followerId: true
      }
    })

    const followingIds = following.map(f => f.followerId) // 我关注的人的ID数组
    console.log(following, 'following', followingIds);
    posts = await prisma.post.findMany({
      where: {
        userId: {
          in: followingIds
        }
      },
      include: {
        user: true,
        likes: {
          select: {
            userId: true
          }
        },
        _count: {
          select: {
            comments: true,
          }
        }
      },
    })
  }

  return (
    <>
      <div className="p-4 bg-white rounded-lg shadow-md flex flex-col gap-12">

        {posts?.length ? (posts.map((post: any) => {
          return <Post key={post.id} post={post}></Post>
        })) : 'No posts found!'}

      </div>
    </>
  )
}
