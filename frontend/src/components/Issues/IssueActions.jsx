import { Heart } from "lucide-react";

export default function IssueActions({ social, onLike }) {
  return (
    <div className="px-3 py-2 flex items-center gap-4 border-t border-gray-100 mt-2">
      <button onClick={onLike} className="flex items-center gap-1 group">
        <Heart
          size={24}
          className={`transition-colors ${
            social?.likedByMe
              ? "text-red-500 fill-red-500"
              : "text-gray-700 hover:text-gray-500"
          }`}
        />
        {social?.likeCount > 0 && (
          <span className="text-sm font-semibold text-gray-700">{social.likeCount}</span>
        )}
      </button>
    </div>
  );
}
