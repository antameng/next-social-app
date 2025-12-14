import { auth } from "@clerk/nextjs/server";
import Post from "./Post";
import prisma from "@/lib/client";
export default async function Feed({ username }: { username?: string }) {

  const { userId } = auth()

  let posts

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
        createAt: "desc"
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
    console.log(following)
  }

  return (
    <>
      <div className="p-4 bg-white rounded-lg shadow-md flex flex-col gap-12">
        <Post></Post>
        <Post></Post>
        <Post></Post>
        <Post></Post>
        <Post></Post>
        <Post></Post>
      </div>
    </>
  )
}
