/**
 * Wallet Info Component
 * Displays connected wallet address and balance
 */

import React from 'react';

const WalletInfo = ({ account }) => {
    const shortenAddress = (address) => {
        if (!address) return 'Not connected';
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">👤 Wallet</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                        Wallet Address
                    </p>
                    <p style={{ 
                        fontFamily: 'monospace', 
                        fontSize: '0.875rem', 
                        color: '#1f2937',
                        wordBreak: 'break-all',
                        fontWeight: 500
                    }}>
                        {shortenAddress(account)}
                    </p>
                </div>
                <div style={{ padding: '0.5rem 0' }}>
                    {account ? (
                        <span style={{ 
                            display: 'inline-block',
                            backgroundColor: '#dcfce7',
                            color: '#166534',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            fontWeight: 500
                        }}>
                            ✓ Connected
                        </span>
                    ) : (
                        <span style={{ 
                            display: 'inline-block',
                            backgroundColor: '#fee2e2',
                            color: '#991b1b',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            fontWeight: 500
                        }}>
                            ✗ Not Connected
                        </span>
                    )}
                </div>
                <p style={{ 
                    fontSize: '0.75rem', 
                    color: '#6b7280',
                    marginTop: '0.5rem',
                    fontStyle: 'italic'
                }}>
                    🔗 Connected to Ganache Network
                </p>
            </div>
        </div>
    );
};

export default WalletInfo;
