/**
 * Stats Component
 * Displays task statistics
 */

import React from 'react';

const Stats = ({ stats }) => {
    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">📊 Statistics</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.375rem',
                    borderLeft: '4px solid #6366f1'
                }}>
                    <span style={{ color: '#6b7280', fontWeight: 500 }}>Total Tasks</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#6366f1' }}>
                        {stats.total}
                    </span>
                </div>
                
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.375rem',
                    borderLeft: '4px solid #10b981'
                }}>
                    <span style={{ color: '#6b7280', fontWeight: 500 }}>Active Tasks</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>
                        {stats.active}
                    </span>
                </div>
                
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.375rem',
                    borderLeft: '4px solid #f59e0b'
                }}>
                    <span style={{ color: '#6b7280', fontWeight: 500 }}>Completed</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>
                        {stats.completed}
                    </span>
                </div>
                
                <div style={{ 
                    marginTop: '0.5rem',
                    padding: '0.75rem',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '0.375rem',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: '0.875rem', color: '#0369a1', fontWeight: 500 }}>
                        Completion Rate: {stats.total > 0 ? Math.round((stats.completed / stats.active) * 100) : 0}%
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Stats;
