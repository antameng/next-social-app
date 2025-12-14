"use client"

import { Story, User } from "@prisma/client"

type StoryWithUser = Story & {
  user: User
}
const StoryList = ({ stories, userId }: { stories:StoryWithUser, userId: string }) => {

}
