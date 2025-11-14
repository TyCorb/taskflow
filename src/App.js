import React, { useState, useEffect } from "react";
import { Reorder, motion, AnimatePresence } from "framer-motion";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(true);

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`min-h-screen flex flex-col items-center pt-10 px-2 transition-colors duration-700 ${
        darkMode
          ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-50"
          : "bg-gradient-to-b from-gray-100 via-gray-200 to-gray-100 text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center w-80 mb-6">
        <h1 className="text-3xl font-bold">TaskFlow</h1>
        <motion.button
          onClick={() => setDarkMode(!darkMode)}
          whileTap={{ scale: 0.9, rotate: 10 }}
          className="px-3 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 dark:bg-gray-200 dark:text-black transition-colors duration-300"
        >
          {darkMode ? "☀️" : "🌙"}
        </motion.button>
      </div>

      {/* Add Task Form */}
      <form onSubmit={addTask} className="flex gap-2 mb-6">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a task..."
          className="px-4 py-2 rounded-md w-64 text-gray-900 dark:text-gray-50 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 px-4 py-2 rounded-md text-white transition-colors duration-300"
        >
          Add
        </button>
      </form>

      {/* Clear Completed */}
      <button
        onClick={clearCompleted}
        className="bg-red-600 hover:bg-red-700 active:bg-red-800 px-4 py-2 rounded-md mb-4 text-white transition-colors duration-300"
      >
        Clear Completed
      </button>

      {/* Drag-and-Drop Task List */}
      <Reorder.Group
        axis="y"
        values={tasks}
        onReorder={setTasks}
        className="w-80 space-y-3"
      >
        <AnimatePresence>
          {tasks.map((task) => (
            <Reorder.Item
              key={task.id}
              value={task}
              className={`flex flex-col px-4 py-3 rounded-md shadow-md transition-all duration-500 ${
                darkMode ? "bg-gray-800 text-gray-50" : "bg-white text-gray-900"
              }`}
              whileHover={{
                scale: 1.015,
                boxShadow: "0px 6px 18px rgba(0,0,0,0.15)",
              }}
              whileTap={{ scale: 0.975 }}
              whileDrag={{
                scale: 1.05,
                boxShadow: "0px 10px 28px rgba(0,0,0,0.25)",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <div className="flex justify-between items-center">
                  <span
                    onClick={() => toggleTask(task.id)}
                    className={`cursor-pointer ${
                      task.completed
                        ? "line-through text-gray-500"
                        : darkMode
                        ? "text-gray-200"
                        : "text-gray-900"
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
              </motion.div>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </motion.div>
  );
}

export default App;
