import { useState } from "react";

export default function CommentForm({ value, setValue, onSubmit }) {
  const [text, setText] = useState(value);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(text);
        setText("");
      }}
      className="flex gap-2 px-3 pb-3"
    >
      <input
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setValue(e.target.value);
        }}
        className="border flex-1 text-xs"
        placeholder="Shto koment..."
      />

      <button type="submit">Send</button>
    </form>
  );
}
