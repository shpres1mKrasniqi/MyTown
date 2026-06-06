import { useState } from "react";

export default function CommentForm({ value, setValue, onSubmit }) {
  const [text, setText] = useState(value);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (text?.trim()) {
          onSubmit(text);
          setText("");
          setValue("");
        }
      }}
      className="flex gap-2 px-3 pb-3 border-t border-gray-100 pt-2 mt-1"
    >
      <input
        value={text || ""}
        onChange={(e) => {
          setText(e.target.value);
          setValue(e.target.value);
        }}
        className="flex-1 text-sm outline-none placeholder-gray-400 bg-transparent"
        placeholder="Shto koment..."
      />
      
      {text?.trim() && (
        <button type="submit" className="text-sm font-semibold text-blue-500 hover:text-blue-700">
          Posto
        </button>
      )}
    </form>
  );
}
