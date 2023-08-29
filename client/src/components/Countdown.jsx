import React, { useState, useEffect } from 'react'
import { useContract, useContractRead } from '@thirdweb-dev/react'

const Countdown = ({ onCampaignEnd }) => {
    const { contract } = useContract("0x38e0d135E861807dc857C27f40103A6bE1F2Cbaa");
    const { data: campaignEndDateInSeconds, isLoading } = useContractRead(contract, "campaignEndDate");
    const [countdown, setCountdown] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        if (!isLoading && campaignEndDateInSeconds) {
            const campaignEndDate = new Date(campaignEndDateInSeconds * 1000); // Converting seconds to milliseconds
            const interval = setInterval(() => {
                const currentTime = new Date().getTime();
                const timeDifference = campaignEndDate - currentTime;
                if (timeDifference > 0) {
                    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
                    setCountdown({ days, hours, minutes, seconds });
                } else {
                    clearInterval(interval);
                    onCampaignEnd();
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [campaignEndDateInSeconds, isLoading, onCampaignEnd]);

    return (
        <div className="flex gap-5">
            <div>
                <span className="countdown font-mono text-4xl">
                    <span style={{ "--value": countdown.days }}></span>
                </span>
                days
            </div>
            <div>
                <span className="countdown font-mono text-4xl">
                    <span style={{ "--value": countdown.hours }}></span>
                </span>
                hours
            </div>
            <div>
                <span className="countdown font-mono text-4xl">
                    <span style={{ "--value": countdown.minutes }}></span>
                </span>
                min
            </div>
            <div>
                <span className="countdown font-mono text-4xl">
                    <span style={{ "--value": countdown.seconds }}></span>
                </span>
                sec
            </div>
        </div>
    );
}

export default Countdown