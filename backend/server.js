/**
 * Student ToDo List Backend Server
 * Framework: Express.js
 * Blockchain Interaction: Web3.js
 * Purpose: REST API for frontend to interact with smart contract
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// ==================== CONFIGURATION ====================

const app = express();
const PORT = process.env.PORT || 5000;

// Ganache Configuration
const GANACHE_RPC_URL = process.env.GANACHE_RPC_URL || 'http://127.0.0.1:7545';
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '';
const CONTRACT_ABI_PATH = process.env.CONTRACT_ABI_PATH || '../build/contracts/StudentToDo.json';

// ==================== MIDDLEWARE ====================

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});

// ==================== WEB3 INITIALIZATION ====================

const web3 = new Web3(GANACHE_RPC_URL);
let studentTodoContract = null;
let contractABI = null;

/**
 * Initialize contract ABI from Truffle build output
 */
function initializeContractABI() {
    try {
        const contractPath = path.resolve(__dirname, CONTRACT_ABI_PATH);
        
        // Check if file exists
        if (!fs.existsSync(contractPath)) {
            console.warn(`Warning: Contract ABI file not found at ${contractPath}`);
            console.warn('Please ensure contract is deployed: truffle migrate');
            return false;
        }
        
        const contractJSON = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
        contractABI = contractJSON.abi;
        console.log('✓ Contract ABI loaded successfully');
        return true;
    } catch (error) {
        console.error('Error loading contract ABI:', error.message);
        return false;
    }
}

/**
 * Initialize smart contract instance
 */
function initializeContract(contractAddress) {
    if (!contractABI) {
        console.error('Contract ABI not loaded');
        return false;
    }
    
    if (!contractAddress || contractAddress === '') {
        console.error('Contract address not provided');
        return false;
    }
    
    try {
        studentTodoContract = new web3.eth.Contract(contractABI, contractAddress);
        console.log('✓ Contract instance initialized at', contractAddress);
        return true;
    } catch (error) {
        console.error('Error initializing contract:', error.message);
        return false;
    }
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Verify Ganache connection
 */
async function verifyGanacheConnection() {
    try {
        const isConnected = await web3.eth.net.isListening();
        if (isConnected) {
            const chainId = await web3.eth.getChainId();
            const latestBlock = await web3.eth.getBlockNumber();
            console.log(`✓ Connected to Ganache (Chain ID: ${chainId}, Latest Block: ${latestBlock})`);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error connecting to Ganache:', error.message);
        return false;
    }
}

/**
 * Get account from Web3 provider
 */
async function getAccount() {
    try {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
            throw new Error('No accounts available in Ganache');
        }
        return accounts[0];
    } catch (error) {
        throw new Error(`Failed to get account: ${error.message}`);
    }
}

/**
 * Validate Ethereum address format
 */
function isValidAddress(address) {
    return web3.utils.isAddress(address);
}

// ==================== API ENDPOINTS ====================

/**
 * Health check endpoint
 */
app.get('/api/health', async (req, res) => {
    try {
        const isConnected = await web3.eth.net.isListening();
        const accounts = await web3.eth.getAccounts();
        
        res.json({
            status: 'healthy',
            ganacheConnected: isConnected,
            contractDeployed: studentTodoContract !== null,
            accountsAvailable: accounts.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * Get wallet connection info
 */
app.get('/api/wallet/connect', async (req, res) => {
    try {
        const accounts = await web3.eth.getAccounts();
        
        if (accounts.length === 0) {
            return res.status(400).json({
                connected: false,
                error: 'No accounts available'
            });
        }
        
        const account = accounts[0];
        const balance = await web3.eth.getBalance(account);
        const balanceEth = web3.utils.fromWei(balance, 'ether');
        
        res.json({
            connected: true,
            account: account,
            balance: balanceEth,
            balanceWei: balance,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            connected: false,
            error: error.message
        });
    }
});

/**
 * Get all tasks for current user
 * GET /api/tasks
 */
app.get('/api/tasks', async (req, res) => {
    try {
        if (!studentTodoContract) {
            return res.status(503).json({
                error: 'Smart contract not initialized. Please deploy first.'
            });
        }
        
        const account = await getAccount();
        const tasks = await studentTodoContract.methods.getActiveTasks().call({ from: account });
        
        // Convert BigNumber types to strings
        const formattedTasks = tasks.map(task => ({
            id: parseInt(task.id),
            description: task.description,
            completed: task.completed,
            deleted: task.deleted,
            timestamp: parseInt(task.timestamp)
        }));
        
        res.json({
            success: true,
            account: account,
            tasks: formattedTasks,
            count: formattedTasks.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Get single task by ID
 * GET /api/tasks/:id
 */
app.get('/api/tasks/:id', async (req, res) => {
    try {
        if (!studentTodoContract) {
            return res.status(503).json({
                error: 'Smart contract not initialized'
            });
        }
        
        const account = await getAccount();
        const taskId = parseInt(req.params.id);
        
        if (isNaN(taskId)) {
            return res.status(400).json({
                error: 'Invalid task ID'
            });
        }
        
        const task = await studentTodoContract.methods.getTask(taskId).call({ from: account });
        
        res.json({
            success: true,
            task: {
                id: parseInt(task.id),
                description: task.description,
                completed: task.completed,
                deleted: task.deleted,
                timestamp: parseInt(task.timestamp)
            }
        });
    } catch (error) {
        if (error.message.includes('Task does not exist')) {
            res.status(404).json({
                success: false,
                error: 'Task not found'
            });
        } else {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
});

/**
 * Create new task
 * POST /api/tasks
 * Body: { description: string }
 */
app.post('/api/tasks', async (req, res) => {
    try {
        if (!studentTodoContract) {
            return res.status(503).json({
                success: false,
                error: 'Smart contract not initialized'
            });
        }
        
        const { description } = req.body;
        
        if (!description || description.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Description is required'
            });
        }
        
        if (description.length > 500) {
            return res.status(400).json({
                success: false,
                error: 'Description must not exceed 500 characters'
            });
        }
        
        const account = await getAccount();
        
        const tx = await studentTodoContract.methods.addTask(description).send({
            from: account,
            gas: 300000
        });
        
        res.json({
            success: true,
            transactionHash: tx.transactionHash,
            blockNumber: tx.blockNumber,
            message: 'Task added successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Edit task description
 * PUT /api/tasks/:id
 * Body: { description: string }
 */
app.put('/api/tasks/:id', async (req, res) => {
    try {
        if (!studentTodoContract) {
            return res.status(503).json({
                success: false,
                error: 'Smart contract not initialized'
            });
        }
        
        const taskId = parseInt(req.params.id);
        const { description } = req.body;
        
        if (isNaN(taskId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid task ID'
            });
        }
        
        if (!description || description.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Description is required'
            });
        }
        
        if (description.length > 500) {
            return res.status(400).json({
                success: false,
                error: 'Description must not exceed 500 characters'
            });
        }
        
        const account = await getAccount();
        
        const tx = await studentTodoContract.methods.editTask(taskId, description).send({
            from: account,
            gas: 300000
        });
        
        res.json({
            success: true,
            transactionHash: tx.transactionHash,
            blockNumber: tx.blockNumber,
            message: 'Task updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Toggle task completion status
 * PATCH /api/tasks/:id/toggle
 */
app.patch('/api/tasks/:id/toggle', async (req, res) => {
    try {
        if (!studentTodoContract) {
            return res.status(503).json({
                success: false,
                error: 'Smart contract not initialized'
            });
        }
        
        const taskId = parseInt(req.params.id);
        
        if (isNaN(taskId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid task ID'
            });
        }
        
        const account = await getAccount();
        
        const tx = await studentTodoContract.methods.toggleTaskStatus(taskId).send({
            from: account,
            gas: 300000
        });
        
        res.json({
            success: true,
            transactionHash: tx.transactionHash,
            blockNumber: tx.blockNumber,
            message: 'Task status toggled successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Soft delete task
 * DELETE /api/tasks/:id
 */
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        if (!studentTodoContract) {
            return res.status(503).json({
                success: false,
                error: 'Smart contract not initialized'
            });
        }
        
        const taskId = parseInt(req.params.id);
        
        if (isNaN(taskId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid task ID'
            });
        }
        
        const account = await getAccount();
        
        const tx = await studentTodoContract.methods.softDeleteTask(taskId).send({
            from: account,
            gas: 300000
        });
        
        res.json({
            success: true,
            transactionHash: tx.transactionHash,
            blockNumber: tx.blockNumber,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Get task statistics
 * GET /api/stats/count
 */
app.get('/api/stats/count', async (req, res) => {
    try {
        if (!studentTodoContract) {
            return res.status(503).json({
                error: 'Smart contract not initialized'
            });
        }
        
        const account = await getAccount();
        
        const totalCount = await studentTodoContract.methods.getTaskCount().call({ from: account });
        const activeCount = await studentTodoContract.methods.getActiveTaskCount().call({ from: account });
        const completedCount = await studentTodoContract.methods.getCompletedTaskCount().call({ from: account });
        
        res.json({
            success: true,
            account: account,
            stats: {
                total: parseInt(totalCount),
                active: parseInt(activeCount),
                completed: parseInt(completedCount),
                deleted: parseInt(totalCount) - parseInt(activeCount)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Get user's tasks by address (for queries)
 * GET /api/users/:address/tasks
 */
app.get('/api/users/:address/tasks', async (req, res) => {
    try {
        if (!studentTodoContract) {
            return res.status(503).json({
                error: 'Smart contract not initialized'
            });
        }
        
        const userAddress = req.params.address;
        
        if (!isValidAddress(userAddress)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid Ethereum address'
            });
        }
        
        const tasks = await studentTodoContract.methods.getUserTasks(userAddress).call();
        
        const formattedTasks = tasks.map(task => ({
            id: parseInt(task.id),
            description: task.description,
            completed: task.completed,
            deleted: task.deleted,
            timestamp: parseInt(task.timestamp)
        }));
        
        res.json({
            success: true,
            userAddress: userAddress,
            tasks: formattedTasks,
            count: formattedTasks.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ==================== ERROR HANDLING ====================

/**
 * 404 handler
 */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        path: req.path
    });
});

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: err.message
    });
});

// ==================== SERVER INITIALIZATION ====================

async function startServer() {
    try {
        console.log('\n╔════════════════════════════════════════════════════════╗');
        console.log('║   Student ToDo List - Backend Server (v1.0.0)         ║');
        console.log('╚════════════════════════════════════════════════════════╝\n');
        
        // Step 1: Verify Ganache connection
        console.log('[1] Verifying Ganache connection...');
        const ganacheConnected = await verifyGanacheConnection();
        if (!ganacheConnected) {
            throw new Error('Failed to connect to Ganache. Ensure Ganache is running on http://127.0.0.1:7545');
        }
        
        // Step 2: Load contract ABI
        console.log('\n[2] Loading contract ABI...');
        if (!initializeContractABI()) {
            console.warn('⚠ Warning: Contract ABI not loaded. Deploy contract first.');
        }
        
        // Step 3: Initialize contract (if address provided)
        console.log('\n[3] Initializing smart contract...');
        if (CONTRACT_ADDRESS && CONTRACT_ADDRESS !== '') {
            if (!initializeContract(CONTRACT_ADDRESS)) {
                console.warn('⚠ Warning: Contract not initialized. Provide CONTRACT_ADDRESS in .env');
            }
        } else {
            console.warn('⚠ Warning: CONTRACT_ADDRESS not set in .env');
            console.log('After deploying, add to .env:\nCONTRACT_ADDRESS=<deployed_address>');
        }
        
        // Step 4: Start Express server
        console.log('\n[4] Starting Express server...');
        app.listen(PORT, () => {
            console.log(`✓ Server running on http://localhost:${PORT}`);
            console.log('\n╔════════════════════════════════════════════════════════╗');
            console.log('║              API ENDPOINTS AVAILABLE                   ║');
            console.log('╠════════════════════════════════════════════════════════╣');
            console.log('║ GET    /api/health              - Server health check  ║');
            console.log('║ GET    /api/wallet/connect      - Wallet info         ║');
            console.log('║ GET    /api/tasks               - Get all tasks       ║');
            console.log('║ GET    /api/tasks/:id           - Get single task     ║');
            console.log('║ POST   /api/tasks               - Create task         ║');
            console.log('║ PUT    /api/tasks/:id           - Edit task           ║');
            console.log('║ PATCH  /api/tasks/:id/toggle    - Toggle completion   ║');
            console.log('║ DELETE /api/tasks/:id           - Delete task         ║');
            console.log('║ GET    /api/stats/count         - Get statistics      ║');
            console.log('║ GET    /api/users/:address/tasks - Get user tasks     ║');
            console.log('╚════════════════════════════════════════════════════════╝\n');
        });
    } catch (error) {
        console.error('✗ Failed to start server:', error.message);
        process.exit(1);
    }
}

// Start the server
startServer();

module.exports = app;
