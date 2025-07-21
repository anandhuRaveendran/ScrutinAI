# ScrutinAI - An AI assisted Smart Contract Auditing Tool  

ScrutinAI is an AI-powered smart contract auditing platform built to elevate blockchain security by combining advanced artificial intelligence with immutable, verifiable reporting. It helps developers and users detect vulnerabilities early and ensures projects ship with security at their core.

At its core, ScrutinAI uses AI models trained on real-world exploits to analyze smart contracts for bugs, security risks, and compliance issues. The results are stored as immutable audit records—verifiable and transparent, either on-chain or via IPFS.

To foster decentralized participation, ScrutinAI includes a governance module where human auditors can review AI-audited contracts. If a bug is discovered that was missed by the AI, the auditor can report it and earn token-based rewards. This crowdsourced security layer aligns incentives and creates a trustless, community-driven auditing process.

A standout feature in development is our wallet integration. When a user initiates a transaction involving a smart contract, ScrutinAI performs a real-time vulnerability check and on-chain behavior analysis of the contract’s deployer. It flags risky interactions, such as contracts linked to known exploits or malicious histories, giving users a security warning before confirming the transaction.

ScrutinAI doesn’t aim to replace human auditors but to amplify their capabilities, reduce the burden of manual reviews, and democratize access to security insights for both developers and end users.  

## Key Features  

- AI-powered vulnerability detection for smart contracts
- Immutable and verifiable audit reports stored on-chain(metadata) and IPFS
- Governance module with bug bounty rewards for manual auditors
- Wallet integration for real-time transaction security alerts
- On-chain analysis for deployer behavior to detect malicious actors
- Scalable and developer-friendly infrastructure  

## Advantages
- Instant AI audit reports can be generated in minutes at a fraction of the cost
- Manual audit layer via governance still exists, but only for high-risk or complex issues—reducing human time spent by up to 70%
- Lowers the barrier for new startups and projects while still maintaining high security standards.

## Project Setup Instructions

This guide will help you set up the **Frontend** and **Backend** and **Blockchain** parts the project on your local machine.

---

## Prerequisites

- **Node.js** (version 14.x or above recommended)
- **npm** (Node Package Manager)
- **API Keys** for required services
- **Hardhat**
- **MetaMask**

---

## Frontend Setup

### Navigate to the Frontend Directory

```bash
cd Frontend
```
### Install Dependencies:

```bash
npm install
```
### Start the Development Server:

```bash
npm run dev
```

###Always try to run in localhost::5173 default port of react application

## Backend Setup

### Navigate to the Backend Directory

```bash
cd Backend
```
### Install Dependencies:

```bash
npm install
```
### Start the Development Server:

```bash
npm run dev
```

### Configure Environment Variables:

### 1.Create a .env file in the Backend folder.
### 2.Add the following content to your .env file (replace with your actual API keys):

```bash
PERPLEXITY_API_KEY=your_perplexity_api_key_here
PORT=3001
BSC_API_KEY=your_bsc_scan_api_key_here
```
### Start the Development Server:

```bash
npm run dev
```
## Blockchain Setup

### Navigate to Blockchain folder

```bash
cd bnb_smart_contract
```

### Install Dependencies:

```bash
npm install
```

### Compile the smart contract

```bash
npx hardhat compile
```

### Configure Environment Variables

### 1.Create a .env file in the bnb_smart_contract folder.
### 2.Add the following content to your .env file

```bash
BSCTESTNET_RPC_URL=<enter_bsc_testnet_rpc_url>
PRIVATE_KEY=<your_metamask_private_key>
BSCSCAN_API_KEY=<your_bscscan_api_key>
```
### Deploy the Smart Contract

```bash
npx hardhat run scripts/deploy.cjs --network bscTestnet
```
## Current Scope

1. User can upload a solidity smart contract into the file upload section and click Audit With AI button to audit the uploaded smart contract. It will return a report with an audit report that the user can download as a .pdf file.

2. User can click on Connect Wallet, a pop up of a wallet will appear with an input field to enter a smart contract address. User can input the address in, and click on proceed. It will return a user readable risk report and prompts the user whether to continue with the transaction or cancel the transaction.

## Future Scope

1. ***Wallet integration:***  Integrations into wallets such as Metamask etc, in such that when a user tries to transact, a simple audit check will be done by extracting the context of the underlying smart contract and returning a user readable risk report(SAFE, RISKY) and conducts an on-chain analysis of the deployer address to see whether the deployer address has been malicious.

2. ***Data Storage:*** Upon detailed auditing, addition of Audit metadata (Smart Contract Address and Risk Report(x/10)) to be stored on chain and detailed Audit report to be stored using IPFS.

3. ***Governance Module:*** Human auditors can audit already AI audited smart contract to find whether any bug was missed by AI. If found, the auditor has the ability to report it and receive a reward in tokens.   
A leaderboard of all the human auditors along with their total audits, their accuracy in percentage and total rewards recieved can be seen within the module.  
A profile section exists where the auditors can view their details.

