import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

interface Note {
    id: number;
    title: string;
    content: string;
    createdAt: string;
}

interface NoteFormData {
    title: string;
    content: string;
}

interface FormErrors {
    title?: string;
    content?: string;
}

const sanitizeInput = (value: string) =>
    value.replace(/[\u0000-\u001f\u007f]/g, "");

const validateField = (name: keyof NoteFormData, value: string) => {
    const cleanedValue = sanitizeInput(value);

    if (name === "title") {
        if (!cleanedValue.trim()) {
            return "Title is required.";
        }
        if (cleanedValue.trim().length < 2) {
            return "Title must be at least 2 characters long.";
        }
        return "";
    }

    if (name === "content") {
        if (!cleanedValue.trim()) {
            return "Content is required.";
        }
        if (cleanedValue.trim().length < 5) {
            return "Content must be at least 5 characters long.";
        }
        return "";
    }

    return "";
};

const validateForm = (data: NoteFormData) => {
    const nextErrors: FormErrors = {};

    (Object.keys(data) as Array<keyof NoteFormData>).forEach((field) => {
        const error = validateField(field, data[field]);
        if (error) {
            nextErrors[field] = error;
        }
    });

    return nextErrors;
};

const normalizeNote = (item: any): Note => ({
    id: item?.id ?? item?._id ?? 0,
    title: item?.title ?? "",
    content: item?.content ?? "",
    createdAt: item?.createdAt ?? item?.created_at ?? item?.updatedAt ?? item?.updated_at ?? "",
});

const requestNoteEndpoint = async (method: "get" | "post" | "put" | "delete", path: string, data?: Record<string, unknown> | NoteFormData) => {
    const attempts = [path, path.replace(/\/$/, "")];

    for (const attempt of attempts) {
        try {
            if (method === "get") {
                const response = await api.get(attempt);
                return response.data;
            }
            if (method === "post") {
                const response = await api.post(attempt, data);
                return response.data;
            }
            if (method === "put") {
                const response = await api.put(attempt, data);
                return response.data;
            }
            const response = await api.delete(attempt);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                continue;
            }
            throw error;
        }
    }

    throw new Error("Unable to reach notes API");
};

export function Notes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [form, setForm] = useState<NoteFormData>({ title: "", content: "" });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [message, setMessage] = useState("");

    const loadNotes = async () => {
        setLoading(true);
        setMessage("");

        try {
            const response = await requestNoteEndpoint("get", "/notes");
            const items = Array.isArray(response) ? response : response?.notes ?? response?.data ?? [];
            setNotes(items.map(normalizeNote));
        } catch {
            setMessage("Unable to load notes from the database.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadNotes();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const fieldName = name as keyof NoteFormData;
        const sanitizedValue = sanitizeInput(value);

        setForm((prev) => ({ ...prev, [fieldName]: sanitizedValue }));
        setErrors((prev) => ({
            ...prev,
            [fieldName]: validateField(fieldName, sanitizedValue),
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const sanitizedForm: NoteFormData = {
            title: sanitizeInput(form.title),
            content: sanitizeInput(form.content),
        };

        const validationErrors = validateForm(sanitizedForm);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            if (editingId) {
                const response = await requestNoteEndpoint("put", `/notes/${editingId}`, sanitizedForm);
                const updatedNote = normalizeNote(response?.note ?? response?.data ?? response);
                setNotes((prev) => prev.map((note) => (note.id === updatedNote.id ? updatedNote : note)));
                setMessage("Note updated.");
            } else {
                const response = await requestNoteEndpoint("post", "/notes", sanitizedForm);
                const createdNote = normalizeNote(response?.note ?? response?.data ?? response);
                setNotes((prev) => [createdNote, ...prev]);
                setMessage("Note created.");
            }

            setForm({ title: "", content: "" });
            setErrors({});
            setEditingId(null);
        } catch {
            setMessage("The request could not be completed.");
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (note: Note) => {
        setEditingId(note.id);
        setForm({ title: note.title, content: note.content });
        setErrors({});
        setMessage("");
    };

    const removeNote = async (id: number) => {
        setLoading(true);
        setMessage("");

        try {
            await requestNoteEndpoint("delete", `/notes/${id}`);
            setNotes((prev) => prev.filter((note) => note.id !== id));
            setMessage("Note deleted.");
        } catch {
            setMessage("Unable to delete the note.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f7f7] px-4 py-8 text-[#1a1a1a]">
            <div className="mx-auto flex max-w-5xl flex-col gap-6">
                <div className="flex flex-col gap-2 rounded-lg border border-[#e5e5e5] bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Your notes</h1>
                        <p className="mt-1 text-sm text-[#737373]">Create and manage your notes in one place.</p>
                    </div>
                    <Link
                        to="/login"
                        className="rounded-md border border-[#d4d4d4] px-3 py-2 text-sm font-medium text-[#111111] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f5f5f5] hover:shadow-sm"
                    >
                        Log out
                    </Link>
                </div>

                <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
                    <form onSubmit={handleSubmit} className="rounded-lg border border-[#e5e5e5] bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
                        <h2 className="text-lg font-semibold">{editingId ? "Edit note" : "Add a note"}</h2>
                        <p className="mt-1 text-sm text-[#737373]">Keep it short and clear.</p>

                        <div className="mt-4 space-y-4">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="title" className="text-sm font-medium text-[#404040]">
                                    Title
                                </label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    maxLength={60}
                                    value={form.title}
                                    onChange={handleChange}
                                    className={`w-full rounded-md border bg-white px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-[#171717] focus:shadow-sm ${errors.title ? "border-red-500" : "border-[#d4d4d4]"}`}
                                />
                                {errors.title ? <p className="text-xs text-red-600">{errors.title}</p> : null}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="content" className="text-sm font-medium text-[#404040]">
                                    Content
                                </label>
                                <textarea
                                    id="content"
                                    name="content"
                                    rows={5}
                                    maxLength={500}
                                    value={form.content}
                                    onChange={handleChange}
                                    className={`w-full rounded-md border bg-white px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-[#171717] focus:shadow-sm ${errors.content ? "border-red-500" : "border-[#d4d4d4]"}`}
                                />
                                {errors.content ? <p className="text-xs text-red-600">{errors.content}</p> : null}
                            </div>
                        </div>

                        {message ? <p className="mt-4 text-sm text-[#404040]">{message}</p> : null}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 w-full cursor-pointer rounded-md bg-[#171717] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#262626] hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading ? "Saving..." : editingId ? "Update note" : "Save note"}
                        </button>

                        {editingId ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingId(null);
                                    setForm({ title: "", content: "" });
                                    setErrors({});
                                    setMessage("");
                                }}
                                className="mt-3 w-full cursor-pointer rounded-md border border-[#d4d4d4] px-4 py-2 text-sm font-medium text-[#404040] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f5f5f5] hover:shadow-sm"
                            >
                                Cancel edit
                            </button>
                        ) : null}
                    </form>

                    <div className="space-y-4">
                        {loading && notes.length === 0 ? (
                            <div className="rounded-lg border border-[#e5e5e5] bg-white p-8 text-center shadow-sm">
                                <p className="text-sm text-[#737373]">Loading notes...</p>
                            </div>
                        ) : notes.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-[#d4d4d4] bg-white p-8 text-center shadow-sm">
                                <p className="text-sm font-medium text-[#404040]">No notes yet.</p>
                                <p className="mt-1 text-sm text-[#737373]">Add your first note to get started.</p>
                            </div>
                        ) : (
                            notes.map((note) => (
                                <article key={note.id} className="rounded-lg border border-[#e5e5e5] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="text-base font-semibold">{note.title}</h3>
                                            <p className="mt-1 text-xs text-[#737373]">{note.createdAt || "Saved in database"}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => startEdit(note)}
                                                className="cursor-pointer rounded-md px-2 py-1 text-sm font-medium text-[#111111] transition-all duration-200 hover:bg-[#f5f5f5] hover:shadow-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => void removeNote(note.id)}
                                                className="cursor-pointer rounded-md px-2 py-1 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50 hover:shadow-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#404040]">{note.content}</p>
                                </article>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
