import { useState, useEffect } from "react"

// Define a structured object type for tasks
interface Task {
  id: string; // Using a unique ID prevents bugs when tasks have identical names
  text: string;
  isCompleted: boolean;
}

function App() {
  // Initialize state with data from localStorage, or an empty array if none exists
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("todo_tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [error, setError] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null); // Track by unique ID instead of index

  // Automatically save to localStorage whenever the tasks array changes
  useEffect(() => {
    localStorage.setItem("todo_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e: React.FormEvent): void => {
    e.preventDefault();

    if (!inputValue.trim()) {
      setError("Please Enter Valid Task");
      return;
    }

    if (editingId !== null) {
      // --- EDIT MODE ---
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === editingId ? { ...task, text: inputValue } : task))
      );
      setEditingId(null);
    } else {
      // --- ADD MODE ---
      const newTask: Task = {
        id: crypto.randomUUID(), // Generates a safe, unique random ID string
        text: inputValue,
        isCompleted: false
      };
      setTasks((prevTask) => [...prevTask, newTask]);
    }

    setError("");
    setInputValue("");
  };

  const handleDeleteTask = (idToDelete: string): void => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== idToDelete));
    
    if (editingId === idToDelete) {
      setEditingId(null);
      setInputValue("");
    }
  };

  const handleEditTask = (taskToEdit: Task): void => {
    setInputValue(taskToEdit.text);
    setEditingId(taskToEdit.id);
    setError("");
  };

  const handleCancelEdit = (): void => {
    setEditingId(null);
    setInputValue("");
    setError("");
  };

  // --- TOGGLE COMPLETION LOGIC ---
  const handleToggleComplete = (idToToggle: string): void => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === idToToggle ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  return (
    <>
      <div className="w-full min-h-screen pt-24 bg-gray-100 flex justify-center items-start px-4">
        <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Task Manager</h1>

          <form onSubmit={handleAddTask} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter the task..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-gray-50 placeholder-gray-400"
            />
            
            <button
              type="submit"
              className={`px-5 py-2 text-white font-medium rounded-xl transition-colors duration-200 cursor-pointer ${
                editingId !== null 
                  ? "bg-amber-500 hover:bg-amber-600" 
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {editingId !== null ? "Update" : "Add Task"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-xl transition-colors duration-200 cursor-pointer"
              >
                Cancel
              </button>
            )}
          </form>

          {error && (
            <p className="text-red-500 text-sm mt-2 ml-1 font-medium">{error}</p>
          )}

          {/* Task List */}
          <ul className="mt-6 space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`px-4 py-3 border rounded-xl flex justify-between items-center transition-all ${
                  editingId === task.id 
                    ? "bg-amber-50 border-amber-300 ring-2 ring-amber-200" 
                    : task.isCompleted 
                      ? "bg-gray-50/50 border-gray-200 opacity-60" 
                      : "bg-gray-50 border-gray-100"
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Styled Checkbox input element */}
                  <input 
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => handleToggleComplete(task.id)}
                    className="w-5 h-5 accent-blue-600 rounded cursor-pointer transition-transform active:scale-95"
                  />
                  
                  {/* Conditional Styling: Strikethrough applied via Tailwind if isCompleted is true */}
                  <span 
                    className={`flex-1 font-medium truncate cursor-pointer select-none ${
                      task.isCompleted 
                        ? "text-gray-400 line-through decoration-gray-400 decoration-2" 
                        : "text-gray-800"
                    }`}
                    onClick={() => handleToggleComplete(task.id)}
                  >
                    {task.text}
                  </span>
                </div>

                <div className="flex gap-3 ml-4">
                  <button 
                    className="px-3 py-1 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" 
                    onClick={() => handleEditTask(task)}
                    disabled={editingId !== null || task.isCompleted}
                  >
                    Edit
                  </button>
                  <button 
                    className="px-3 py-1 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors duration-200 cursor-pointer" 
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {tasks.length === 0 && (
            <p className="text-center text-gray-400 text-sm mt-8 font-medium">No tasks recorded yet!</p>
          )}

        </div>
      </div>
    </>
  )
}

export default App
