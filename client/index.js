import Abi from './src/artifacts/contracts/Ballot.sol/Ballot.json'
const ethers = require('ethers');

async function main(){
    const contractAddress = "0x929757D8a873f167d4ab38CB60Ae49f7628A5093"
    const webSocketProvider = new ethers.providers.WebSocketProvider("wss://eth-sepolia.g.alchemy.com/v2/dgkxe0vvBy7iJvhkcHQXYVer68ydTj45")
    const contract = new ethers.Contract(contractAddress, Abi.abi, webSocketProvider);

    contract.on("VoteCast", (candidateId, voter, event) => {
        let info = {
            candidateId: candidateId,
            voter: voter,
            event: event,
        };
        console.log(JSON.stringify(info, null, 4))
    });
}

main()
