// EventListeners with ether.js for listening to how many "VoteCast" events are emitted
import Abi from '../artifacts/contracts/Ballot.sol/Ballot.json'
const ethers = require('ethers');


export function startEventListening(callback) {
  const contractAddress = "0x38e0d135E861807dc857C27f40103A6bE1F2Cbaa"
  const webSocketProvider = new ethers.providers.WebSocketProvider(process.env.REACT_APP_WEBSOCKET)
  const contract = new ethers.Contract(contractAddress, Abi.abi, webSocketProvider);

  contract.on("VoteCast", (candidateId, voter, event) => {
    let info = {
      candidateId: candidateId,
      voter: voter,
      event: event,
    };
    callback(info);
  });
}

export function getContract() {
  const contractAddress = "0x38e0d135E861807dc857C27f40103A6bE1F2Cbaa"
  const webSocketProvider = new ethers.providers.WebSocketProvider("wss://eth-sepolia.g.alchemy.com/v2/dgkxe0vvBy7iJvhkcHQXYVer68ydTj45")
  const contract = new ethers.Contract(contractAddress, Abi.abi, webSocketProvider);
  return contract;
}
