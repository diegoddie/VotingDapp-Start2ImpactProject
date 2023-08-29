import React, { useEffect, useState } from 'react'
import CandidateCard from '../components/CandidateCard'
import { useContract, useContractWrite, useAddress, useContractRead } from "@thirdweb-dev/react";

const Candidates = () => {
    const [candidates, setCandidates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { contract } = useContract("0x38e0d135E861807dc857C27f40103A6bE1F2Cbaa");
    const { mutateAsync: vote } = useContractWrite(contract, "vote")
    const address = useAddress();
    const { data: addressHasVoted } = useContractRead(contract, "hasVoted", [address])

    const getCandidates = async () => {
        if (contract) { 
          const candidatesCount = await contract.call("getCandidatesCount");
          
          const parsedCandidates = [];
      
          for (let i = 0; i < candidatesCount; i++) {
            const candidate = await contract.call('candidates', [i]);
      
            parsedCandidates.push({
              candidateId: Number(candidate.id),
              candidateName: candidate.firstName,
              candidateLastName: candidate.lastName,
              candidateAge: Number(candidate.age),
              candidateParty: candidate.party,
              candidatePhoto: candidate.candidatePhoto,
              partyPhoto: candidate.partyPhoto,
              voteCount: Number(candidate.voteCount)
            });
          }
      
          console.log(parsedCandidates);
          setCandidates(parsedCandidates);
        }
      };

    useEffect(() => {
        const fetchData = async () => {
          setIsLoading(true);
          await getCandidates();
          setIsLoading(false);
        };
        fetchData();
    }, [contract]);

    const handleVote = async (_candidateId) => {
        setIsLoading(true);
        try {
            const data = await vote({ args: [_candidateId] });
            console.info("contract call successs", data);
        } catch (error) {
            console.error("contract call failure", error);
        }
        setIsLoading(false);
    };

    return (
        <>  
            {isLoading && (
                <div className="flex justify-center mt-10">
                    <span className="loading loading-spinner text-primary"></span>
                </div>
            )}
            
            {address && addressHasVoted && (
            <div className="items-center justify-center flex">
                <span className="mt-3 text-3xl font-bold text-center text-deep-purple-accent-400">
                Thank you for making a difference by voting!
                </span>
            </div>
            )}
            <div className='mt-10 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4'>
                {candidates.map((candidate) => (
                    <CandidateCard
                        key={candidate.candidateId}
                        candidate={candidate}
                        onVote={() => handleVote(candidate.candidateId)}
                    />
                ))}
            </div>
        </>
    )
}

export default Candidates
