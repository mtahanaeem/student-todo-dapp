// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title StudentToDo
 * @dev Decentralized task management system for students
 * @author M. Taha Naeem, Suleman Ahmad, Adil Hayat Khan, Raziudin
 */
contract StudentToDo {
    
    // ==================== STRUCTS ====================
    
    /**
     * @dev Task structure containing all task information
     */
    struct Task {
        uint256 id;                    // Unique task identifier
        string description;            // Task description
        bool completed;                // Completion status
        bool deleted;                  // Soft delete flag
        uint256 timestamp;             // Task creation timestamp
    }
    
    // ==================== STATE VARIABLES ====================
    
    // Mapping from user address to their task array
    mapping(address => Task[]) private userTasks;
    
    // Mapping to track task count per user
    mapping(address => uint256) private taskCounter;
    
    // ==================== EVENTS ====================
    
    /**
     * @dev Emitted when a new task is added
     */
    event TaskAdded(
        address indexed user,
        uint256 indexed taskId,
        string description,
        uint256 timestamp
    );
    
    /**
     * @dev Emitted when a task is edited
     */
    event TaskEdited(
        address indexed user,
        uint256 indexed taskId,
        string newDescription,
        uint256 timestamp
    );
    
    /**
     * @dev Emitted when a task status is toggled
     */
    event TaskStatusToggled(
        address indexed user,
        uint256 indexed taskId,
        bool completed,
        uint256 timestamp
    );
    
    /**
     * @dev Emitted when a task is soft deleted
     */
    event TaskDeleted(
        address indexed user,
        uint256 indexed taskId,
        uint256 timestamp
    );
    
    // ==================== MODIFIERS ====================
    
    /**
     * @dev Ensures task exists and belongs to caller
     */
    modifier taskExists(uint256 _taskId) {
        require(_taskId < userTasks[msg.sender].length, "Task does not exist");
        _;
    }
    
    /**
     * @dev Ensures task is not deleted
     */
    modifier taskNotDeleted(uint256 _taskId) {
        require(!userTasks[msg.sender][_taskId].deleted, "Task is deleted");
        _;
    }
    
    /**
     * @dev Ensures non-empty description
     */
    modifier validDescription(string memory _description) {
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(bytes(_description).length <= 500, "Description too long");
        _;
    }
    
    // ==================== CORE FUNCTIONS ====================
    
    /**
     * @dev Add a new task for the caller
     * @param _description Task description
     * Requirements:
     * - Description must not be empty
     * - Description must not exceed 500 characters
     */
    function addTask(string memory _description) 
        public 
        validDescription(_description)
    {
        uint256 taskId = userTasks[msg.sender].length;
        
        Task memory newTask = Task({
            id: taskId,
            description: _description,
            completed: false,
            deleted: false,
            timestamp: block.timestamp
        });
        
        userTasks[msg.sender].push(newTask);
        taskCounter[msg.sender]++;
        
        emit TaskAdded(msg.sender, taskId, _description, block.timestamp);
    }
    
    /**
     * @dev Edit an existing task description
     * @param _taskId ID of the task to edit
     * @param _description New task description
     * Requirements:
     * - Task must exist and not be deleted
     * - New description must be valid
     */
    function editTask(uint256 _taskId, string memory _description)
        public
        taskExists(_taskId)
        taskNotDeleted(_taskId)
        validDescription(_description)
    {
        userTasks[msg.sender][_taskId].description = _description;
        
        emit TaskEdited(msg.sender, _taskId, _description, block.timestamp);
    }
    
    /**
     * @dev Toggle task completion status
     * @param _taskId ID of the task to toggle
     * Requirements:
     * - Task must exist and not be deleted
     */
    function toggleTaskStatus(uint256 _taskId)
        public
        taskExists(_taskId)
        taskNotDeleted(_taskId)
    {
        userTasks[msg.sender][_taskId].completed = !userTasks[msg.sender][_taskId].completed;
        
        emit TaskStatusToggled(
            msg.sender,
            _taskId,
            userTasks[msg.sender][_taskId].completed,
            block.timestamp
        );
    }
    
    /**
     * @dev Soft delete a task (marks as deleted without removing from blockchain)
     * @param _taskId ID of the task to delete
     * Requirements:
     * - Task must exist and not already be deleted
     */
    function softDeleteTask(uint256 _taskId)
        public
        taskExists(_taskId)
        taskNotDeleted(_taskId)
    {
        userTasks[msg.sender][_taskId].deleted = true;
        
        emit TaskDeleted(msg.sender, _taskId, block.timestamp);
    }
    
    // ==================== VIEW FUNCTIONS ====================
    
    /**
     * @dev Get a single task by ID
     * @param _taskId ID of the task to retrieve
     * @return Task structure
     * Requirements:
     * - Task must exist
     */
    function getTask(uint256 _taskId)
        public
        view
        taskExists(_taskId)
        returns (Task memory)
    {
        return userTasks[msg.sender][_taskId];
    }
    
    /**
     * @dev Get all tasks for the caller (including deleted ones for audit trail)
     * @return Array of all tasks
     */
    function getAllTasks() 
        public 
        view 
        returns (Task[] memory)
    {
        return userTasks[msg.sender];
    }
    
    /**
     * @dev Get all non-deleted tasks for the caller
     * @return Array of active tasks
     */
    function getActiveTasks()
        public
        view
        returns (Task[] memory)
    {
        // First count active tasks
        uint256 activeCount = 0;
        for (uint256 i = 0; i < userTasks[msg.sender].length; i++) {
            if (!userTasks[msg.sender][i].deleted) {
                activeCount++;
            }
        }
        
        // Create return array
        Task[] memory activeTasks = new Task[](activeCount);
        uint256 index = 0;
        for (uint256 i = 0; i < userTasks[msg.sender].length; i++) {
            if (!userTasks[msg.sender][i].deleted) {
                activeTasks[index] = userTasks[msg.sender][i];
                index++;
            }
        }
        
        return activeTasks;
    }
    
    /**
     * @dev Get total task count for the caller
     * @return Total number of tasks (including deleted)
     */
    function getTaskCount() 
        public 
        view 
        returns (uint256)
    {
        return userTasks[msg.sender].length;
    }
    
    /**
     * @dev Get active task count for the caller
     * @return Number of non-deleted tasks
     */
    function getActiveTaskCount()
        public
        view
        returns (uint256)
    {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < userTasks[msg.sender].length; i++) {
            if (!userTasks[msg.sender][i].deleted) {
                activeCount++;
            }
        }
        return activeCount;
    }
    
    /**
     * @dev Get completed task count for the caller
     * @return Number of completed tasks
     */
    function getCompletedTaskCount()
        public
        view
        returns (uint256)
    {
        uint256 completedCount = 0;
        for (uint256 i = 0; i < userTasks[msg.sender].length; i++) {
            if (!userTasks[msg.sender][i].deleted && userTasks[msg.sender][i].completed) {
                completedCount++;
            }
        }
        return completedCount;
    }
    
    /**
     * @dev Get task details by user address (for backend queries)
     * @param _user User wallet address
     * @return Array of all tasks for the user
     */
    function getUserTasks(address _user)
        public
        view
        returns (Task[] memory)
    {
        return userTasks[_user];
    }
}
