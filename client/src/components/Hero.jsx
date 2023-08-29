import React, { useState, useEffect } from 'react';
import city3 from '../assets/city3.png';
import { useAddress, useContract, useContractRead, useContractWrite } from '@thirdweb-dev/react';
import Countdown from './Countdown';
import { Link } from 'react-router-dom';
import CastedVotes from './CastedVotes';
import WinnerButton from './WinnerButton';

const Hero = () => {
    const [isCampaignEnded, setIsCampaignEnded] = useState(false);
    const [isWinnerDeclared, setIsWinnerDeclared] = useState(false);
    const { contract } = useContract("0x38e0d135E861807dc857C27f40103A6bE1F2Cbaa");
    const address = useAddress();
    const { data } = useContractRead(contract, "contractOwner");
    const contractOwner = data;
    const { mutateAsync: declareWinner } = useContractWrite(contract, "announceWinner")
    let winnerName = "";

    const handleCampaignEnd = () => {
        setIsCampaignEnded(true);
    };

    const handleDeclareWinner = async() => {
        try {
            const data = await declareWinner();
            console.info("contract call successs", data);
        } catch (error) {
            console.error("contract call failure", error);
        }
        setIsWinnerDeclared(true);
    };

    useEffect(() => {
        const fetchWinnerName = async () => {
            if (isCampaignEnded && isWinnerDeclared && contract) {
                const winnerId = await contract.call("declareWinnerId");
                const winner = await contract.call("getCandidateById", [winnerId]);
                winnerName = `${winner.firstName} ${winner.lastName}`;
                setIsWinnerDeclared(true);
            }
        };
        fetchWinnerName();
    }, [isCampaignEnded, isWinnerDeclared, contract]);

    return (
        <>
            <div className='flex flex-col sm:flex-row justify-center items-center mt-4 sm:mb-8 sm:mt-10'>
                {!isCampaignEnded && <Countdown onCampaignEnd={handleCampaignEnd} />}
                <div className='sm:ml-20 justify-center items-center my-4'>
                    <CastedVotes />
                </div>
            </div>
            <div className="flex flex-col justify-between max-w-xl px-4 mx-auto lg:pt-4 lg:flex-row md:px-8 lg:max-w-screen-xl">
                <div className="lg:mb-0 lg:pt-4 lg:max-w-lg lg:pr-5">
                    <div className="max-w-xl mb-4">
                        <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight sm:text-4xl sm:leading-none mt-2">
                            Vote for the Mayor of Our City<br/>
                            <span className="mt-3 inline-block text-deep-purple-accent-400 sm:mt-3">
                                Make a Difference!
                            </span>
                        </h2>
                        <p className="text-base md:text-lg">
                            The crucial moment has arrived for our city! You have the opportunity to shape the future by voting for the next mayor. Connecting to Metamask is essential to participate in this important decision-making process. <br />
                            <span className="mt-3 inline-block text-deep-purple-accent-400">
                                The blockchain ensures the decentralization and transparency of the voting process, making it resistant to manipulation and fraud. <br/>
                            </span>
                            <span className="mt-3 inline-block text-deep-purple-accent-400">
                                Join us and make a difference for our city!
                            </span>
                        </p>
                    </div>
                    {(!isCampaignEnded || (isCampaignEnded && address !== contractOwner)) && (
                        <div className="flex items-center font-bold">
                            <Link
                                to="/candidates"
                                className="bg-slate-500 inline-flex items-center justify-center h-12 px-6 mr-6 font-bold tracking-wide transition duration-200 rounded shadow-md dark:bg-slate-100 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none dark:text-black transform hover:scale-105"
                            >
                                See Candidates and cast your Vote!
                            </Link>
                        </div>
                    )}
                    {isCampaignEnded && address === contractOwner && !isWinnerDeclared && (
                        <div className="flex items-center font-bold">
                            <WinnerButton onClick={handleDeclareWinner} />
                        </div>
                    )}
                    {isCampaignEnded && address !== contractOwner && (
                        <h1 className="text-2xl mt-6">Campaign ended.</h1>
                    )}
                    {isWinnerDeclared && (
                        <h2 className="text-2xl mt-6">Winner: {winnerName}</h2>
                    )}
                </div>
                <div className='lg:mt-12 md:w-auto sm:mt-32'>
                    <img
                        src={city3}
                        className="object-cover bg-none w-full h-64 mx-auto lg:h-auto xl:mr-24 md:max-w-sm mt-4"
                        alt=""
                    />
                </div>
            </div>
        </>
    );
}

export default Hero;
