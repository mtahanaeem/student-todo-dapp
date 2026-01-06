/**
 * Test Suite for StudentToDo Smart Contract
 * Framework: Truffle + Mocha + Chai
 * Purpose: Comprehensive testing of all contract functions
 */

const StudentToDo = artifacts.require("StudentToDo");

contract("StudentToDo", accounts => {
    let studentToDo;
    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];

    // ==================== SETUP ====================

    beforeEach(async () => {
        studentToDo = await StudentToDo.new();
    });

    // ==================== ADD TASK TESTS ====================

    describe("addTask", () => {
        it("should add a new task with correct properties", async () => {
            const description = "Complete assignment";
            const tx = await studentToDo.addTask(description, { from: user1 });

            // Verify task was added
            const task = await studentToDo.getTask(0, { from: user1 });
            assert.equal(task.id, 0, "Task ID should be 0");
            assert.equal(task.description, description, "Description should match");
            assert.equal(task.completed, false, "Task should not be completed initially");
            assert.equal(task.deleted, false, "Task should not be deleted initially");
            assert.isAbove(parseInt(task.timestamp), 0, "Timestamp should be set");
        });

        it("should emit TaskAdded event", async () => {
            const description = "Study for exam";
            const tx = await studentToDo.addTask(description, { from: user1 });

            const logs = tx.logs;
            assert.equal(logs.length, 1, "Should emit one event");
            assert.equal(logs[0].event, "TaskAdded", "Event should be TaskAdded");
            assert.equal(logs[0].args.user, user1, "User address should match");
            assert.equal(logs[0].args.description, description, "Description should match");
        });

        it("should reject empty description", async () => {
            try {
                await studentToDo.addTask("", { from: user1 });
                assert.fail("Should have thrown error");
            } catch (error) {
                assert.include(error.message, "Description cannot be empty", "Should reject empty description");
            }
        });

        it("should reject description longer than 500 characters", async () => {
            const longDescription = "a".repeat(501);
            try {
                await studentToDo.addTask(longDescription, { from: user1 });
                assert.fail("Should have thrown error");
            } catch (error) {
                assert.include(error.message, "Description too long", "Should reject long description");
            }
        });

        it("should allow multiple tasks per user", async () => {
            await studentToDo.addTask("Task 1", { from: user1 });
            await studentToDo.addTask("Task 2", { from: user1 });
            await studentToDo.addTask("Task 3", { from: user1 });

            const count = await studentToDo.getTaskCount({ from: user1 });
            assert.equal(count, 3, "Should have 3 tasks");
        });

        it("should isolate tasks per user", async () => {
            await studentToDo.addTask("User1 Task", { from: user1 });
            await studentToDo.addTask("User2 Task", { from: user2 });

            const user1Count = await studentToDo.getTaskCount({ from: user1 });
            const user2Count = await studentToDo.getTaskCount({ from: user2 });

            assert.equal(user1Count, 1, "User1 should have 1 task");
            assert.equal(user2Count, 1, "User2 should have 1 task");
        });
    });

    // ==================== EDIT TASK TESTS ====================

    describe("editTask", () => {
        beforeEach(async () => {
            await studentToDo.addTask("Original description", { from: user1 });
        });

        it("should edit task description", async () => {
            const newDescription = "Updated description";
            await studentToDo.editTask(0, newDescription, { from: user1 });

            const task = await studentToDo.getTask(0, { from: user1 });
            assert.equal(task.description, newDescription, "Description should be updated");
        });

        it("should emit TaskEdited event", async () => {
            const newDescription = "New task description";
            const tx = await studentToDo.editTask(0, newDescription, { from: user1 });

            const logs = tx.logs;
            assert.equal(logs[0].event, "TaskEdited", "Event should be TaskEdited");
            assert.equal(logs[0].args.newDescription, newDescription, "New description should be in event");
        });

        it("should not edit non-existent task", async () => {
            try {
                await studentToDo.editTask(999, "New description", { from: user1 });
                assert.fail("Should have thrown error");
            } catch (error) {
                assert.include(error.message, "Task does not exist", "Should reject non-existent task");
            }
        });

        it("should not edit deleted task", async () => {
            await studentToDo.softDeleteTask(0, { from: user1 });

            try {
                await studentToDo.editTask(0, "New description", { from: user1 });
                assert.fail("Should have thrown error");
            } catch (error) {
                assert.include(error.message, "Task is deleted", "Should reject deleted task");
            }
        });

        it("should not edit with empty description", async () => {
            try {
                await studentToDo.editTask(0, "", { from: user1 });
                assert.fail("Should have thrown error");
            } catch (error) {
                assert.include(error.message, "Description cannot be empty", "Should reject empty description");
            }
        });
    });

    // ==================== TOGGLE TASK STATUS TESTS ====================

    describe("toggleTaskStatus", () => {
        beforeEach(async () => {
            await studentToDo.addTask("Task to toggle", { from: user1 });
        });

        it("should toggle task from incomplete to complete", async () => {
            let task = await studentToDo.getTask(0, { from: user1 });
            assert.equal(task.completed, false, "Task should be incomplete initially");

            await studentToDo.toggleTaskStatus(0, { from: user1 });

            task = await studentToDo.getTask(0, { from: user1 });
            assert.equal(task.completed, true, "Task should be completed");
        });

        it("should toggle task from complete back to incomplete", async () => {
            await studentToDo.toggleTaskStatus(0, { from: user1 });
            let task = await studentToDo.getTask(0, { from: user1 });
            assert.equal(task.completed, true, "Task should be completed");

            await studentToDo.toggleTaskStatus(0, { from: user1 });

            task = await studentToDo.getTask(0, { from: user1 });
            assert.equal(task.completed, false, "Task should be incomplete");
        });

        it("should emit TaskStatusToggled event", async () => {
            const tx = await studentToDo.toggleTaskStatus(0, { from: user1 });

            const logs = tx.logs;
            assert.equal(logs[0].event, "TaskStatusToggled", "Event should be TaskStatusToggled");
            assert.equal(logs[0].args.completed, true, "Completed status should be true");
        });

        it("should not toggle non-existent task", async () => {
            try {
                await studentToDo.toggleTaskStatus(999, { from: user1 });
                assert.fail("Should have thrown error");
            } catch (error) {
                assert.include(error.message, "Task does not exist", "Should reject non-existent task");
            }
        });

        it("should not toggle deleted task", async () => {
            await studentToDo.softDeleteTask(0, { from: user1 });

            try {
                await studentToDo.toggleTaskStatus(0, { from: user1 });
                assert.fail("Should have thrown error");
            } catch (error) {
                assert.include(error.message, "Task is deleted", "Should reject deleted task");
            }
        });
    });

    // ==================== SOFT DELETE TASK TESTS ====================

    describe("softDeleteTask", () => {
        beforeEach(async () => {
            await studentToDo.addTask("Task to delete", { from: user1 });
        });

        it("should soft delete a task", async () => {
            let task = await studentToDo.getTask(0, { from: user1 });
            assert.equal(task.deleted, false, "Task should not be deleted initially");

            await studentToDo.softDeleteTask(0, { from: user1 });

            task = await studentToDo.getTask(0, { from: user1 });
            assert.equal(task.deleted, true, "Task should be marked as deleted");
        });

        it("should emit TaskDeleted event", async () => {
            const tx = await studentToDo.softDeleteTask(0, { from: user1 });

            const logs = tx.logs;
            assert.equal(logs[0].event, "TaskDeleted", "Event should be TaskDeleted");
            assert.equal(logs[0].args.taskId, 0, "Task ID should be in event");
        });

        it("should not delete non-existent task", async () => {
            try {
                await studentToDo.softDeleteTask(999, { from: user1 });
                assert.fail("Should have thrown error");
            } catch (error) {
                assert.include(error.message, "Task does not exist", "Should reject non-existent task");
            }
        });

        it("should not delete already deleted task", async () => {
            await studentToDo.softDeleteTask(0, { from: user1 });

            try {
                await studentToDo.softDeleteTask(0, { from: user1 });
                assert.fail("Should have thrown error");
            } catch (error) {
                assert.include(error.message, "Task is deleted", "Should reject already deleted task");
            }
        });

        it("should keep deleted task in blockchain", async () => {
            await studentToDo.softDeleteTask(0, { from: user1 });

            const task = await studentToDo.getTask(0, { from: user1 });
            assert.isNotNull(task, "Task should still exist on blockchain");
            assert.equal(task.description, "Task to delete", "Task data should be preserved");
        });
    });

    // ==================== GET TASK TESTS ====================

    describe("getTask", () => {
        beforeEach(async () => {
            await studentToDo.addTask("Test task", { from: user1 });
        });

        it("should retrieve task by ID", async () => {
            const task = await studentToDo.getTask(0, { from: user1 });
            assert.equal(task.id, 0, "Task ID should match");
            assert.equal(task.description, "Test task", "Description should match");
        });

        it("should not retrieve non-existent task", async () => {
            try {
                await studentToDo.getTask(999, { from: user1 });
                assert.fail("Should have thrown error");
            } catch (error) {
                assert.include(error.message, "Task does not exist", "Should reject non-existent task");
            }
        });

        it("should not retrieve task of another user", async () => {
            try {
                await studentToDo.getTask(0, { from: user2 });
                assert.fail("Should have thrown error");
            } catch (error) {
                assert.include(error.message, "Task does not exist", "Should not find other user's task");
            }
        });
    });

    // ==================== GET ALL TASKS TESTS ====================

    describe("getAllTasks", () => {
        it("should return empty array for user with no tasks", async () => {
            const tasks = await studentToDo.getAllTasks({ from: user1 });
            assert.equal(tasks.length, 0, "Should return empty array");
        });

        it("should return all tasks for user", async () => {
            await studentToDo.addTask("Task 1", { from: user1 });
            await studentToDo.addTask("Task 2", { from: user1 });
            await studentToDo.addTask("Task 3", { from: user1 });

            const tasks = await studentToDo.getAllTasks({ from: user1 });
            assert.equal(tasks.length, 3, "Should return all 3 tasks");
            assert.equal(tasks[0].description, "Task 1", "First task should match");
            assert.equal(tasks[2].description, "Task 3", "Third task should match");
        });

        it("should include deleted tasks in getAllTasks", async () => {
            await studentToDo.addTask("Task 1", { from: user1 });
            await studentToDo.addTask("Task 2", { from: user1 });
            await studentToDo.softDeleteTask(0, { from: user1 });

            const tasks = await studentToDo.getAllTasks({ from: user1 });
            assert.equal(tasks.length, 2, "Should include deleted task");
            assert.equal(tasks[0].deleted, true, "First task should be marked deleted");
        });
    });

    // ==================== GET ACTIVE TASKS TESTS ====================

    describe("getActiveTasks", () => {
        it("should exclude deleted tasks", async () => {
            await studentToDo.addTask("Task 1", { from: user1 });
            await studentToDo.addTask("Task 2", { from: user1 });
            await studentToDo.addTask("Task 3", { from: user1 });
            await studentToDo.softDeleteTask(1, { from: user1 });

            const activeTasks = await studentToDo.getActiveTasks({ from: user1 });
            assert.equal(activeTasks.length, 2, "Should have 2 active tasks");
            assert.equal(activeTasks[0].description, "Task 1", "First active task correct");
            assert.equal(activeTasks[1].description, "Task 3", "Second active task correct");
        });
    });

    // ==================== GET TASK COUNT TESTS ====================

    describe("getTaskCount", () => {
        it("should return 0 for user with no tasks", async () => {
            const count = await studentToDo.getTaskCount({ from: user1 });
            assert.equal(count, 0, "Count should be 0");
        });

        it("should return correct task count including deleted", async () => {
            await studentToDo.addTask("Task 1", { from: user1 });
            await studentToDo.addTask("Task 2", { from: user1 });
            await studentToDo.addTask("Task 3", { from: user1 });
            await studentToDo.softDeleteTask(1, { from: user1 });

            const count = await studentToDo.getTaskCount({ from: user1 });
            assert.equal(count, 3, "Count should include deleted tasks");
        });

        it("should track independent counts per user", async () => {
            await studentToDo.addTask("User1 Task 1", { from: user1 });
            await studentToDo.addTask("User1 Task 2", { from: user1 });
            await studentToDo.addTask("User2 Task 1", { from: user2 });

            const count1 = await studentToDo.getTaskCount({ from: user1 });
            const count2 = await studentToDo.getTaskCount({ from: user2 });

            assert.equal(count1, 2, "User1 should have 2 tasks");
            assert.equal(count2, 1, "User2 should have 1 task");
        });
    });

    // ==================== GET ACTIVE TASK COUNT TESTS ====================

    describe("getActiveTaskCount", () => {
        it("should return count excluding deleted tasks", async () => {
            await studentToDo.addTask("Task 1", { from: user1 });
            await studentToDo.addTask("Task 2", { from: user1 });
            await studentToDo.addTask("Task 3", { from: user1 });
            await studentToDo.softDeleteTask(1, { from: user1 });

            const count = await studentToDo.getActiveTaskCount({ from: user1 });
            assert.equal(count, 2, "Should have 2 active tasks");
        });
    });

    // ==================== GET COMPLETED TASK COUNT TESTS ====================

    describe("getCompletedTaskCount", () => {
        it("should return count of completed non-deleted tasks", async () => {
            await studentToDo.addTask("Task 1", { from: user1 });
            await studentToDo.addTask("Task 2", { from: user1 });
            await studentToDo.addTask("Task 3", { from: user1 });

            await studentToDo.toggleTaskStatus(0, { from: user1 });
            await studentToDo.toggleTaskStatus(2, { from: user1 });

            const count = await studentToDo.getCompletedTaskCount({ from: user1 });
            assert.equal(count, 2, "Should have 2 completed tasks");
        });

        it("should not count deleted tasks as completed", async () => {
            await studentToDo.addTask("Task 1", { from: user1 });
            await studentToDo.addTask("Task 2", { from: user1 });

            await studentToDo.toggleTaskStatus(0, { from: user1 });
            await studentToDo.toggleTaskStatus(1, { from: user1 });
            await studentToDo.softDeleteTask(1, { from: user1 });

            const count = await studentToDo.getCompletedTaskCount({ from: user1 });
            assert.equal(count, 1, "Should count only non-deleted completed tasks");
        });
    });

    // ==================== GET USER TASKS TESTS ====================

    describe("getUserTasks", () => {
        it("should allow querying tasks of any user address", async () => {
            await studentToDo.addTask("User2 Task", { from: user2 });

            const tasks = await studentToDo.getUserTasks(user2, { from: user1 });
            assert.equal(tasks.length, 1, "Should return user2's tasks");
            assert.equal(tasks[0].description, "User2 Task", "Task description should match");
        });
    });

    // ==================== ACCESS CONTROL TESTS ====================

    describe("Access Control", () => {
        it("should prevent user from modifying another user's task", async () => {
            await studentToDo.addTask("User1 Task", { from: user1 });

            try {
                await studentToDo.toggleTaskStatus(0, { from: user2 });
                assert.fail("Should have thrown error");
            } catch (error) {
                assert.include(error.message, "Task does not exist", "Should prevent access to other user's tasks");
            }
        });

        it("should isolate task operations by user", async () => {
            await studentToDo.addTask("User1 Task", { from: user1 });
            await studentToDo.addTask("User2 Task 1", { from: user2 });
            await studentToDo.addTask("User2 Task 2", { from: user2 });

            const user1Tasks = await studentToDo.getAllTasks({ from: user1 });
            const user2Tasks = await studentToDo.getAllTasks({ from: user2 });

            assert.equal(user1Tasks.length, 1, "User1 should only see their task");
            assert.equal(user2Tasks.length, 2, "User2 should only see their tasks");
        });
    });
});
