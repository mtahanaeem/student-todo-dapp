/**
 * Student ToDo List - Frontend Configuration
 * Web3 Integration and Contract ABI
 */

// Smart Contract ABI (Should match StudentToDo.sol)
export const STUDENT_TODO_ABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_description",
                "type": "string"
            }
        ],
        "name": "addTask",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
        "constant": false,
        "payable": false
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_taskId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_description",
                "type": "string"
            }
        ],
        "name": "editTask",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
        "constant": false,
        "payable": false
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_taskId",
                "type": "uint256"
            }
        ],
        "name": "toggleTaskStatus",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
        "constant": false,
        "payable": false
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_taskId",
                "type": "uint256"
            }
        ],
        "name": "softDeleteTask",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
        "constant": false,
        "payable": false
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_taskId",
                "type": "uint256"
            }
        ],
        "name": "getTask",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "completed",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "deleted",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct StudentToDo.Task",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "getAllTasks",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "completed",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "deleted",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct StudentToDo.Task[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "getActiveTasks",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "completed",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "deleted",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct StudentToDo.Task[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "getTaskCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "getActiveTaskCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "getCompletedTaskCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_user",
                "type": "address"
            }
        ],
        "name": "getUserTasks",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "completed",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "deleted",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct StudentToDo.Task[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "taskId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "TaskAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "taskId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "newDescription",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "TaskEdited",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "taskId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "completed",
                "type": "bool"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "TaskStatusToggled",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "taskId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "TaskDeleted",
        "type": "event"
    }
];

// Backend API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Ganache Configuration
export const GANACHE_CONFIG = {
    RPC_URL: 'http://127.0.0.1:7545',
    CHAIN_ID: 1337,
    NETWORK_NAME: 'Ganache Local Network'
};

// Contract address (will be set after deployment)
export const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || '';
