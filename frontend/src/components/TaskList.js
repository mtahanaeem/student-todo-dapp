/**
 * Task List Component
 * Displays all tasks with actions
 */

import React from 'react';

const TaskList = ({
    tasks,
    onToggle,
    onEdit,
    onSaveEdit,
    onDelete,
    editingTaskId,
    editingDescription,
    setEditingDescription,
    setEditingTaskId,
    loading
}) => {
    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">✓ Your Tasks ({tasks.length})</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        style={{
                            padding: '1rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            backgroundColor: task.completed ? '#f0fdf4' : '#fff',
                            transition: 'all 0.2s'
                        }}
                    >
                        {editingTaskId === task.id ? (
                            // Edit Mode
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <textarea
                                    className="form-textarea"
                                    value={editingDescription}
                                    onChange={(e) => setEditingDescription(e.target.value)}
                                    style={{ minHeight: '80px' }}
                                />
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => onSaveEdit(task.id, editingDescription)}
                                        disabled={loading}
                                        style={{ flex: 1 }}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => {
                                            setEditingTaskId(null);
                                            setEditingDescription('');
                                        }}
                                        disabled={loading}
                                        style={{ flex: 1 }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Display Mode
                            <>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <button
                                        onClick={() => onToggle(task.id)}
                                        disabled={loading}
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            minWidth: '24px',
                                            minHeight: '24px',
                                            borderRadius: '0.375rem',
                                            border: task.completed ? 'none' : '2px solid #10b981',
                                            backgroundColor: task.completed ? '#10b981' : 'white',
                                            color: 'white',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            fontSize: '0.875rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.2s'
                                        }}
                                        title={task.completed ? 'Mark incomplete' : 'Mark complete'}
                                    >
                                        {task.completed && '✓'}
                                    </button>

                                    <div style={{ flex: 1 }}>
                                        <p
                                            style={{
                                                textDecoration: task.completed ? 'line-through' : 'none',
                                                color: task.completed ? '#9ca3af' : '#1f2937',
                                                marginBottom: '0.25rem',
                                                wordBreak: 'break-word'
                                            }}
                                        >
                                            {task.description}
                                        </p>
                                        <p style={{ 
                                            fontSize: '0.75rem', 
                                            color: '#9ca3af'
                                        }}>
                                            Created: {formatDate(task.timestamp)}
                                        </p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => onEdit(task.id, task.description)}
                                        disabled={loading}
                                        style={{ flex: 1 }}
                                    >
                                        ✎ Edit
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this task?')) {
                                                onDelete(task.id);
                                            }
                                        }}
                                        disabled={loading}
                                        style={{ flex: 1 }}
                                    >
                                        🗑 Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskList;
