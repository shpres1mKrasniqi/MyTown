import { useEffect } from "react";
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
    loadSocialForIssues,
  } = useIssueSocial();

  useEffect(() => {
    if (issues && issues.length > 0) {
      loadSocialForIssues(issues);
    }
  }, [issues]);

  useIssueRealtime({ fetchIssues, setSocialByIssue });

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-white md:bg-gray-50 pb-10">
      <div className="max-w-[470px] mx-auto pt-4 space-y-4">
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
    </div>
  );
}
