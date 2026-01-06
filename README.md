# 📝 Student ToDo List DApp

A **Blockchain-based decentralized ToDo List application** designed for students.  
This DApp allows users to securely manage their tasks using **Ethereum blockchain**, ensuring transparency, immutability, and wallet-based ownership.

---

## 🚀 Project Overview

The **Student ToDo List DApp** enables users to:
- Connect their wallet using **MetaMask**
- Add, view, update, and complete tasks
- Store tasks **on-chain** using smart contracts
- Access their own tasks using their Ethereum address

Each wallet address acts as a **unique student identity**, ensuring privacy and decentralized control.

---

## 🧠 Key Features

- 🔐 MetaMask Wallet Authentication  
- 📦 Tasks stored securely on Ethereum Blockchain  
- 🧾 Add, update, complete, and delete tasks  
- 👤 Wallet-based task ownership  
- 🔄 Auto-detects network & contract address  
- ⚡ Real-time blockchain interaction  

---

## 🛠️ Tech Stack

| Layer | Technology |
|-----|-----------|
| Smart Contract | Solidity |
| Blockchain | Ethereum (Ganache – Local) |
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

## ⚙️ Installation & Setup (Windows)

### 🔹 Prerequisites
- Node.js (v16+)
- Truffle (`npm install -g truffle`)
- Ganache
- MetaMask

### 🔹 Clone Repository
```
git clone https://github.com/mtahanaeem/student-todo-dapp.git
cd student-todo-dapp
```

### 🔹 Install Dependencies

Backend:
```
cd backend
npm install
```

Frontend:
```
cd ../frontend
npm install
```

### 🔹 Start Ganache
- Open Ganache
- Create workspace
- Copy RPC URL & Mnemonic
- Import mnemonic into MetaMask

### 🔹 Compile & Deploy Smart Contract
```
truffle compile
truffle migrate --reset
```

### 🔹 Run Backend (Optional)
```
cd backend
node server.js
```

### 🔹 Run Frontend
```
cd frontend
npm start
```

App runs at `http://localhost:3000`

---

## 🔐 MetaMask & Ganache Accounts

Ganache provides 10 test accounts.  
Switch MetaMask accounts to act as different users.  
Each account has its own tasks stored on-chain.

---

## 🎓 Academic Purpose

Developed as a **Blockchain course project** demonstrating smart contracts, Web3, and decentralized architecture.

---

## 🙏 Acknowledgment

Special thanks to **Ms. Syeda Tayyaba Bukhari** for her guidance and support.

---

## 👤 Author

**Muhammad Taha Naeem**  
GitHub: https://github.com/mtahanaeem
