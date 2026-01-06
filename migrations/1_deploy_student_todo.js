/**
 * Truffle Migration: Deploy StudentToDo Contract
 * Migration Number: 1
 * Purpose: Deploy the StudentToDo smart contract to the network
 */

const StudentToDo = artifacts.require("StudentToDo");

module.exports = function(deployer) {
  // Deploy StudentToDo contract
  deployer.deploy(StudentToDo);
};
