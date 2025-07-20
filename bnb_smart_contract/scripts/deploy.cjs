require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const hre = require("hardhat");
const { ethers, run, network } = hre;



async function main() {
  console.log("🚀 Starting deployment...");

  const [deployer] = await ethers.getSigners();
  console.log("📋 Deploying contracts with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "BNB");

  const AuditRegistry = await ethers.getContractFactory("AuditRegistry");
  const deployTx = await AuditRegistry.getDeployTransaction();
  const estimatedGas = await ethers.provider.estimateGas(deployTx);
  console.log("⛽ Estimated gas:", estimatedGas.toString());

  const contract = await AuditRegistry.deploy({
    gasLimit: estimatedGas + BigInt(50000),
  });

  console.log("⏳ Transaction hash:", contract.deploymentTransaction().hash);
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log("\n✅ AuditRegistry deployed successfully!");
  console.log("📍 Contract address:", contractAddress);

  const totalAudits = await contract.totalAudits();
  console.log("📊 Total audits:", totalAudits.toString());

  const owner = await contract.owner();
  console.log("👤 Contract owner:", owner);

  const deploymentInfo = {
    network: network.name,
    contractAddress,
    deployerAddress: deployer.address,
    transactionHash: contract.deploymentTransaction().hash,
    blockNumber: contract.deploymentTransaction().blockNumber,
    timestamp: new Date().toISOString(),
    gasUsed: estimatedGas.toString(),
  };

  console.log("\n📄 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  if (network.name === "bscTestnet") {
    console.log("\n🔍 Starting automatic verification...");
    await new Promise((resolve) => setTimeout(resolve, 30000));

    try {
      await run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });

      console.log("✅ Contract verification successful!");
      console.log(`🔗 View on BSCScan: https://testnet.bscscan.com/address/${contractAddress}`);
    } catch (error) {
      if (error.message.toLowerCase().includes("already verified")) {
        console.log("✅ Contract is already verified!");
        console.log(`🔗 View on BSCScan: https://testnet.bscscan.com/address/${contractAddress}`);
      } else {
        console.error("❌ Verification failed:", error.message);
        console.log(`\n📋 Manual verification: npx hardhat verify --network bscTestnet ${contractAddress}`);
      }
    }
  }

  console.log("\n🎉 Deployment completed successfully!");
  return contractAddress;
}

main()
  .then((address) => {
    console.log(`\n🎯 Contract deployed at: ${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  });
