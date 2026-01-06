/**
 * Main React Component - Student ToDo List DApp
 * Manages all state, Web3 integration, and UI rendering
 */

import React, { useState, useEffect } from 'react';
import { initWeb3, subscribeToProvider } from './web3';
import { loadContract } from './contract';
import axios from 'axios';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import WalletInfo from './components/WalletInfo';
import WalletSwitcher from './components/WalletSwitcher';
import Stats from './components/Stats';
import './App.css';

const App = () => {
    // State variables
    const [, setWeb3Instance] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({ total: 0, active: 0, completed: 0 });
    const [loading, setLoading] = useState(false);
    const [showDeleted, setShowDeleted] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingDescription, setEditingDescription] = useState('');

    // Initialize Web3 and contract on component mount
    useEffect(() => {
        let unsubscribe = null;

        (async () => {
            try {
                setLoading(true);
                setError('');

                const { web3, provider, accounts } = await initWeb3();
                setWeb3Instance(web3);

                if (!accounts || accounts.length === 0) {
                    setError('No accounts available. Please unlock your wallet.');
                    setLoading(false);
                    return;
                }

                setAccount(accounts[0]);

                // Load contract for current network
                try {
                    const { contract: loadedContract } = await loadContract(web3);
                    setContract(loadedContract);
                    await loadTasks(accounts[0], loadedContract);
                    await loadStats(accounts[0], loadedContract);
                } catch (err) {
                    setError(err.message || 'Contract load failed');
                }

                // Subscribe to account and chain changes
                unsubscribe = subscribeToProvider(provider, {
                    onAccountsChanged: async (accounts) => {
                        if (!accounts || accounts.length === 0) {
                            setAccount(null);
                            setTasks([]);
                            setStats({ total: 0, active: 0, completed: 0 });
                            return;
                        }
                        setAccount(accounts[0]);
                        if (contract) {
                            setLoading(true);
                            try {
                                if (showDeleted) {
                                    await fetchTasksFromBackend(accounts[0], true);
                                } else {
                                    await loadTasks(accounts[0], contract);
                                }
                                await loadStats(accounts[0], contract);
                            } finally {
                                setLoading(false);
                            }
                        }
                    },
                    onChainChanged: async (chainId) => {
                        try {
                            setLoading(true);
                            const { web3: newWeb3 } = await initWeb3();
                            setWeb3Instance(newWeb3);
                            const { contract: newContract } = await loadContract(newWeb3);
                            setContract(newContract);
                            if (account) {
                                if (showDeleted) {
                                    await fetchTasksFromBackend(account, true);
                                } else {
                                    await loadTasks(account, newContract);
                                }
                                await loadStats(account, newContract);
                            }
                        } catch (err) {
                            setError(err.message || 'Error switching network');
                        } finally {
                            setLoading(false);
                        }
                    }
                });

                setLoading(false);
            } catch (err) {
                console.error('Initialization error:', err);
                setError(err.message || 'Failed to initialize application');
                setLoading(false);
            }
        })();

        return () => {
            if (unsubscribe) unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    
    /**
     * Handle account change from wallet switcher
     */
    const handleAccountChange = async (newAccount) => {
        setAccount(newAccount);
        setError('');
        setSuccess('');
        if (contract) {
            setLoading(true);
            try {
                if (showDeleted) {
                    await fetchTasksFromBackend(newAccount, true);
                } else {
                    await loadTasks(newAccount, contract);
                }
                await loadStats(newAccount, contract);
            } catch (err) {
                console.error('Account switch error:', err);
                setError(err.message || 'Failed to switch account');
            } finally {
                setLoading(false);
            }
        }
    };

    /**
     * Load tasks from smart contract
     */
    const loadTasks = async (userAccount, contractInstance) => {
        try {
            // Prefer direct contract call (fast, on-chain)
            if (contractInstance) {
                const tasksData = await contractInstance.methods.getActiveTasks().call({ from: userAccount });
                const formattedTasks = tasksData.map(task => ({
                    id: parseInt(task.id),
                    description: task.description,
                    completed: task.completed,
                    deleted: task.deleted,
                    timestamp: parseInt(task.timestamp)
                }));
                setTasks(formattedTasks);
                return;
            }

            // Fallback: if contractInstance not available, fetch from backend
            await fetchTasksFromBackend(userAccount, false);
        } catch (error) {
            console.error('Error loading tasks from contract:', error);
            // On contract errors (network mismatch etc.) fallback to backend
            await fetchTasksFromBackend(userAccount, false);
        }
    };

    // Helper: fetch tasks from backend; `includeDeleted` returns all tasks when true
    const fetchTasksFromBackend = async (userAccount, includeDeleted = true) => {
        try {
            if (!userAccount) return;
            const base = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
            const url = `${base}/api/users/${userAccount}/tasks`;
            const resp = await axios.get(url, { timeout: 8000 });
            if (resp.data && resp.data.success) {
                let formattedTasks = resp.data.tasks.map(task => ({
                    id: parseInt(task.id),
                    description: task.description,
                    completed: task.completed,
                    deleted: task.deleted,
                    timestamp: parseInt(task.timestamp)
                }));
                if (!includeDeleted) {
                    formattedTasks = formattedTasks.filter(t => !t.deleted);
                }
                setTasks(formattedTasks);
            } else {
                setTasks([]);
            }
        } catch (error) {
            console.error('Error fetching user tasks from backend:', error);
            setError(error.message || 'Failed to fetch tasks from backend');
        }
    };

    /**
     * Load statistics from smart contract
     */
    const loadStats = async (userAccount, contractInstance) => {
        try {
            const total = await contractInstance.methods.getTaskCount().call({ from: userAccount });
            const active = await contractInstance.methods.getActiveTaskCount().call({ from: userAccount });
            const completed = await contractInstance.methods.getCompletedTaskCount().call({ from: userAccount });
            
            setStats({
                total: parseInt(total),
                active: parseInt(active),
                completed: parseInt(completed)
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    /**
     * Add new task
     */
    const handleAddTask = async (description) => {
        if (!contract || !account) {
            setError('Contract not initialized');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSuccess('');

            await contract.methods.addTask(description).send({
                from: account,
                gas: 300000
            });

            setSuccess('Task added successfully!');
            await loadTasks(account, contract);
            await loadStats(account, contract);
            
            setTimeout(() => setSuccess(''), 3000);
            setLoading(false);
        } catch (error) {
            setError(error.message || 'Failed to add task');
            setLoading(false);
        }
    };

    /**
     * Edit task description
     */
    const handleEditTask = async (taskId, newDescription) => {
        if (!contract || !account) {
            setError('Contract not initialized');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSuccess('');

            await contract.methods.editTask(taskId, newDescription).send({
                from: account,
                gas: 300000
            });

            setSuccess('Task updated successfully!');
            setEditingTaskId(null);
            setEditingDescription('');
            await loadTasks(account, contract);
            
            setTimeout(() => setSuccess(''), 3000);
            setLoading(false);
        } catch (error) {
            setError(error.message || 'Failed to edit task');
            setLoading(false);
        }
    };

    /**
     * Toggle task completion status
     */
    const handleToggleTask = async (taskId) => {
        if (!contract || !account) {
            setError('Contract not initialized');
            return;
        }

        try {
            setLoading(true);
            setError('');

            await contract.methods.toggleTaskStatus(taskId).send({
                from: account,
                gas: 300000
            });

            await loadTasks(account, contract);
            await loadStats(account, contract);
            setLoading(false);
        } catch (error) {
            setError(error.message || 'Failed to toggle task');
            setLoading(false);
        }
    };

    /**
     * Delete task (soft delete)
     */
    const handleDeleteTask = async (taskId) => {
        if (!contract || !account) {
            setError('Contract not initialized');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSuccess('');

            await contract.methods.softDeleteTask(taskId).send({
                from: account,
                gas: 300000
            });

            setSuccess('Task deleted successfully!');
            await loadTasks(account, contract);
            await loadStats(account, contract);
            
            setTimeout(() => setSuccess(''), 3000);
            setLoading(false);
        } catch (error) {
            setError(error.message || 'Failed to delete task');
            setLoading(false);
        }
    };

    return (
        <div className="app">
            {/* Header */}
            <header className="header">
                <div className="header-content">
                    <h1>📝 Student ToDo List</h1>
                    <p className="subtitle">Decentralized Task Management on Ethereum</p>
                </div>
            </header>

            {/* Main Container */}
            <div className="container">
                {/* Left Sidebar - Wallet & Stats */}
                <aside className="sidebar">
                    <WalletSwitcher 
                        currentAccount={account}
                        onAccountChange={handleAccountChange}
                    />
                    <WalletInfo account={account} />
                    <Stats stats={stats} />
                </aside>

                {/* Main Content Area */}
                <main className="main-content">
                    {/* Alert Messages */}
                    {error && (
                        <div className="alert alert-error">
                            <span>❌</span> {error}
                            <button onClick={() => setError('')}>×</button>
                        </div>
                    )}
                    
                    {success && (
                        <div className="alert alert-success">
                            <span>✓</span> {success}
                            <button onClick={() => setSuccess('')}>×</button>
                        </div>
                    )}

                    {/* Task Form */}
                    <TaskForm 
                        onAddTask={handleAddTask}
                        loading={loading}
                        disabled={!contract}
                    />

                    {/* Toggle: Show deleted tasks (audit) */}
                    <div style={{ margin: '12px 0' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="checkbox"
                                checked={showDeleted}
                                onChange={async () => {
                                    const next = !showDeleted;
                                    setShowDeleted(next);
                                    if (next) {
                                        await fetchTasksFromBackend(account, true);
                                    } else if (contract) {
                                        await loadTasks(account, contract);
                                    }
                                }}
                            />
                            <span style={{ fontSize: '14px' }}>Show deleted tasks (audit)</span>
                        </label>
                    </div>

                    {/* Task List */}
                    {tasks.length > 0 ? (
                        <TaskList 
                            tasks={tasks}
                            onToggle={handleToggleTask}
                            onEdit={(taskId, description) => {
                                setEditingTaskId(taskId);
                                setEditingDescription(description);
                            }}
                            onSaveEdit={(taskId, description) => {
                                handleEditTask(taskId, description);
                            }}
                            onDelete={handleDeleteTask}
                            editingTaskId={editingTaskId}
                            editingDescription={editingDescription}
                            setEditingDescription={setEditingDescription}
                            setEditingTaskId={setEditingTaskId}
                            loading={loading}
                        />
                    ) : (
                        <div className="empty-state">
                            <h3>No tasks yet</h3>
                            <p>Create your first task to get started!</p>
                        </div>
                    )}
                </main>
            </div>

            {/* Loading Overlay */}
            {loading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                    <p>Processing transaction...</p>
                </div>
            )}
        </div>
    );
};

export default App;
