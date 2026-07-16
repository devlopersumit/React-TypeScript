import { ChangeEvent, useState } from "react";

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNote: (note: { title: string; content: string }) => void;
}

function AddNoteModal({
  isOpen,
  onClose,
  onAddNote,
}: AddNoteModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;

    onAddNote({
      title,
      content,
    });

    setTitle("");
    setContent("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="w-[500px] rounded-xl bg-white p-6">

        <h1 className="mb-5 text-2xl font-bold">
          Add Note
        </h1>

        <input
          className="mb-4 w-full rounded border p-2"
          placeholder="Title"
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
        />

        <textarea
          className="mb-4 h-40 w-full rounded border p-2"
          placeholder="Content"
          value={content}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setContent(e.target.value)
          }
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="rounded bg-gray-300 px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Add Note
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddNoteModal;