"use client"
import { deletePost } from "@/lib/actions";
import Image from "next/image";
import { useState } from "react";

export const PostInfo = ({ postId }: { postId: number }) => {
  const [open, setOpen] = useState(false);
  // 创建专用函数: bind() 创建一个新函数,这个函数"记住"了当前帖子的 ID
  // 表单提交时: 当用户点击"Delete"按钮,表单会调用 deletePostWithId(),它会自动将预绑定的 postId 传递给 deletePost Server Action

  // 等价于使用箭头函数
  // const deletePostWithId = () => deletePost(postId);
  // 或者不使用 bind,而是在表单中使用隐藏 input
  {/* <form action={deletePost}>
  <input type="hidden" name="postId" value={postId} />
  <button>Delete</button>
  </form> */}
  const deletePostWithId = deletePost.bind(null, postId);
  return (
    <div className="relative">
      <Image
        src="/more.png"
        width={16}
        height={16}
        alt=""
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer"
      />
      {open && (
        <div className="absolute top-4 right-0 bg-white p-4 w-32 rounded-lg flex flex-col gap-2 text-xs shadow-lg z-30">
          <span className="cursor-pointer">View</span>
          <span className="cursor-pointer">Re-post</span>
          <form action={deletePostWithId}>
            <button className="text-red-500">Delete</button>
          </form>
        </div>
      )}
    </div>
  );
}
