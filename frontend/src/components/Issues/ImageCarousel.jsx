import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
export default function ImageCarousel({ files }) {
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
