import type { Note } from "../App";
import NoteCard from "./NoteCard";

interface NoteListProps {
  notes: Note[];
  onDelete: (id: number) => void;
}

function NoteList({ notes, onDelete }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <h2 className="mt-10 text-center text-gray-500">
        No notes yet.
      </h2>
    );
  }

  return (
    <div className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default NoteList;