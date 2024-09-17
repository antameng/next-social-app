import Ad from "./Ad";
import Birthdays from "./Birthdays";
import FriendRequests from "./FriendRequests";

export default function RightMenu({ userId }: { userId?: string }) {
  return (
    <>
      <div className="flex flex-col gap-6">
        <FriendRequests></FriendRequests>
        <Birthdays></Birthdays>
        <Ad size="md"></Ad>
      </div>
    </>
  )
}
