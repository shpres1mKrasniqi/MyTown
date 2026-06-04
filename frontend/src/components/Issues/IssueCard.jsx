import IssueHeader from "./IssueHeader";
import IssueContent from "./IssueContent";
import IssueActions from "./IssueActions";
import CommentsList from "./CommentsList";
import CommentForm from "./CommentForm";
import ImageCarousel from "./ImageCarousel";

export default function IssueCard({
  issue,
  social,
  onLike,
  onComment,
  commentDraft,
  setCommentDraft,
  onDelete,
  isCitizen,
  isStaff,
  navigate,
}) {
  return (
    <div className="bg-white border border-gray-200 md:rounded-sm overflow-hidden">
      <IssueHeader
        issue={issue}
        onDelete={onDelete}
        isCitizen={isCitizen}
        isStaff={isStaff}
        navigate={navigate}
      />

      <ImageCarousel files={issue.files} />

      <IssueContent issue={issue} />

      <IssueActions social={social} onLike={() => onLike(issue.id)} />

      <CommentsList comments={social?.comments || []} />

      <CommentForm
        value={commentDraft || ""}
        setValue={(val) =>
          setCommentDraft((prev) => ({
            ...prev,
            [issue.id]: val,
          }))
        }
        onSubmit={(text) => onComment(issue.id, text)}
      />
    </div>
  );
}
