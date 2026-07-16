import { useState } from "react";
import Navbar from "./components/Navbar";
import AddNoteModal from "./components/AddNoteModal";
import NoteList from "./components/NoteList";

export interface Note {
  id: number;
  title: string;
  content: string;
}

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showForm, setShowForm] = useState(false);

  const handleAddNote = (note: Omit<Note, "id">) => {
    const newNote: Note = {
      id: Date.now(),
      ...note,
    };

    setNotes((prev) => [...prev, newNote]);
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onOpenModal={() => setShowForm(true)} />

      <AddNoteModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onAddNote={handleAddNote}
      />

      <NoteList notes={notes} onDelete={handleDelete} />
    </div>
  );
}

export default App;