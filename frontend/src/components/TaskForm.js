/**
 * Task Form Component
 * Form for adding new tasks
 */

import React, { useState } from 'react';

const TaskForm = ({ onAddTask, loading, disabled }) => {
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!description.trim()) {
            alert('Please enter a task description');
            return;
        }
        
        if (description.length > 500) {
            alert('Task description must not exceed 500 characters');
            return;
        }

        onAddTask(description.trim());
        setDescription('');
    };

    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">➕ Add New Task</h3>
            </div>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Task Description</label>
                    <textarea
                        className="form-textarea"
                        placeholder="Enter your task description here..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={loading || disabled}
                        maxLength={500}
                    />
                    <p style={{ 
                        fontSize: '0.875rem', 
                        color: '#6b7280',
                        marginTop: '0.25rem',
                        textAlign: 'right'
                    }}>
                        {description.length}/500
                    </p>
                </div>

                <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading || disabled || !description.trim()}
                    style={{ width: '100%', justifyContent: 'center' }}
                >
                    {loading ? '⏳ Adding...' : '✓ Add Task'}
                </button>
            </form>

            {disabled && (
                <div style={{ 
                    marginTop: '1rem',
                    padding: '0.75rem',
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem'
                }}>
                    ⚠️ Please connect wallet and deploy contract to add tasks.
                </div>
            )}
        </div>
    );
};

export default TaskForm;
