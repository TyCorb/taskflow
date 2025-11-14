import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(true); // theme toggle

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newTask = {
      id: Date.now(),
      text: input,
      completed: false,
      createdAt: new Date().toLocaleString(),
    };

    setTasks([...tasks, newTask]);
    setInput("");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center pt-10 transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="flex justify-between items-center w-80 mb-6">
        <h1 className="text-3xl font-bold">TaskFlow</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 dark:bg-gray-200 dark:text-black"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      <form onSubmit={addTask} className="flex gap-2 mb-6">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a task..."
          className="px-4 py-2 rounded-md text-black w-64"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white"
        >
          Add
        </button>
      </form>

      <button
        onClick={clearCompleted}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md mb-4"
      >
        Clear Completed
      </button>

      <ul className="w-80 space-y-3">
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.li
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.2 }}
              className={`flex flex-col px-4 py-3 rounded-md shadow-md ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center">
                <span
                  onClick={() => toggleTask(task.id)}
                  className={`cursor-pointer ${
                    task.completed
                      ? "line-through text-gray-500"
                      : "text-gray-200 dark:text-gray-900"
                  }`}
                >
                  {task.text}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {task.createdAt}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

export default App;
