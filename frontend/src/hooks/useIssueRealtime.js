import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";

export default function useIssueRealtime({ fetchIssues, setSocialByIssue }) {
  const connectionRef = useRef(null);
  const isStartedRef = useRef(false);

  useEffect(() => {
    if (isStartedRef.current) return;
    isStartedRef.current = true;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7214/hubs/problems")
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    connection.onreconnecting((err) => {
      console.log("⚠️ reconnecting", err);
    });

    connection.onreconnected(() => {
      console.log("✅ reconnected");
    });

    connection.onclose(() => {
      console.log("❌ closed");
    });

    const start = async () => {
      try {
        await connection.start();
        console.log("✅ SignalR connected");

        connection.on("ProblemCreated", fetchIssues);

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
      } catch (err) {
        console.log("❌ initial connect failed:", err);
      }
    };

    start();

    return () => {
      connection.stop();
      connectionRef.current = null;
      isStartedRef.current = false;
    };
  }, [fetchIssues, setSocialByIssue]);
}
