
import { useEffect, useState } from 'react';

function TaskForm({ onSaveTask, editingTask, onCancelEdit }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (editingTask) {
            setTitle(editingTask.title || '');
            setDescription(editingTask.description || '');
        } else {
            setTitle('');
            setDescription('');
        }

        setError('');
    }, [editingTask]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedTitle = title.trim();
        const trimmedDescription = description.trim();

        if (!trimmedTitle) {
            setError('Task title is required.');
            return;
        }

        if (trimmedTitle.length > 100) {
            setError('Title cannot exceed 100 characters.');
            return;
        }

        if (trimmedDescription.length > 500) {
            setError('Description cannot exceed 500 characters.');
            return;
        }

        const taskData = {
            id: editingTask ? editingTask.id : 0,
            title: trimmedTitle,
            description: trimmedDescription || null,
            isCompleted: editingTask ? editingTask.isCompleted : false,
        };

        try {
            setSaving(true);
            setError('');

            const success = await onSaveTask(taskData);

            if (success) {
                setTitle('');
                setDescription('');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setTitle('');
        setDescription('');
        setError('');
        onCancelEdit();
    };

    return (
        <section className="panel task-form-panel">
            <div className="section-heading">
                <div>
                    <span className="eyebrow">
                        {editingTask ? 'UPDATE TASK' : 'CREATE TASK'}
                    </span>

                    <h2>{editingTask ? 'Edit your task' : 'Add a new task'}</h2>
                    <p>Keep track of the things you need to accomplish.</p>
                </div>

                <span className="heading-icon">
                    {editingTask ? '✎' : '+'}
                </span>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="task-title">Task title <span>*</span></label>

                    <input
                        id="task-title"
                        type="text"
                        placeholder="What needs to be done?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={100}
                        required
                    />

                    <small>{title.length}/100 characters</small>
                </div>

                <div className="form-group">
                    <label htmlFor="task-description">Description</label>

                    <textarea
                        id="task-description"
                        placeholder="Add more details about this task..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={500}
                        rows={3}
                    />

                    <small>{description.length}/500 characters</small>
                </div>

                {error && (
                    <p className="form-error">{error}</p>
                )}

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={saving}
                    >
                        {saving
                            ? 'Saving...'
                            : editingTask
                                ? 'Update Task'
                                : '+ Add Task'}
                    </button>

                    {editingTask && (
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleCancel}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </section>
    );
}

export default TaskForm;
