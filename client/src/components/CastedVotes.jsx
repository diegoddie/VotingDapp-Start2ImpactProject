import React, { useEffect, useState } from 'react';
import { getContract, startEventListening } from '../utils/EventListeners';

const CastedVotes = () => {
  const [voteInfo, setVoteInfo] = useState(null);

  useEffect(() => {
    const contract = getContract();
    const startBlock = 0; // Block number from which to start fetching past events

    // Fetch past events "VoteCast"
    async function fetchPastEvents() {
      try {
        const events = await contract.queryFilter(contract.filters.VoteCast(), startBlock);
        const voteCount = events.length;
        setVoteInfo(voteCount);
      } catch (error) {
        console.error('Error while fetching past events:', error);
      }
    }

    fetchPastEvents();

    // Start listening to real-time events
    startEventListening((candidateId, voter, event) => {
      let info = {
        candidateId: candidateId,
        voter: voter,
        event: event,
      };
      console.log(JSON.stringify(info, null, 4));
      setVoteInfo((prevVoteCount) => prevVoteCount + 1);
    });
  }, []);

  return (
        <div className="bg-slate-500 inline-flex items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide transition duration-200 rounded shadow-md dark:bg-slate-100 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none dark:text-black">
            <div className="text-xl font-bold items-center text-center">
                <div className="stat-title dark:text-black">Total Votes: <span className=''>{voteInfo !== null ? voteInfo : 'Loading...'}</span></div>
            </div>
        </div>
  );
};

export default CastedVotes;
