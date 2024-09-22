import { User } from "@prisma/client";
import Ad from "../Ad";
import Birthdays from "./Birthdays";
import FriendRequests from "./FriendRequests";
import UserInfoCard from "./UserInfoCard";
import UserMediaCard from "./UserMediaCard";
import { Suspense } from "react";

export default function RightMenu({ user }: { user?: User }) {
  return (
    <>
      <div className="flex flex-col gap-6">
        {user ? (
          <>
            <Suspense fallback='loading...'>
              <UserInfoCard user={user}></UserInfoCard >
            </Suspense>
            <Suspense fallback='loading'>
              <UserMediaCard user={user}></UserMediaCard>
            </Suspense>
          </>
        ) : null}
        <FriendRequests></FriendRequests>
        <Birthdays></Birthdays>
        <Ad size="md"></Ad>
      </div>
    </>
  )
}
