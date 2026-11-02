import { useCallback, useEffect, useState } from 'react';

import Navbar from './components/Navbar';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

import {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
} from './services/taskService';

import './App.css';

function App() {
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionError, setActionError] = useState('');

    const fetchTasks = useCallback(async (showLoading = true) => {
        try {
            if (showLoading) {
                setLoading(true);
            }

            const data = await getTasks();
            setTasks(data);
            setError('');
        } catch (err) {
            console.error('Error fetching tasks:', err);
            setError('Unable to load tasks. Please check whether the backend is running.');
        } finally {
            if (showLoading) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleSaveTask = async (taskData) => {
        try {
            setActionError('');

            if (editingTask) {
                await updateTask(taskData.id, taskData);
            } else {
                await createTask(taskData);
            }

            setEditingTask(null);
            await fetchTasks(false);

            return true;
        } catch (err) {
            console.error('Error saving task:', err);
            setActionError(
                err.response?.data?.message || 'Unable to save the task. Please try again.'
            );

            return false;
        }
    };

    const handleToggleComplete = async (task) => {
        try {
            setActionError('');

            const updatedTask = {
                ...task,
                isCompleted: !task.isCompleted,
            };

            await updateTask(task.id, updatedTask);
            await fetchTasks(false);
        } catch (err) {
            console.error('Error updating task:', err);
            setActionError('Unable to update task status. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this task?'
        );

        if (!confirmed) return;

        try {
            setActionError('');

            await deleteTask(id);

            if (editingTask?.id === id) {
                setEditingTask(null);
            }

            await fetchTasks(false);
        } catch (err) {
            console.error('Error deleting task:', err);
            setActionError('Unable to delete the task. Please try again.');
        }
    };

    const totalCount = tasks.length;
    const completedCount = tasks.filter(task => task.isCompleted).length;
    const pendingCount = totalCount - completedCount;

    const completionPercentage = totalCount > 0
        ? Math.round((completedCount / totalCount) * 100)
        : 0;

    return (
        <div className="app-container">
            <Navbar
                totalCount={totalCount}
                completedCount={completedCount}
                pendingCount={pendingCount}
            />

            <main className="main-content">
                <section className="welcome-section">
                    <div>
                        <span className="eyebrow">OVERVIEW</span>
                        <h2>Good work starts with a plan.</h2>
                        <p>Stay focused, manage your tasks, and make progress every day.</p>
                    </div>
                </section>

                <div className="dashboard-grid">
                    <div className="stat-card">
                        <span className="stat-label">Total Tasks</span>
                        <strong>{totalCount}</strong>
                        <span className="stat-description">All your tasks</span>
                    </div>

                    <div className="stat-card">
                        <span className="stat-label">Completed</span>
                        <strong className="success-text">{completedCount}</strong>
                        <span className="stat-description">Tasks finished</span>
                    </div>

                    <div className="stat-card">
                        <span className="stat-label">Pending</span>
                        <strong className="pending-text">{pendingCount}</strong>
                        <span className="stat-description">Tasks remaining</span>
                    </div>
                </div>

                <section className="progress-panel">
                    <div className="progress-heading">
                        <div>
                            <h3>Overall Progress</h3>
                            <p>Your task completion summary</p>
                        </div>

                        <strong>{completionPercentage}%</strong>
                    </div>

                    <div
                        className="progress-track"
                        role="progressbar"
                        aria-label="Task completion progress"
                        aria-valuenow={completionPercentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                    >
                        <div
                            className="progress-fill"
                            style={{ width: `${completionPercentage}%` }}
                        ></div>
                    </div>

                    <p className="progress-description">
                        {completedCount} of {totalCount} tasks completed
                    </p>
                </section>

                {actionError && (
                    <div className="action-error" role="alert">
                        {actionError}
                        <button
                            type="button"
                            onClick={() => setActionError('')}
                            aria-label="Dismiss error"
                        >
                            ×
                        </button>
                    </div>
                )}

                <div className="content-grid">
                    <TaskForm
                        onSaveTask={handleSaveTask}
                        editingTask={editingTask}
                        onCancelEdit={() => setEditingTask(null)}
                    />

                    <TaskList
                        tasks={tasks}
                        onToggleComplete={handleToggleComplete}
                        onEdit={setEditingTask}
                        onDelete={handleDelete}
                        loading={loading}
                        error={error}
                        onRetry={() => fetchTasks()}
                    />
                </div>

                <footer className="app-footer">
                    TaskManager <span>•</span> Built with React and ASP.NET Core
                </footer>
            </main>
        </div>
    );
}

export default App;