"use client"

import { useState } from "react";
import { PostInteraction } from "./PostInteraction";
import CommentList from "./CommentList";
import { User, Comment } from "@prisma/client";

type CommentWithUser = Comment & {
  user: User
}

interface PostWithInteractionProps {
  postId: number;
  likes: string[];
  commentNumber: number;
  initialComments: CommentWithUser[];
}

export const PostWithInteraction = ({ postId, likes, commentNumber, initialComments }: PostWithInteractionProps) => {
  const [commentCount, setCommentCount] = useState(commentNumber);

  const handleCommentAdded = () => {
    setCommentCount(prev => prev + 1);
  };

  return (
    <>
      <PostInteraction
        postId={postId}
        likes={likes}
        commentNumber={commentCount}
        onCommentAdded={handleCommentAdded}
      />
      <CommentList postId={postId} comments={initialComments} onCommentAdded={handleCommentAdded} />
    </>
  );
};
