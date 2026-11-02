
function TaskItem({ task, onToggleComplete, onEdit, onDelete }) {
    const formattedDate = task.createdAt
        ? new Date(task.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })
        : 'Date unavailable';

    return (
        <article className={`task-item ${task.isCompleted ? 'is-completed' : ''}`}>
            <div className="task-main">
                <input
                    type="checkbox"
                    className="task-checkbox"
                    checked={task.isCompleted}
                    onChange={() => onToggleComplete(task)}
                    aria-label={`Mark ${task.title} as ${task.isCompleted ? 'pending' : 'completed'}`}
                />

                <div className="task-details">
                    <h3>{task.title}</h3>

                    {task.description && (
                        <p>{task.description}</p>
                    )}

                    <span className="task-date">
                        Created {formattedDate}
                    </span>
                </div>
            </div>

            <div className="task-actions">
                <span className={`task-status ${task.isCompleted ? 'completed' : 'pending'}`}>
                    {task.isCompleted ? 'Completed' : 'Pending'}
                </span>

                <button
                    type="button"
                    className="icon-button"
                    onClick={() => onEdit(task)}
                    title="Edit task"
                    aria-label="Edit task"
                >
                    ✎
                </button>

                <button
                    type="button"
                    className="icon-button delete-button"
                    onClick={() => onDelete(task.id)}
                    title="Delete task"
                    aria-label="Delete task"
                >
                    ×
                </button>
            </div>
        </article>
    );
}

export default TaskItem;
