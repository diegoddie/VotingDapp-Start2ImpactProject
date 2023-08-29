import React, { useState } from 'react';
import { useAddress, useContract, useContractRead } from '@thirdweb-dev/react';

const CandidateCard = ({ candidate, onVote }) => {
  const { contract } = useContract("0x38e0d135E861807dc857C27f40103A6bE1F2Cbaa");
  const [isVoting, setIsVoting] = useState(false);
  const address = useAddress();
  const { data } = useContractRead(contract, "contractOwner");
  const contractOwner = data;
  const { data: addressHasVoted } = useContractRead(contract, "hasVoted", [address]);

  const handleVote = async () => {
    setIsVoting(true);
    await onVote(candidate.candidateId);
    setIsVoting(false);
  };
  

  return (
    <div className="border-gray-500 w-full max-w-sm border rounded-xl shadow">
      <div className="flex flex-col items-center pb-10">
        <div className='flex space-x-2'>
          <img className="mt-10 w-24 h-24 mb-3 rounded-full shadow-lg object-fill" src={candidate.candidatePhoto} alt="" />
        </div>
        <h5 className="mb-1 text-2xl font-medium">{candidate.candidateName} {candidate.candidateLastName}, {candidate.candidateAge}</h5>
        <div className='mt-3 flex space-x-2 items-center justify-center'>
          <span className="text-sm justify-center align-middle font-bold">{candidate.candidateParty}</span>
          <img className="w-16 h-16 rounded-full shadow-lg object-cover flex-grow" src={candidate.partyPhoto} alt="" />
        </div>
        {address && !addressHasVoted && (
          <div className="flex mt-2 space-x-3 md:mt-6">
            <button className="btn btn-primary" onClick={handleVote} disabled={isVoting}>
              {isVoting ? 'Loading...' : 'Vote'}
            </button>
          </div>
        )}
        {contractOwner && (
          <span className="mt-5 light:text-white">
            {contractOwner === address ? `Vote Counts: ${candidate.voteCount}` : ''}
          </span>
        )}
      </div>
    </div>
  );
};

export default CandidateCard;
