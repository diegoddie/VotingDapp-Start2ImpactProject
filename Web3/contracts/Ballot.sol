// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Ballot {
    struct Candidate {
        uint256 id;
        string firstName;
        string lastName;
        string party;
        uint256 age;
        string partyPhoto;
        string candidatePhoto;
        uint256 voteCount;
    }

    Candidate[] public candidates;
    mapping(address => bool) public hasVoted;
    address public contractOwner;
    uint256 public campaignStartDate;
    uint256 public campaignEndDate;

    event VoteCast(address indexed voter);
    event WinnerDeclared(uint256 indexed candidateId, uint256 voteCount);
    event CandidateAdded(uint256 indexed candidateId, string firstName, string lastName);

    modifier onlyOwner() {
        require(msg.sender == contractOwner, "Only contract owner can perform this action");
        _;
    }

    constructor(Candidate[] memory _initialCandidates, uint256 _campaignEndDate) {
        contractOwner = msg.sender;
        campaignStartDate = block.timestamp;
        campaignEndDate = _campaignEndDate;

        for (uint256 i = 0; i < _initialCandidates.length; i++) {
            Candidate memory newCandidate = _initialCandidates[i];
            require(newCandidate.age >= 18, "Candidates must be at least 18 years old");
            newCandidate.id = i;
            candidates.push(newCandidate);
            emit CandidateAdded(newCandidate.id, newCandidate.firstName, newCandidate.lastName);
        }
    }

    function vote(uint256 _candidateId) public {
        require(!hasVoted[msg.sender], "You have already voted");
        require(block.timestamp <= campaignEndDate, "Voting period has ended");
        require(_candidateId < candidates.length, "Invalid candidate ID");

        Candidate storage candidate = candidates[_candidateId];
        candidate.voteCount++;

        hasVoted[msg.sender] = true;

        emit VoteCast(msg.sender);
    }

    function declareWinnerId() public view onlyOwner returns (uint256) {
        uint256 maxVoteCount = 0;
        uint256 winningCandidateId;

        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > maxVoteCount) {
                maxVoteCount = candidates[i].voteCount;
                winningCandidateId = i;
            }
        }

        return winningCandidateId;
    }

    function announceWinner() public onlyOwner {
        uint256 winningCandidateId = declareWinnerId();
        uint256 maxVoteCount = candidates[winningCandidateId].voteCount;
        emit WinnerDeclared(winningCandidateId, maxVoteCount);
    }

    function getCandidatesCount() public view returns (uint256) {
        return candidates.length;
    }

    function getVoteCount(uint256 _candidateId) public view returns (uint256) {
        require(_candidateId < candidates.length, "Invalid candidate ID");

        return candidates[_candidateId].voteCount;
    }

    function getCandidateById(uint256 candidateId) public view returns (Candidate memory) {
        require(candidateId < candidates.length, "Invalid candidate ID");
        return candidates[candidateId];
    }
}
