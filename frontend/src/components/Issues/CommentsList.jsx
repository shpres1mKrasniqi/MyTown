export default function CommentsList({ comments }) {
  return (
    <div className="px-3 space-y-2 max-h-36 overflow-y-auto">
      {comments.map((c) => (
        <div key={c.id} className="text-xs">
          <b>{c.authorName}</b> {c.content}
        </div>
      ))}
    </div>
  );
}
