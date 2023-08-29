const hre = require("hardhat");
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

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

  const campaignDurationInSeconds = 3 * 30 * 24 * 60 * 60; // 3 Months
  const campaignEndDate = Math.floor(Date.now() / 1000) + campaignDurationInSeconds;

  const BallotContract = await hre.ethers.getContractFactory("Ballot");
  const ballotContract = await BallotContract.deploy(initialCandidates, campaignEndDate);
  await ballotContract.waitForDeployment()

  console.log("Contract address:", ballotContract.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
