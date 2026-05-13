import { useEffect, useState, useCallback } from "react"; //
import * as signalR from "@microsoft/signalr";
import { ThumbsUp, ThumbsDown, Edit2Icon, EditIcon } from "lucide-react";
import { ProposalService } from "../services/proposalService";
import { ProposalVoteService } from "../services/voteService";
import { currentUser } from "../services/authService";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

function ProposalsList() {
  const [proposals, setProposals] = useState([]);
  const [votesByProposal, setVotesByProposal] = useState({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const navigate = useNavigate();

  const isCitizen =
    user?.role === "Citizen" || user?.roles?.includes("Citizen");

  const isStaff = user?.role === "Staff" || user?.roles?.includes("Staff");

  useEffect(() => {
    const testUser = async () => {
      try {
        const user = await currentUser();

        console.log("USER AKTUAL NGA /auth/me:", user);

        setUser(user);
      } catch (err) {
        console.error("GABIM /auth/me:", err);
      }
    };

    testUser();
  }, []);

  useEffect(() => {
    if (proposals.length > 0) {
      setVotesByProposal({});
      loadVotesForProposals(proposals);
    }
  }, [user]);

  useEffect(() => {
    fetchProposals();

    const votesConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7214/hubs/votat")
      .withAutomaticReconnect()
      .build();

    votesConnection.on("VotimiUkrye", () => {
      fetchProposals();
    });

    votesConnection.start().catch((err) => {
      console.error("SignalR votes error:", err);
    });

    const proposalsConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7214/hubs/proposals")
      .withAutomaticReconnect()
      .build();

    proposalsConnection.on("PropozimiPublikohet", () => {
      fetchProposals();
    });

    proposalsConnection.start().catch((err) => {
      console.error("SignalR proposals error:", err);
    });

    return () => {
      votesConnection.off("VotimiUkrye");
      votesConnection.stop();

      proposalsConnection.off("PropozimiPublikohet");
      proposalsConnection.stop();
    };
  }, []);

  const fetchProposals = async () => {
    try {
      const res = await ProposalService.getAll();
      setProposals(res.data);
      await loadVotesForProposals(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await ProposalService.delete(id);

      setProposals((prev) => prev.filter((proposal) => proposal.id !== id));
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const loadVotesForProposals = useCallback(async (proposalList) => {
    const map = {};
    await Promise.all(
      proposalList.map(async (proposal) => {
        try {
          const res = await ProposalVoteService.getVotes(proposal.id);
          map[proposal.id] = res.data;
        } catch {
          map[proposal.id] = {
            forVotes: 0,
            againstVotes: 0,
            totalVotes: 0,
            myVote: null,
            hasVoted: false,
          };
        }
      }),
    );
    setVotesByProposal(map);
  }, []);

  const handleVote = async (projectProposalId, voteType) => {
    try {
      await ProposalVoteService.vote(projectProposalId, voteType);

      const res = await ProposalVoteService.getVotes(projectProposalId);

      setVotesByProposal((prev) => ({
        ...prev,
        [projectProposalId]: res.data,
      }));
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.response?.data?.Message ||
          "Gabim gjatë votimit.",
      );
    }
  };

  if (loading) {
    return <p className="text-center mt-10 font-medium">Duke u ngarkuar...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="max-w-[700px] mx-auto pt-5 space-y-5">
        {proposals.map((proposal) => {
          const voteInfo = votesByProposal[proposal.id];

          return (
            <div
              key={proposal.id}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-visible relative"
            >
              {proposal.files?.length > 0 && (
                <img
                  src={proposal.files[0].fileUrl}
                  alt="proposal"
                  className="w-full h-[300px] object-cover rounded-t-2xl"
                />
              )}

              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3 relative">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {proposal.title}
                  </h2>

                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                      {proposal.status}
                    </span>

                    {!isCitizen && (
                      <div className="relative">
                        <button
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === proposal.id ? null : proposal.id,
                            )
                          }
                          className="p-2 rounded-full hover:bg-gray-100 transition"
                        >
                          <MoreHorizontal size={22} className="text-gray-700" />
                        </button>

                        {openMenuId === proposal.id && isStaff && (
                          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                            <button
                              onClick={() => handleDelete(proposal.id)}
                              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                            >
                              <Trash2 size={16} />
                              Fshij
                            </button>

                            <button
                              onClick={() =>
                                navigate(
                                  `/project-proposals/edit/${proposal.id}`,
                                )
                              }
                              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 transition"
                            >
                              <EditIcon size={16} />
                              Perditeso
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {proposal.description}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Buxheti</p>
                    <p className="font-semibold text-gray-800">
                      € {proposal.budget}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">
                      Afati i votimit
                    </p>
                    <p className="font-semibold text-gray-800">
                      {new Date(proposal.votingDeadline).toLocaleDateString(
                        "sq-AL",
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-4">
                  {isCitizen ? (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleVote(proposal.id, 1)}
                        disabled={voteInfo?.hasVoted}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition
                        ${
                          voteInfo?.myVote === 1
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700"
                        }
                        ${
                          voteInfo?.hasVoted
                            ? "cursor-not-allowed opacity-70"
                            : ""
                        }
                      `}
                      >
                        <ThumbsUp size={18} />
                        Pro
                        <span>{voteInfo?.forVotes ?? 0}</span>
                      </button>

                      <button
                        onClick={() => handleVote(proposal.id, 2)}
                        disabled={voteInfo?.hasVoted}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition
                        ${
                          voteInfo?.myVote === 2
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-700"
                        }
                        ${
                          voteInfo?.hasVoted
                            ? "cursor-not-allowed opacity-70"
                            : ""
                        }
                      `}
                      >
                        <ThumbsDown size={18} />
                        Kundër
                        <span>{voteInfo?.againstVotes ?? 0}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-4 text-sm">
                      <span className="text-green-700 font-medium">
                        Pro: {voteInfo?.forVotes ?? 0}
                      </span>

                      <span className="text-red-700 font-medium">
                        Kundër: {voteInfo?.againstVotes ?? 0}
                      </span>
                    </div>
                  )}

                  <p className="text-xs text-gray-500">
                    Totali: {voteInfo?.totalVotes ?? 0} vota
                  </p>
                </div>

                {isCitizen && voteInfo?.hasVoted && (
                  <p className="text-xs text-gray-500">
                    Ju keni votuar{" "}
                    <strong>{voteInfo.myVote === 1 ? "Pro" : "Kundër"}</strong>.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProposalsList;
