import { useEffect, useState } from "react";
import { IssueService } from "../services/IssueServices";
import { useNavigate } from "react-router-dom";
import { currentUser } from "../services/authService"; // ndrysho path nëse e ke ndryshe
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";
import * as signalR from "@microsoft/signalr";
import api from "../api/axios";

function ImageCarousel({ files }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === files.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? files.length - 1 : prev - 1));
  };

  if (!files || files.length === 0) return null;

  return (
    <div className="relative group w-full overflow-hidden bg-black flex items-center justify-center min-h-[400px]">
      <img
        src={files[currentIndex].fileUrl}
        alt="issue"
        className="w-full h-full object-contain max-h-[600px]"
      />

      {files.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 p-1 rounded-full bg-white/80 hover:bg-white shadow-md transition-opacity opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 p-1 rounded-full bg-white/80 hover:bg-white shadow-md transition-opacity opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
            {files.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? "bg-blue-500 w-2" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <div className="absolute top-4 right-4 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full">
            {currentIndex + 1}/{files.length}
          </div>
        </>
      )}
    </div>
  );
}

function IssueList() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  /** @type {Record<number, { likeCount: number, likedByMe: boolean, comments: Array<{ id: string, authorName: string, content: string, createdAt: string }> }>} */
  const [socialByIssue, setSocialByIssue] = useState({});
  const [commentDraft, setCommentDraft] = useState({});
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const isCitizen = user?.roles?.includes("Citizen");
  const isStaff = user?.roles?.includes("Staff");

  const fetchCurrentUser = async () => {
    try {
      const data = await currentUser();
      setUser(data);
    } catch (err) {
      console.log("Gabim gjatë marrjes së userit aktual", err);
    }
  };

  const fetchIssues = async () => {
    try {
      const res = await IssueService.getAll();
      setIssues(res.data);
      await loadSocialForIssues(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
    fetchCurrentUser();
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7214/hubs/problems")
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        console.log("SignalR u lidh");

        connection.on("ProblemCreated", (data) => {
          console.log("Realtime issue: ", data);

          fetchIssues();
        });

        connection.on("LikeUpdated", (payload) => {
          const postId = payload.postId;
          setSocialByIssue((prev) => ({
            ...prev,
            [postId]: {
              ...(prev[postId] || {
                likeCount: 0,
                likedByMe: false,
                comments: [],
              }),
              likeCount: payload.likeCount,
            },
          }));
        });

        connection.on("CommentAdded", (payload) => {
          const postId = payload.postId;
          const comment = payload.comment;
          setSocialByIssue((prev) => {
            const cur = prev[postId] || {
              likeCount: 0,
              likedByMe: false,
              comments: [],
            };
            const list = cur.comments || [];
            if (list.some((c) => c.id === comment.id)) return prev;
            return {
              ...prev,
              [postId]: {
                ...cur,
                comments: [...list, comment],
              },
            };
          });
        });
      })
      .catch((err) => console.error("SignalR error: ", err));

    return () => {
      connection.stop();
    };
  }, []);

  const loadSocialForIssues = async (issueList) => {
    if (!issueList?.length) {
      setSocialByIssue({});
      return;
    }
    const map = {};
    await Promise.all(
      issueList.map(async (issue) => {
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
        } catch {
          map[issue.id] = { likeCount: 0, likedByMe: false, comments: [] };
        }
      }),
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
        alert("Duhet të jeni të kyçur për të pëlqyer postimin.");
      } else {
        console.error(err);
      }
    }
  };

  const handleAddComment = async (e, issueId) => {
    e.preventDefault();
    const text = (commentDraft[issueId] || "").trim();
    if (!text) return;
    try {
      await IssueService.addComment(issueId, text);
      setCommentDraft((prev) => ({ ...prev, [issueId]: "" }));
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Duhet të jeni të kyçur për të komentuar.");
      } else {
        console.error(err);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A jeni i sigurt që doni me fshi këtë postim?")) return;

    try {
      await IssueService.delete(id);
      setIssues((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      console.log(err);
      alert("Gabim gjatë fshirjes!");
    }
  };

  //   const handleEdit = (id) => {
  //     navigate(`/edit-issue/${id}`);
  //   };

  if (loading)
    return <p className="text-center mt-10 font-medium">Duke u ngarkuar...</p>;

  return (
    <div className="min-h-screen bg-white md:bg-gray-50 pb-10">
      <div className="max-w-[470px] mx-auto pt-4 space-y-4">
        {issues.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            Nuk ka issues për momentin.
          </p>
        )}

        {issues.map((issue) => (
          <div
            key={issue.id}
            className="bg-white border border-gray-200 md:rounded-sm overflow-hidden"
          >
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[1.5px]">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center border border-white">
                    <span className="text-[10px] font-bold text-gray-600">
                      {issue.komunaName?.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <h2 className="text-sm font-semibold leading-tight">
                    {issue.komunaName}
                  </h2>
                  <p className="text-[11px] text-gray-500">
                    {issue.categoryName}
                  </p>
                </div>
              </div>
              <div className="relative">
                <MoreHorizontal
                  size={18}
                  className="text-gray-500 cursor-pointer"
                  onClick={() =>
                    setOpenMenuId(openMenuId === issue.id ? null : issue.id)
                  }
                />
                {openMenuId === issue.id && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md z-10 overflow-hidden">
                    {isCitizen && (
                      <button
                        onClick={() => navigate(`/issues/${issue.id}/edit`)}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                      >
                        Përditëso
                      </button>
                    )}

                    {isStaff && (
                      <button
                        onClick={() => navigate(`/issues/${issue.id}/status`)}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                      >
                        Përditëso statusin
                      </button>
                    )}

                    {isCitizen && (
                      <button
                        onClick={() => handleDelete(issue.id)}
                        className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <ImageCarousel files={issue.files} />

            <div className="px-3 py-2 space-y-1">
              <p className="text-sm">
                <span className="font-semibold mr-2">{issue.title}</span>
                {issue.description}
              </p>
              <p className="text-[10px] text-gray-400 uppercase tracking-tighter pt-1">
                {new Date(issue.files?.[0]?.createdAt).toLocaleDateString(
                  "sq-AL",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  },
                )}
              </p>
            </div>

            <div className="px-3 pb-3 border-t border-gray-100 pt-2 space-y-2">
              <div className="flex items-center gap-4 text-sm text-gray-700">
                <button
                  type="button"
                  onClick={() => handleToggleLike(issue.id)}
                  className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                  aria-label="Pëlqe"
                >
                  <Heart
                    size={20}
                    className={
                      socialByIssue[issue.id]?.likedByMe
                        ? "fill-red-500 text-red-500"
                        : "text-gray-700"
                    }
                  />
                  <span className="text-xs font-medium tabular-nums">
                    {socialByIssue[issue.id]?.likeCount ?? 0}
                  </span>
                </button>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <MessageCircle size={18} />
                  <span className="text-xs">
                    {socialByIssue[issue.id]?.comments?.length ?? 0} komente
                  </span>
                </div>
              </div>

              <div className="space-y-2 max-h-36 overflow-y-auto">
                {(socialByIssue[issue.id]?.comments || []).map((c) => (
                  <div
                    key={c.id}
                    className="text-xs text-gray-800 leading-snug"
                  >
                    <span className="font-semibold text-gray-900">
                      {c.authorName}
                    </span>
                    <span className="mx-1.5 text-gray-600">{c.content}</span>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleString("sq-AL", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>

              <form
                onSubmit={(e) => handleAddComment(e, issue.id)}
                className="flex gap-2 items-center"
              >
                <input
                  type="text"
                  value={commentDraft[issue.id] || ""}
                  onChange={(e) =>
                    setCommentDraft((prev) => ({
                      ...prev,
                      [issue.id]: e.target.value,
                    }))
                  }
                  placeholder="Shto koment..."
                  className="flex-1 text-xs rounded-md border border-gray-200 px-2 py-1.5 outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="text-xs font-medium text-indigo-600 px-2 py-1 rounded hover:bg-indigo-50"
                >
                  Dërgo
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default IssueList;
