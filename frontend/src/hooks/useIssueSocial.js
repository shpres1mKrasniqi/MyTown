import { useState } from "react";
import { IssueService } from "../services/IssueServices";

export default function useIssueSocial() {
  const [socialByIssue, setSocialByIssue] = useState({});
  const [commentDraft, setCommentDraft] = useState({});

  const loadSocialForIssues = async (issuesList) => {
    const map = {};
    await Promise.all(
      issuesList.map(async (issue) => {
        try {
          const [likesRes, commentsRes] = await Promise.all([
            IssueService.getLikes(issue.id),
            IssueService.getComments(issue.id),
          ]);
          map[issue.id] = {
            likeCount: likesRes.data.likeCount,
            likedByMe: likesRes.data.likedByCurrentUser,
            comments: commentsRes.data,
          };
        } catch (err) {
          map[issue.id] = { likeCount: 0, likedByMe: false, comments: [] };
        }
      })
    );
    setSocialByIssue(map);
  };

  const handleToggleLike = async (issueId) => {
    try {
      const res = await IssueService.toggleLike(issueId);

      setSocialByIssue((prev) => ({
        ...prev,
        [issueId]: {
          ...(prev[issueId] || {
            likeCount: 0,
            likedByMe: false,
            comments: [],
          }),
          likeCount: res.data.likeCount,
          likedByMe: res.data.likedByCurrentUser,
        },
      }));
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Duhet të jeni të kyçur.");
      }
    }
  };

  const handleAddComment = async (issueId, text) => {
    try {
      await IssueService.addComment(issueId, text);

      setCommentDraft((prev) => ({
        ...prev,
        [issueId]: "",
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return {
    socialByIssue,
    setSocialByIssue,
    commentDraft,
    setCommentDraft,
    handleToggleLike,
    handleAddComment,
    loadSocialForIssues,
  };
}
