import { AlertCircle } from "lucide-react";

export default function ErrorBanner({ error }) {
  if (!error) return null;

  return (
    <div className="mb-6 flex items-center gap-2 text-red-500 bg-red-50 p-4 rounded-lg border">
      <AlertCircle size={16} />
      {error}
    </div>
  );
}
