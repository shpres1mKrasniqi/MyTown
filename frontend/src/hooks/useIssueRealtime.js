import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";

export default function useIssueRealtime({ fetchIssues, setSocialByIssue }) {
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7214/hubs/problems")
      .withAutomaticReconnect()
      .build();

    connection.start().then(() => {
      connection.on("ProblemCreated", () => {
        fetchIssues();
      });

      connection.on("LikeUpdated", (payload) => {
        setSocialByIssue((prev) => ({
          ...prev,
          [payload.postId]: {
            ...(prev[payload.postId] || {}),
            likeCount: payload.likeCount,
          },
        }));
      });

      connection.on("CommentAdded", (payload) => {
        setSocialByIssue((prev) => {
          const cur = prev[payload.postId] || { comments: [] };

          return {
            ...prev,
            [payload.postId]: {
              ...cur,
              comments: [...(cur.comments || []), payload.comment],
            },
          };
        });
      });
    });

    return () => connection.stop();
  }, [fetchIssues, setSocialByIssue]);
}
