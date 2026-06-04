import { Heart, MessageCircle } from "lucide-react";

export default function IssueActions({ social, onLike }) {
  return (
    <div className="px-3 pb-2 flex items-center gap-4">
      <button onClick={onLike}>
        <Heart
          className={social?.likedByMe ? "text-red-500 fill-red-500" : ""}
        />
        {social?.likeCount ?? 0}
      </button>

      <div className="text-gray-500 flex items-center gap-1">
        <MessageCircle />
        {social?.comments?.length ?? 0}
      </div>
    </div>
  );
}
