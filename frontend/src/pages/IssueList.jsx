import useIssues from "../hooks/useIssues";
import useCurrentUser from "../hooks/useCurrentUser";
import useIssueSocial from "../hooks/useIssueSocial";
import useIssueRealtime from "../hooks/useIssueRealtime";

import IssueCard from "../components/Issues/IssueCard";

export default function IssueList() {
  const { issues, loading, fetchIssues, deleteIssue } = useIssues();
  const user = useCurrentUser();
  const {
    socialByIssue,
    setSocialByIssue,
    commentDraft,
    setCommentDraft,
    handleToggleLike,
    handleAddComment,
  } = useIssueSocial();

  useIssueRealtime({ fetchIssues, setSocialByIssue });

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {issues.map((issue) => (
        <IssueCard
          key={issue.id}
          issue={issue}
          social={socialByIssue[issue.id]}
          onLike={handleToggleLike}
          onComment={handleAddComment}
          commentDraft={commentDraft[issue.id]}
          setCommentDraft={setCommentDraft}
          onDelete={deleteIssue}
          isCitizen={user?.roles?.includes("Citizen")}
          isStaff={user?.roles?.includes("Staff")}
        />
      ))}
    </div>
  );
}
