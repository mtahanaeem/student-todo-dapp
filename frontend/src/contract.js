import StudentToDoArtifact from './contracts/StudentToDo.json';

/**
 * Load deployed contract for the current networkId using the provided web3 instance.
 * - Reads address from StudentToDoArtifact.networks[networkId].address
 * - Uses StudentToDoArtifact.abi as static ABI (no runtime generation)
 */
export async function loadContract(web3) {
  if (!web3) throw new Error('Web3 instance required');

  const networkId = await web3.eth.net.getId();

  const networks = StudentToDoArtifact.networks || {};
  const deployed = networks[networkId] || networks[String(networkId)];

  if (!deployed || !deployed.address) {
    throw new Error(`StudentToDo contract not found for network id ${networkId}. Ensure the contract is deployed and StudentToDo.json contains the networks mapping.`);
  }

  const contract = new web3.eth.Contract(StudentToDoArtifact.abi, deployed.address);

  return { contract, address: deployed.address, networkId };
}
