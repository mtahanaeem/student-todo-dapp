/**
 * Truffle Configuration for Student ToDo List DApp
 * Configured for Ganache Local Development Environment
 */

module.exports = {
  /**
   * Networks Configuration
   * Development network points to Ganache running on localhost:7545
   */
  networks: {
    development: {
      host: "127.0.0.1",        // Ganache localhost address
      port: 7545,               // Ganache default port
      network_id: "1337",       // Ganache chain ID
      gas: 6000000,             // Gas limit
      gasPrice: 2000000000,     // 2 Gwei - Standard gas price
      skipDryRun: true
    }
  },

  /**
   * Compiler Configuration
   */
  compilers: {
    solc: {
      version: "0.8.19",        // Solidity version matching pragma
      settings: {
        optimizer: {
          enabled: true,        // Enable gas optimization
          runs: 200             // Optimization runs
        },
        evmVersion: "london"    // EVM version for security
      }
    }
  },

  /**
   * Database Configuration
   */
  db: {
    enabled: false
  }
};
