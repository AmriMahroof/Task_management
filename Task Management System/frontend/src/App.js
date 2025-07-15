import React, { useState, useEffect } from 'react';

const App = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/tasks?userId=${currentUser}`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const savedOtp = window.prompt('Enter 2FA code:');
      if (savedOtp === '123456') {
        setCurrentUser(savedUser);
      } else {
        localStorage.removeItem('currentUser');
        alert('Invalid 2FA code');
      }
    }
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', currentUser);
      fetchTasks();
    } else {
      localStorage.removeItem('currentUser');
      setTasks([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]); // Dependency on currentUser

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let enteredOtp = otp;
      if (!enteredOtp) {
        enteredOtp = window.prompt('Enter 2FA code:');
        if (!enteredOtp) {
          alert('2FA code is required');
          setLoading(false);
          return;
        }
      }
      const res = await fetch(`http://localhost:5000/api/auth/${isLogin ? 'login' : 'register'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, otp: enteredOtp })
      });
      const data = await res.json();
      if (data.message === 'Login successful' || data.message === 'User registered') {
        if (enteredOtp === '123456') {
          setCurrentUser(data.userId || data._id);
          if (!isLogin && data.message === 'User registered') {
            alert('Registered successfully');
          }
        } else {
          alert('Invalid 2FA code');
        }
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (newTask.trim() && currentUser) {
      try {
        const res = await fetch('http://localhost:5000/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUser, text: newTask.trim() })
        });
        const data = await res.json();
        setTasks(data);
        setNewTask('');
      } catch (err) {
        console.error('Error adding task');
      }
    }
  };

  const handleToggleTask = async (index) => {
    if (currentUser) {
      try {
        const res = await fetch('http://localhost:5000/api/tasks/toggle', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUser, index })
        });
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error('Error toggling task');
      }
    }
  };

  const handleDeleteTask = async (index) => {
    if (currentUser) {
      try {
        const res = await fetch('http://localhost:5000/api/tasks', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUser, index })
        });
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error('Error deleting task');
      }
    }
  };

  const filteredTasks = tasks.filter(task =>
    filter === 'all' ? true : filter === 'completed' ? task.completed : !task.completed
  );

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="container mx-auto max-w-md p-4">
      {!currentUser ? (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">{isLogin ? 'Login' : 'Register'}</h2>
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {!isLogin && (
              <input
                type="text"
                placeholder="Enter 2FA Code"
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            )}
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200">
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Register' : 'Login'}
            </span>
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white shadow-lg p-4 rounded-lg">
            <h1 className="text-2xl font-bold text-gray-800">TaskMaster Pro</h1>
            <button
              onClick={() => {
                setCurrentUser(null);
                setUsername('');
                setPassword('');
                setOtp('');
              }}
              className="text-red-500 hover:text-red-700 transition duration-200"
            >
              Logout
            </button>
          </div>

          <div className="bg-white shadow-lg p-4 rounded-lg">
            <input
              type="text"
              placeholder="New Task"
              className="w-full border border-gray-300 p-2 mb-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <button onClick={handleAddTask} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200">
              Add Task
            </button>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <ul className="space-y-2">
            {filteredTasks.map((task, index) => (
              <li
                key={index}
                className={`flex justify-between items-center p-2 border border-gray-300 rounded-lg bg-white ${
                  task.completed ? 'line-through text-gray-400' : ''
                }`}
              >
                <span className="text-gray-800">{task.text}</span>
                <div className="space-x-2">
                  <button onClick={() => handleToggleTask(index)} className="text-green-500 hover:text-green-700 transition duration-200">✔️</button>
                  <button onClick={() => handleDeleteTask(index)} className="text-red-500 hover:text-red-700 transition duration-200">🗑️</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;