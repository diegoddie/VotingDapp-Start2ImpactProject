const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Ballot", function () {
  async function deployContractFixture() {
    let owner;
    let alice;
    let bob;
    const campaignEndDate = Math.floor(Date.now() / 1000) + 60;

    const initialCandidates = [
      {
        id: 0,
        firstName: "John",
        lastName: "Doe",
        party: "Feline Unity Party",
        age: 35,
        partyPhoto: "https://freerangestock.com/sample/32279/cat-.jpg",
        candidatePhoto: "https://static.vecteezy.com/system/resources/previews/019/841/552/original/asian-businessman-cartoon-character-set-handsome-business-man-in-office-style-smart-shirt-png.png",
        voteCount: 0,
      },
      {
        id: 1,
        firstName: "Jane",
        lastName: "Smith",
        party: "Whisker's Choice Party",
        age: 42,
        partyPhoto: "https://st.depositphotos.com/1735158/2383/i/600/depositphotos_23835875-stock-photo-cat-and-flower-on-the.jpg",
        candidatePhoto: "https://static.vecteezy.com/system/resources/thumbnails/002/406/611/small/business-man-cartoon-character-vector.jpg",
        voteCount: 0,
      },
      {
        id: 2,
        firstName: "Mike",
        lastName: "Johnson",
        party: "Purrfect Progress Party",
        age: 28,
        partyPhoto: "https://images.unsplash.com/photo-1608848461950-0fe51dfc41cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D&w=1000&q=80",
        candidatePhoto: "https://t4.ftcdn.net/jpg/02/02/06/65/360_F_202066566_OEzmA65G1zeNuvy3XjYYzvnQmFaQ3YQI.jpg",
        voteCount: 0,
      }
    ];

    [owner, alice, bob] = await ethers.getSigners();

    const BallotContract = await hre.ethers.getContractFactory("Ballot");
    const ballotContract = await BallotContract.deploy(initialCandidates, campaignEndDate);

    await ballotContract.waitForDeployment();

    return { alice, bob, owner, ballotContract };
  }
  
  it("should allow a user to vote for a candidate", async function () {
    const { alice, owner, ballotContract } = await loadFixture(deployContractFixture);

    await ballotContract.connect(alice).vote(0);
  
    const votedCandidate = await ballotContract.candidates(0);
    expect(votedCandidate.voteCount).to.equal(1);
  
    const hasVoted = await ballotContract.hasVoted(alice.address);
    expect(hasVoted).to.be.true;
  });

  it("should prevent a user from voting twice", async function () {
    const { alice, owner, ballotContract } = await loadFixture(deployContractFixture);
  
    await ballotContract.connect(alice).vote(0);
    
    // Try to vote again for the same candidate
    await expect(ballotContract.connect(alice).vote(0)).to.be.revertedWith("You have already voted");
  });

  it("should prevent voting for a non-existent candidate", async function () {
    const { alice, ballotContract } = await loadFixture(deployContractFixture);
    const invalidCandidateId = 3; // Non-existent candidate ID
    
    await expect(ballotContract.connect(alice).vote(invalidCandidateId)).to.be.revertedWith("Invalid candidate ID");
  });
  
  it("should return the correct VoteCount for a candidate", async function () {
    const { alice, owner, ballotContract } = await loadFixture(deployContractFixture);
  
    await ballotContract.connect(alice).vote(1);
  
    const voteCount = await ballotContract.getVoteCount(1);
  
    expect(voteCount).to.equal(1);
  });
  
  it("should emit WinnerDeclared event with correct winner ID", async function () {
    const { alice, owner, ballotContract } = await loadFixture(deployContractFixture);
  
    await ballotContract.connect(alice).vote(1);
  
    await time.increase(60);

    const winner = await ballotContract.connect(owner).announceWinner();

    await expect(winner).to.emit(ballotContract, 'WinnerDeclared')
  });  
  
});