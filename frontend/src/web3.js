import Web3 from 'web3';

/**
 * Initialize Web3, request wallet connection and return useful objects.
 * - requests `eth_requestAccounts` so MetaMask opens on load
 * - returns { web3, provider, accounts, chainId, networkId }
 */
export async function initWeb3() {
  if (typeof window === 'undefined') throw new Error('Window object not available');
  const provider = window.ethereum;
  if (!provider) throw new Error('MetaMask (window.ethereum) not found. Please install MetaMask.');

  // Request connection (will prompt MetaMask)
  const accounts = await provider.request({ method: 'eth_requestAccounts' });

  const web3 = new Web3(provider);

  const chainId = await provider.request({ method: 'eth_chainId' }); // hex string
  const networkId = await web3.eth.net.getId(); // numeric id

  return { web3, provider, accounts, chainId, networkId };
}

/**
 * Subscribe to wallet events and forward to callbacks.
 * Returns an unsubscribe function.
 */
export function subscribeToProvider(provider, { onAccountsChanged, onChainChanged } = {}) {
  if (!provider || !provider.on) return () => {};

  const handleAccounts = (accounts) => {
    if (onAccountsChanged) onAccountsChanged(accounts);
  };

  const handleChain = (chainId) => {
    if (onChainChanged) onChainChanged(chainId);
  };

  provider.on('accountsChanged', handleAccounts);
  provider.on('chainChanged', handleChain);

  return () => {
    try {
      provider.removeListener('accountsChanged', handleAccounts);
      provider.removeListener('chainChanged', handleChain);
    } catch (e) {
      // ignore removal errors
    }
  };
}
