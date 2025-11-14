import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  // Pastel gradient colors for light mode
  const pastelColors = [
    "from-pink-100 via-pink-200 to-pink-100",
    "from-blue-100 via-blue-200 to-blue-100",
    "from-green-100 via-green-200 to-green-100",
    "from-purple-100 via-purple-200 to-purple-100",
    "from-yellow-100 via-yellow-200 to-yellow-100",
  ];

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

  // Handle drag end for Hello Pangea DnD
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newTasks = Array.from(tasks);
    const [movedTask] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, movedTask);
    setTasks(newTasks);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`min-h-screen flex flex-col items-center pt-10 px-2 transition-colors duration-700 ${
        darkMode
          ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-b from-gray-100 via-gray-200 to-gray-100 text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center w-80 mb-6">
        <h1 className="text-3xl font-bold">TaskFlow</h1>
        <motion.button
          onClick={() => setDarkMode(!darkMode)}
          whileTap={{ scale: 0.9, rotate: 10 }}
          className="px-3 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 dark:bg-gray-200 dark:text-black"
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
          className="px-4 py-2 rounded-md text-black w-64"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white"
        >
          Add
        </button>
      </form>

      {/* Clear Completed */}
      <button
        onClick={clearCompleted}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md mb-4 text-white"
      >
        Clear Completed
      </button>

      {/* Drag-and-drop task list */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="w-80 space-y-3"
            >
              <AnimatePresence>
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided, snapshot) => (
                      <motion.li
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.2 }}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`flex flex-col px-4 py-3 rounded-md shadow-md transition-all duration-500 ${
                          darkMode
                            ? "bg-gray-800 text-gray-200"
                            : `bg-gradient-to-r ${pastelColors[index % pastelColors.length]} text-gray-900`
                        } ${snapshot.isDragging ? "scale-105 shadow-xl" : ""}`}
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
                      </motion.li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </AnimatePresence>
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </motion.div>
  );
}

export default App;
