# 📝 Student ToDo List DApp

![Solidity](https://img.shields.io/badge/Solidity-363636?logo=solidity&logoColor=white)
![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?logo=ethereum&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Web3.js](https://img.shields.io/badge/Web3.js-F16822?logo=web3.js&logoColor=white)
![Truffle](https://img.shields.io/badge/Truffle-5E464D?logo=ethereum&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

A **blockchain-based decentralized ToDo List application** designed for students. This DApp allows users to securely manage their tasks using the **Ethereum blockchain**, ensuring transparency, immutability, and wallet-based ownership.

---

## ✨ Features

- 🔐 **MetaMask Wallet Authentication** — Connect your wallet to get started
- 📦 **On-Chain Storage** — Tasks stored securely on the Ethereum blockchain
- ➕ **Full CRUD** — Add, update, complete, and delete tasks
- 👤 **Wallet-Based Ownership** — Each wallet is a unique student identity
- 🔄 **Auto Network Detection** — Automatically detects network & contract address
- ⚡ **Real-Time Interaction** — Instant blockchain reads and writes

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart Contract | Solidity |
| Blockchain | Ethereum (Ganache — Local) |
| Framework | Truffle |
| Frontend | React.js |
| Blockchain API | Web3.js |
| Backend (Optional) | Node.js + Express |
| Wallet | MetaMask |

---

## 📁 Project Structure

```
student-todo-dapp/
├── contracts/
│   └── StudentToDo.sol
├── migrations/
│   └── 1_deploy_student_todo.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── contracts/
│       ├── web3.js
│       └── App.js
├── backend/
│   ├── server.js
│   └── package.json
├── test/
│   └── StudentToDo.test.js
├── truffle-config.js
├── README.md
└── .env.example
```

---

## 🚀 Setup

### Prerequisites

- Node.js (v16+)
- Truffle (`npm install -g truffle`)
- Ganache
- MetaMask

### Installation

```bash
git clone https://github.com/mtahanaeem/student-todo-dapp.git
cd student-todo-dapp

# Install backend
cd backend
npm install

# Install frontend
cd ../frontend
npm install
```

### Start Ganache

Open Ganache, create a workspace, copy the RPC URL & mnemonic, then import the mnemonic into MetaMask.

### Compile & Deploy Smart Contract

```bash
truffle compile
truffle migrate --reset
```

### Run Backend (Optional)

```bash
cd backend
node server.js
```

### Run Frontend

```bash
cd frontend
npm start
```

App runs at **http://localhost:3000**

---

## 🔐 MetaMask & Ganache Accounts

Ganache provides 10 test accounts. Switch MetaMask accounts to act as different users. Each account has its own tasks stored on-chain.

---

## 🎓 Academic Purpose

Developed as a **Blockchain course project** demonstrating smart contracts, Web3, and decentralized architecture.

## 🙏 Acknowledgment

Special thanks to **Ms. Syeda Tayyaba Bukhari** for her guidance and support.

---

## 👤 Author

**Muhammad Taha Naeem**

- 📧 muhamadtahanaeem.pro@gmail.com
- 🐙 [mtahanaeem](https://github.com/mtahanaeem)
