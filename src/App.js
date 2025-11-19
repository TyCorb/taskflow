import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function App() {
  // ----------------------------
  // LOAD TASKS FROM LOCAL STORAGE
  // ----------------------------
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const [taskText, setTaskText] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // ----------------------------
  // LIGHT / DARK MODE
  // ----------------------------
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("themeMode");
    if (saved === "dark") return true;
    if (saved === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("themeMode", darkMode ? "dark" : "light");
  }, [darkMode]);

  // ----------------------------
  // COLOR THEMES
  // ----------------------------
  const [theme, setTheme] = useState(
    localStorage.getItem("colorTheme") || "default"
  );

  // NEW: hover theme preview
  const [hoverTheme, setHoverTheme] = useState(null);

  const themeClasses = {
    default: "bg-gray-100 dark:bg-gray-900",
    forest: "bg-green-100 dark:bg-green-900",
    ocean: "bg-blue-100 dark:bg-blue-900",
    coffee: "bg-amber-100 dark:bg-amber-900",
    sunset: "bg-orange-100 dark:bg-orange-900",
    modern1: "bg-purple-100 dark:bg-purple-900",
    modern2: "bg-indigo-100 dark:bg-indigo-900",
    modern3: "bg-teal-100 dark:bg-teal-900",
    modern4: "bg-rose-100 dark:bg-rose-900",
  };

  const themeSwatches = [
    { id: "default", color: "bg-gray-400" },
    { id: "forest", color: "bg-green-600" },
    { id: "ocean", color: "bg-blue-600" },
    { id: "coffee", color: "bg-amber-700" },
    { id: "sunset", color: "bg-orange-500" },
    { id: "modern1", color: "bg-purple-600" },
    { id: "modern2", color: "bg-indigo-600" },
    { id: "modern3", color: "bg-teal-600" },
    { id: "modern4", color: "bg-rose-600" },
  ];

  const selectTheme = (id) => {
    setTheme(id);
    localStorage.setItem("colorTheme", id);
  };

  // ----------------------------

  const addTask = () => {
    if (!taskText.trim()) return;

    setTasks([
      ...tasks,
      {
        id: crypto.randomUUID(),
        text: taskText,
        completed: false,
        createdAt: new Date().toLocaleString(),
        dueDate: new Date().toISOString().split("T")[0],
      },
    ]);

    setTaskText("");
  };

  const toggleTask = (id) =>
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, text: editText } : t)));
    setEditingId(null);
  };

  const filtered = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = [...tasks];
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setTasks(items);
  };

  const badgeFor = (task) => {
    const today = new Date().toISOString().split("T")[0];
    if (task.dueDate === today) return "Due Today";
    if (task.dueDate < today) return "Overdue";
    return null;
  };

  return (
    <div
      className={`
        min-h-screen flex flex-col items-center p-8 
        text-gray-900 dark:text-gray-100
        transition-colors duration-300
        ${themeClasses[hoverTheme || theme]}
      `}
    >
      {/* HEADER */}
      <div className="w-full max-w-xl flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Task Manager</h1>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 
                     text-black dark:text-white transition"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* THEME SELECTOR */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {themeSwatches.map(({ id, color }) => (
          <button
            key={id}
            onClick={() => selectTheme(id)}
            onMouseEnter={() => setHoverTheme(id)}
            onMouseLeave={() => setHoverTheme(null)}
            className={`
              w-10 h-10 rounded-full border-2 
              ${color} 
              ${theme === id ? "ring-4 ring-white dark:ring-black" : "opacity-80"}
              transition transform hover:scale-125
            `}
            title={id}
          />
        ))}
      </div>

      {/* ADD TASK */}
      <div className="flex gap-2 mb-6 w-full max-w-xl">
        <input
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          className="border p-2 rounded w-full bg-white dark:bg-gray-800
                     border-gray-300 dark:border-gray-700"
          placeholder="New task..."
        />
        <button
          onClick={addTask}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-3 mb-4">
        {["all", "active", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`
              px-3 py-1 rounded transition 
              ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
              }
            `}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* TASK LIST */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul
              className="w-full max-w-xl space-y-3"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {filtered.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`p-4 rounded shadow bg-white dark:bg-gray-800
                                  transition-colors duration-200 ${
                                    snapshot.isDragging
                                      ? "scale-[1.02] will-change-transform"
                                      : ""
                                  }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          {...provided.dragHandleProps}
                          className="cursor-grab pr-3"
                        >
                          ⋮⋮
                        </span>

                        {editingId === task.id ? (
                          <input
                            className="border p-1 rounded w-full bg-white dark:bg-gray-700"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onBlur={() => saveEdit(task.id)}
                            autoFocus
                          />
                        ) : (
                          <span
                            onClick={() => startEditing(task)}
                            className={`flex-1 cursor-pointer ${
                              task.completed ? "line-through text-gray-400" : ""
                            }`}
                          >
                            {task.text}
                          </span>
                        )}

                        <div className="flex gap-2 pl-2">
                          <button onClick={() => toggleTask(task.id)}>
                            {task.completed ? "↺" : "✔"}
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-red-500"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      <div className="text-xs text-gray-400 mt-2 flex justify-between">
                        <span>{task.createdAt}</span>

                        {badgeFor(task) && (
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              badgeFor(task) === "Overdue"
                                ? "bg-red-300 dark:bg-red-800 text-red-900 dark:text-red-300"
                                : "bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200"
                            }`}
                          >
                            {badgeFor(task)}
                          </span>
                        )}
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
