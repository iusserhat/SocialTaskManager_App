import React, { useState, useEffect } from 'react';

import { SocialTaskManager_backend } from 'declarations/SocialTaskManager_backend';


function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const reward = "0.5 ICP token";

  const fetchTasks = async () => {
    try {
      
      const loadedTasks = await SocialTaskManager.getTasks();
      setTasks(loadedTasks);
    } catch (error) {
      console.error("Görevler yüklenirken bir hata oluştu:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!newTaskDescription) return;
    try {
      // Yine, "SocialTaskManager" kullanıyoruz.
      await SocialTaskManager.addTask(newTaskDescription, reward);
      setNewTaskDescription('');
      fetchTasks();
    } catch (error) {
      console.error("Görev eklenirken bir hata oluştu:", error);
    }
  };

  const handleCompleteTask = async (id) => {
    try {
      SocialTaskManager.completeTask(id);
      fetchTasks();
    } catch (error) {
      console.error("Görev tamamlanırken bir hata oluştu:", error);
    }
  };

  const handleClearCompleted = async () => {
    try {
       SocialTaskManager.clearCompleted();
      fetchTasks();
    } catch (error) {
      console.error("Tamamlanan görevler temizlenirken bir hata oluştu:", error);
    }
  };

  return (
    <div>
      <h1>Social Task Manager</h1>
      <input
        type="text"
        placeholder="Task Description"
        value={newTaskDescription}
        onChange={(e) => setNewTaskDescription(e.target.value)}
      />
      <button onClick={handleAddTask}>Add Task</button>
      <button onClick={handleClearCompleted}>Clear Completed Tasks</button>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            {task.description}
            {task.completed ? ` ✔ - Reward: ${task.reward}` : (
              <button onClick={() => handleCompleteTask(task.id)}>Complete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
