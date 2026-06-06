export default function CommentsList({ comments }) {
  if (!comments || comments.length === 0) return null;

  return (
    <div className="px-3 pb-2 space-y-1 max-h-40 overflow-y-auto">
      {comments.map((c) => (
        <div key={c.id} className="text-sm">
          <span className="font-semibold mr-2">{c.authorName}</span>
          <span className="text-gray-800">{c.content}</span>
        </div>
      ))}
    </div>
  );
}
