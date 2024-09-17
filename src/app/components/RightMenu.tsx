import Ad from "./Ad";
import Birthdays from "./Birthdays";
import FriendRequests from "./FriendRequests";
import UserInfoCard from "./UserInfoCard";
import UserMediaCard from "./UserMediaCard";

export default function RightMenu({ userId }: { userId?: string }) {
  return (
    <>
      <div className="flex flex-col gap-6">
        {userId ? (
          <>
            <UserInfoCard userId={userId}></UserInfoCard >
            <UserMediaCard userId={userId}></UserMediaCard>
          </>
        ) : null}
        <FriendRequests></FriendRequests>
        <Birthdays></Birthdays>
        <Ad size="md"></Ad>
      </div>
    </>
  )
}
