import { useEffect, useState } from "react";
import { eventService } from "../services/eventService";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as signalR from "@microsoft/signalr";

function ImageCarousel({ files }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!files || files.length === 0) return null;

  return (
    <div className="relative group w-full overflow-hidden bg-black flex items-center justify-center min-h-[400px]">
      <img
        src={files[currentIndex].fileUrl}
        alt="event"
        className="w-full h-full object-contain max-h-[600px]"
      />
      {files.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((p) => (p === 0 ? files.length - 1 : p - 1))}
            className="absolute left-2 p-1 rounded-full bg-white/80 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentIndex((p) => (p === files.length - 1 ? 0 : p + 1))}
            className="absolute right-2 p-1 rounded-full bg-white/80 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute top-4 right-4 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full">
            {currentIndex + 1}/{files.length}
          </div>
        </>
      )}
    </div>
  );
}

const REACTIONS = [
  { type: 1, emoji: "🎉", label: "Emocionues", key: "Exciting" },
  { type: 2, emoji: "❤️", label: "Pelqej",     key: "Love" },
  { type: 3, emoji: "👍", label: "Mbeshtetes", key: "Support" },
  { type: 4, emoji: "🔥", label: "Shume mire", key: "Fire" },
];

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reactions, setReactions] = useState({});

const loadReactions = async (eventsList) => {
  const map = {};
  await Promise.all(
    eventsList.map(async (ev) => {
      try {
        const res = await eventService.getReactions(ev.id);
        // ✅ Shto kete per me pa keys saktesisht
        console.log("ReactionCounts keys:", Object.keys(res.data.reactionCounts));
        map[ev.id] = res.data;
      } catch {
        map[ev.id] = { totalReactions: 0, myReaction: null, reactionCounts: {} };
      }
    })
  );
  setReactions(map);
};

  const fetchEvents = async () => {
    try {
      const res = await eventService.getAll();
      const published = res.data.filter((e) => e.status === 1);
      setEvents(published);
      await loadReactions(published);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (eventId, reactionType) => {
    try {
      const res = await eventService.toggleReaction(eventId, reactionType);
      setReactions((prev) => ({ ...prev, [eventId]: res.data.summary }));
    } catch (err) {
      if (err.response?.status === 401) alert("Duhet të jeni të kyçur.");
      else alert(err.response?.data || "Gabim gjatë reagimit.");
    }
  };

  useEffect(() => {
    fetchEvents();

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7214/hubs/events")
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        console.log("SignalR Events u lidh");

        const komunaId = localStorage.getItem("komunaId");
        if (komunaId) {
          connection.invoke("JoinKomunaGroup", komunaId);
        }

        connection.on("EventPublished", (data) => {
          console.log("Event i ri u publikua:", data);
          fetchEvents();
        });

        connection.on("EventVoteUpdated", (data) => {
          setEvents((prev) =>
            prev.map((ev) =>
              ev.id === data.eventId ? { ...ev, voteCount: data.voteCount } : ev
            )
          );
        });

        connection.on("EventWinnerAnnounced", (data) => {
          alert(`🏆 ${data.message}`);
          fetchEvents();
        });
      })
      .catch((err) => console.error("SignalR error:", err));

    return () => connection.stop();
  }, []);

  if (loading)
    return <p className="text-center mt-10 font-medium">Duke u ngarkuar...</p>;

  return (
    <div className="min-h-screen bg-white md:bg-gray-50 pb-10">
      <div className="max-w-[470px] mx-auto pt-4 space-y-4">
        {events.length === 0 && (
          <p className="text-center text-gray-400 mt-20">
            Nuk ka evente të publikuara.
          </p>
        )}

        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white border border-gray-200 md:rounded-sm overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-purple-600 p-[1.5px]">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <span className="text-[10px] font-bold text-gray-600">
                      {event.komunaName?.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <h2 className="text-sm font-semibold leading-tight">
                    {event.komunaName}
                  </h2>
                  <p className="text-[11px] text-gray-500">{event.location}</p>
                </div>
              </div>
              <span className="text-[11px] text-gray-400">
                {new Date(event.eventDate).toLocaleDateString("sq-AL", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Foto */}
            <ImageCarousel files={event.files} />

            {/* Info */}
            <div className="px-3 py-2 space-y-1">
              <p className="text-sm">
                <span className="font-semibold mr-2">{event.title}</span>
                {event.description}
              </p>
            </div>

            {/* Reactions */}
            <div className="px-3 pb-3 border-t border-gray-100 pt-2">
              <div className="flex items-center gap-2 flex-wrap">
                {REACTIONS.map((r) => (
                  <button
                    key={r.type}
                    onClick={() => handleReaction(event.id, r.type)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs transition-all ${
                      reactions[event.id]?.myReaction === r.type
                        ? "bg-blue-100 text-blue-700 font-semibold scale-105"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <span>{r.emoji}</span>
                    <span>
  {reactions[event.id]?.reactionCounts?.[r.key] ?? 0}
</span>
                  </button>
                ))}
              </div>

              {/* Total reactions */}
              {reactions[event.id]?.totalReactions > 0 && (
                <p className="text-[10px] text-gray-400 mt-2">
                  {reactions[event.id].totalReactions} reagime gjithsej
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventList;