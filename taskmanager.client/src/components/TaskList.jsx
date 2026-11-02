import { useMemo, useState } from 'react';
import TaskItem from './TaskItem';

function TaskList({
    tasks,
    onToggleComplete,
    onEdit,
    onDelete,
    loading,
    error,
    onRetry,
}) {
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');

    const pendingCount = tasks.filter(task => !task.isCompleted).length;
    const completedCount = tasks.filter(task => task.isCompleted).length;

    const filteredTasks = useMemo(() => {
        let result = [...tasks];

        // Filter by task status
        if (filter === 'pending') {
            result = result.filter(task => !task.isCompleted);
        } else if (filter === 'completed') {
            result = result.filter(task => task.isCompleted);
        }

        // Search by title and description
        const search = searchTerm.trim().toLowerCase();

        if (search) {
            result = result.filter(task =>
                task.title?.toLowerCase().includes(search) ||
                task.description?.toLowerCase().includes(search)
            );
        }

        // Sort tasks
        result.sort((a, b) => {
            switch (sortOrder) {
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);

                case 'az':
                    return (a.title || '').localeCompare(b.title || '');

                case 'za':
                    return (b.title || '').localeCompare(a.title || '');

                case 'newest':
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

        return result;
    }, [tasks, filter, searchTerm, sortOrder]);

    const clearFilters = () => {
        setFilter('all');
        setSearchTerm('');
        setSortOrder('newest');
    };

    const hasActiveFilters =
        filter !== 'all' ||
        searchTerm.trim() !== '' ||
        sortOrder !== 'newest';

    return (
        <section className="panel task-list-panel">
            <div className="section-heading">
                <div>
                    <span className="eyebrow">YOUR WORKSPACE</span>
                    <h2>Your tasks</h2>
                    <p>Manage and track your daily progress.</p>
                </div>

                <span className="task-total">{tasks.length} tasks</span>
            </div>

            <div className="filter-tabs">
                <button
                    type="button"
                    className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
                    onClick={() => setFilter('all')}
                >
                    All <span>{tasks.length}</span>
                </button>

                <button
                    type="button"
                    className={filter === 'pending' ? 'filter-btn active' : 'filter-btn'}
                    onClick={() => setFilter('pending')}
                >
                    Pending <span>{pendingCount}</span>
                </button>

                <button
                    type="button"
                    className={filter === 'completed' ? 'filter-btn active' : 'filter-btn'}
                    onClick={() => setFilter('completed')}
                >
                    Completed <span>{completedCount}</span>
                </button>
            </div>

            <div className="task-toolbar">
                <div className="search-box">
                    <span className="search-icon">⌕</span>

                    <input
                        type="search"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Search tasks"
                    />
                </div>

                <select
                    className="sort-select"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    aria-label="Sort tasks"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="az">Name: A to Z</option>
                    <option value="za">Name: Z to A</option>
                </select>

                <button
                    type="button"
                    className="clear-filters-btn"
                    onClick={clearFilters}
                    disabled={!hasActiveFilters}
                >
                    Clear Filters
                </button>
            </div>

            {!loading && !error && (
                <p className="results-count">
                    Showing {filteredTasks.length} of {tasks.length} tasks
                </p>
            )}

            {loading && (
                <div className="empty-state">
                    <div className="loader"></div>
                    <p>Loading your tasks...</p>
                </div>
            )}

            {!loading && error && (
                <div className="empty-state">
                    <p className="error-message">{error}</p>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onRetry}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {!loading && !error && filteredTasks.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">
                        {searchTerm.trim() ? '⌕' : '✓'}
                    </div>

                    <h3>
                        {searchTerm.trim()
                            ? 'No matching tasks'
                            : filter === 'all'
                                ? 'No tasks yet'
                                : `No ${filter} tasks`}
                    </h3>

                    <p>
                        {searchTerm.trim()
                            ? 'Try another search term or clear your filters.'
                            : filter === 'all'
                                ? 'Create your first task using the form.'
                                : 'Try another filter or add a new task.'}
                    </p>

                    {hasActiveFilters && (
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={clearFilters}
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            )}

            {!loading && !error && filteredTasks.length > 0 && (
                <div className="task-list">
                    {filteredTasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onToggleComplete={onToggleComplete}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default TaskList;