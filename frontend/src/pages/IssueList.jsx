import { useEffect, useState } from "react";
import { IssueService } from "../services/issueServices";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const res = await IssueService.getAll();
      setIssues(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
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
                  <div className="absolute right-0 mt-2 w-28 bg-white border rounded-lg shadow-md z-10">
                    {/* <button
                      onClick={() => handleEdit(issue.id)}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      Edit
                    </button> */}

                    <button
                      onClick={() => handleDelete(issue.id)}
                      className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default IssueList;
