import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

/**
 * WalletSwitcher Component
 * Allows switching between Ganache test accounts
 */
const WalletSwitcher = ({ onAccountChange, currentAccount }) => {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [balances, setBalances] = useState({});
    const [loadingBalance, setLoadingBalance] = useState(false);

    // Initialize Web3 and fetch accounts on mount
    useEffect(() => {
        const initializeAccounts = async () => {
            try {
                if (window.ethereum) {
                    const web3 = new Web3(window.ethereum);
                    
                    // Request accounts from MetaMask
                    const allAccounts = await window.ethereum.request({
                        method: 'eth_requestAccounts'
                    });
                    
                    setAccounts(allAccounts);
                    if (currentAccount) {
                        setSelectedAccount(currentAccount);
                    } else if (allAccounts.length > 0) {
                        setSelectedAccount(allAccounts[0]);
                    }
                    
                    // Load balances
                    await loadBalances(web3, allAccounts);
                }
            } catch (error) {
                console.error('Error initializing accounts:', error);
            }
        };
        
        initializeAccounts();
    }, [currentAccount]);

    // Load ETH balances for all accounts
    const loadBalances = async (web3, accountsList) => {
        setLoadingBalance(true);
        try {
            const web3Instance = web3 || new Web3(window.ethereum);
            const balanceMap = {};
            
            for (const account of accountsList) {
                const balance = await web3Instance.eth.getBalance(account);
                balanceMap[account] = web3Instance.utils.fromWei(balance, 'ether');
            }
            
            setBalances(balanceMap);
        } catch (error) {
            console.error('Error loading balances:', error);
        }
        setLoadingBalance(false);
    };

    // Handle account change
    const handleAccountChange = (account) => {
        setSelectedAccount(account);
        if (onAccountChange) {
            onAccountChange(account);
        }
    };

    // Format address for display
    const formatAddress = (address) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <span style={styles.title}>💰 Switch Account</span>
            </div>
            
            {accounts.length > 0 ? (
                <div style={styles.accountsList}>
                    {accounts.map((account, index) => (
                        <button
                            key={account}
                            onClick={() => handleAccountChange(account)}
                            style={{
                                ...styles.accountButton,
                                ...(selectedAccount === account ? styles.accountButtonActive : {})
                            }}
                        >
                            <div style={styles.accountInfo}>
                                <div style={styles.accountLabel}>
                                    Account {index + 1}
                                </div>
                                <div style={styles.accountAddress}>
                                    {formatAddress(account)}
                                </div>
                            </div>
                            <div style={styles.accountBalance}>
                                {loadingBalance ? (
                                    <span>⏳</span>
                                ) : (
                                    <>
                                        {balances[account] 
                                            ? parseFloat(balances[account]).toFixed(2) 
                                            : '0.00'} ETH
                                    </>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            ) : (
                <div style={styles.noAccounts}>
                    No accounts available
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    header: {
        marginBottom: '12px',
        paddingBottom: '8px',
        borderBottom: '1px solid #f0f0f0'
    },
    title: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#333'
    },
    accountsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    accountButton: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 12px',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        backgroundColor: '#f9fafb',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontSize: '13px'
    },
    accountButtonActive: {
        backgroundColor: '#e0e7ff',
        borderColor: '#6366f1',
        boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.1)'
    },
    accountInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        textAlign: 'left'
    },
    accountLabel: {
        fontSize: '12px',
        fontWeight: '600',
        color: '#333'
    },
    accountAddress: {
        fontSize: '11px',
        color: '#666',
        fontFamily: 'monospace'
    },
    accountBalance: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#10b981'
    },
    noAccounts: {
        padding: '12px',
        textAlign: 'center',
        color: '#999',
        fontSize: '13px'
    }
};

export default WalletSwitcher;
