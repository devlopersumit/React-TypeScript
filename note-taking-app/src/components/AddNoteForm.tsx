import { useState, ChangeEvent } from "react";

function AddNoteForm() {
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");

    const handleTitle = (e: ChangeEvent<HTMLInputElement>): void => {
        setTitle(e.target.value);
    }

    const handleContent = (e: ChangeEvent<HTMLTextAreaElement>): void => {
        setContent(e.target.value);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">
                        Create New Note
                    </h1>

                    <form className="space-y-6">
                        {/* Title Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Note Title
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your notes title..."
                                value={title}
                                onChange={handleTitle}
                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none transition-colors duration-200 text-gray-900 placeholder-gray-500"
                            />
                        </div>

                        {/* Content Textarea */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Note Content
                            </label>
                            <textarea
                                placeholder="Enter your note content..."
                                value={content}
                                onChange={handleContent}
                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none transition-colors duration-200 text-gray-900 placeholder-gray-500 min-h-40 sm:min-h-56 resize-none"
                            />
                        </div>

                        {/* Character Count */}
                        <div className="text-right text-sm text-gray-500">
                            {content.length} characters
                        </div>

                        {/* Submit Button */}
                        <button
                            type="button"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:shadow-lg active:scale-95"
                        >
                            Add Note
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddNoteForm;