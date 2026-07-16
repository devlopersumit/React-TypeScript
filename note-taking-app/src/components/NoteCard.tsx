import type { Note } from "../App";

interface NoteCardProps {
  note: Note;
  onDelete: (id: number) => void;
}

function NoteCard({ note, onDelete }: NoteCardProps) {
  return (
    <div className="rounded-xl bg-white p-5 shadow">

      <h2 className="mb-2 text-xl font-bold">
        {note.title}
      </h2>

      <p className="mb-4 text-gray-700">
        {note.content}
      </p>

      <button
        onClick={() => onDelete(note.id)}
        className="rounded bg-red-500 px-4 py-2 text-white"
      >
        Delete
      </button>

    </div>
  );
}

export default NoteCard;