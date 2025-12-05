// import React, { useState } from "react";
// import { ethers } from "ethers";
// import { FaRegCopy, FaChevronDown, FaRegUserCircle } from "react-icons/fa";

// /**
//  * CustomBNBWallet
//  *
//  * - On "Connect Wallet" click, attempts to connect to MetaMask (window.ethereum).
//  * - If MetaMask is available and user approves, shows the account address + balance.
//  * - Keeps your existing "Generate New Wallet" flow as a fallback when MetaMask not installed/connected.
//  *
//  * Notes:
//  * - Uses ethers.providers.Web3Provider (v5-style) so it works with most ethers installs.
//  * - If you use ethers v6 and prefer BrowserProvider, you can switch, but the current approach is broadly compatible.
//  */

// function CustomBNBWallet() {
//   // UI state
//   const [showModal, setShowModal] = useState(false);
//   // wallet holds an object when connected via MetaMask OR a Wallet instance when generated
//   // For MetaMask: { provider, signer, address, balance }
//   // For generated random wallet: ethers.Wallet instance (privateKey, address, etc.)
//   const [wallet, setWallet] = useState(null);
//   const [copied, setCopied] = useState(false);
//   const [tab] = useState("Activity");
//   const [contractAddress, setContractAddress] = useState("");
//   const [proceedMsg, setProceedMsg] = useState("");
//   const [status, setStatus] = useState("");
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [cancelMsg, setCancelMsg] = useState("");
//   const [auditReport, setAuditReport] = useState("");

//   // open/close modal helpers
//   const openModal = () => setShowModal(true);
//   const closeModal = () => {
//     setShowModal(false);
//     setStatus("");
//     setShowConfirm(false);
//     setProceedMsg("");
//     setContractAddress("");
//     setCancelMsg("");
//   };

//   // Generate a local random wallet (fallback)
//   const generateWallet = () => {
//     const newWallet = ethers.Wallet.createRandom();
//     // For generated wallet we'll only store the Wallet instance.
//     // Balance will be unknown until funded; set as null for clarity.
//     setWallet({ generatedWallet: newWallet, address: newWallet.address, balance: null });
//   };

//   // Copy address to clipboard and show "Copied!" indicator
//   const copyAddress = () => {
//     if (!wallet) return;
//     // wallet may be MetaMask object or generatedWallet object
//     const addr = wallet.address || (wallet.generatedWallet && wallet.generatedWallet.address);
//     if (!addr) return;
//     navigator.clipboard.writeText(addr);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 1000);
//   };

//   // Connect to MetaMask and populate wallet state with address, signer, provider, and balance
//   const connectMetaMask = async () => {
//     // Ensure window.ethereum exists
//     if (typeof window === "undefined" || !window.ethereum) {
//       setProceedMsg("MetaMask is not installed. You can generate a local wallet as fallback.");
//       return;
//     }

//     try {
//       setProceedMsg("Connecting to MetaMask...");
//       // Create provider using injected window.ethereum
//       const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
//       // Request account access
//       await provider.send("eth_requestAccounts", []);
//       const signer = provider.getSigner();
//       const address = await signer.getAddress();
//       // Get balance and format to ETH (BNB uses same units)
//       const rawBalance = await provider.getBalance(address);
//       const balance = parseFloat(ethers.utils.formatEther(rawBalance)); // number in ETH/BNB
//       // Store relevant wallet information
//       setWallet({ provider, signer, address, balance });
//       setProceedMsg("");
//     } catch (err) {
//       console.error("MetaMask connection error:", err);
//       setProceedMsg("MetaMask connection failed or permission denied.");
//     }
//   };

//   // Handle the "Proceed" flow: validate contract address and call backend /checkcontract
//   const handleProceed = async () => {
//     // Validate contract address using ethers.utils.isAddress (safe for v5+)
//     if (!ethers.utils.isAddress(contractAddress)) {
//       setProceedMsg("Invalid contract address.");
//       setStatus("");
//       setAuditReport("");
//       setShowConfirm(false);
//       return;
//     }

//     setProceedMsg("Checking contract...");
//     setStatus("");
//     setAuditReport("");
//     setShowConfirm(false);

//     try {
//       const res = await fetch("http://localhost:3001/checkcontract", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ contractAddress }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Unknown error");

//       // Backend returns { risk, score }
//       setStatus(data.risk);
//       setAuditReport(data.score);
//       setShowConfirm(true);
//       setProceedMsg("");
//     } catch (err) {
//       setProceedMsg("Error: " + err.message);
//       setStatus("");
//       setAuditReport("");
//       setShowConfirm(false);
//     }
//   };

//   // Cancel action in confirmation
//   const handleCancel = () => {
//     setShowConfirm(false);
//     setStatus("");
//     setProceedMsg("");
//     setContractAddress("");
//     setCancelMsg("Transaction cancelled");
//     setTimeout(() => setCancelMsg(""), 3000);
//   };

//   // OK action: simulate proceeding (you can wire real tx sending here)
//   const handleOk = () => {
//     setShowConfirm(false);
//     setStatus("");
//     setProceedMsg("You have proceeded!");
//   };

//   // Status color mapping for simple visual cue
//   const statusColor = {
//     Safe: "bg-green-600",
//     Risky: "bg-red-600",
//     Unknown: "bg-yellow-600",
//   };

//   // Helper to render display address (shortened)
//   const shortAddress = (addr = "") => {
//     if (!addr) return "";
//     return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
//   };

//   // Helper to render formatted balance (tBNB label as you used)
//   const formattedBalance = (b) => {
//     if (b == null || typeof b === "undefined") return "—";
//     return `${Number(b).toFixed(4)} tBNB`;
//   };

//   return (
//     <div className="mb-4">
//       {/* Opening button */}
//       <button
//         onClick={openModal}
//         className="bg-[#04d9ff] hover:bg-[#16e0ff] text-white px-6 py-2 rounded font-semibold"
//         title="Connect to BNB Wallet"
//       >
//         Connect Wallet
//       </button>

//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
//           <div className="bg-[#181A20] text-white w-[390px] rounded-2xl shadow-2xl overflow-hidden">
//             {/* Header */}
//             <div className="flex items-center justify-between px-4 py-3 bg-[#22242A]">
//               <div className="flex items-center gap-2">
//                 <FaRegUserCircle className="text-3xl" />
//                 <div>
//                   <div className="flex items-center gap-1">
//                     <span className="font-semibold">Account 1</span>
//                     <FaChevronDown className="text-xs" />
//                   </div>

//                   {/* When wallet object exists, show short address and copy button */}
//                   {wallet && (
//                     <div className="flex items-center gap-1 text-xs text-gray-400">
//                       <span>{shortAddress(wallet.address)}</span>
//                       <button onClick={copyAddress}>
//                         <FaRegCopy className="ml-1 hover:text-blue-400" />
//                       </button>
//                       {copied && <span className="text-green-400 ml-1">Copied!</span>}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <button onClick={closeModal} className="text-gray-400 hover:text-white text-xl">
//                 &times;
//               </button>
//             </div>

//             {/* Main Content */}
//             <div className="px-6 py-6">
//               {/* If a connected MetaMask wallet (has signer/provider) or generated wallet, show details */}
//               {wallet ? (
//                 <>
//                   {/* If wallet.provider exists (MetaMask connected), show live balance; else if generated wallet, show placeholder */}
//                   <div className="text-3xl font-bold mb-1">
//                     {wallet.balance != null ? formattedBalance(wallet.balance) : "0.0000 tBNB"}
//                   </div>
//                   <div className="text-blue-400 text-sm mb-5">Portfolio • <span className="underline cursor-pointer">View</span></div>

//                   {/* Contract Address Input */}
//                   <div className="mb-7">
//                     <input
//                       type="text"
//                       placeholder="Enter contract address"
//                       value={contractAddress}
//                       onChange={(e) => {
//                         setContractAddress(e.target.value.trim());
//                         setProceedMsg("");
//                         setStatus("");
//                         setShowConfirm(false);
//                         setCancelMsg("");
//                       }}
//                       className="w-full px-3 py-2 rounded bg-[#23262F] text-white border border-[#23262F] focus:outline-none focus:border-blue-400 mb-3"
//                     />
//                     <div className="space-y-2">
//                       <button
//                         onClick={handleProceed}
//                         className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//                       >
//                         Proceed
//                       </button>

//                       {/* If MetaMask is available but user hasn't connected (wallet may be generated), show connect button */}
//                       {/* If wallet has no provider (generated wallet), offer to connect MetaMask */}
//                       {!wallet.provider && typeof window !== "undefined" && window.ethereum && (
//                         <button
//                           onClick={connectMetaMask}
//                           className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
//                         >
//                           Connect MetaMask
//                         </button>
//                       )}
//                     </div>

//                     {proceedMsg && <div className="mt-2 text-sm text-red-400">{proceedMsg}</div>}
//                     {cancelMsg && <div className="mt-2 text-sm text-yellow-400">{cancelMsg}</div>}
//                   </div>

//                   {/* Status display */}
//                   {status && (
//                     <div
//                       className={`p-3 mb-4 rounded font-semibold text-center ${
//                         status === "Safe" ? "bg-green-500 text-white" : status === "Risky" ? "bg-red-500 text-white" : "bg-yellow-500 text-black"
//                       }`}
//                     >
//                       This contract is <span className="capitalize font-bold">{status}</span>
//                     </div>
//                   )}

//                   {/* Confirmation Section */}
//                   {showConfirm && (
//                     <div className="mb-7">
//                       <div className="mb-3 text-center text-base font-medium">Do you want to proceed?</div>
//                       <div className="flex justify-center gap-4">
//                         <button onClick={handleCancel} className="px-5 py-2 bg-gray-600 rounded hover:bg-gray-700 transition">
//                           Cancel
//                         </button>
//                         <button onClick={handleOk} className="px-5 py-2 bg-green-600 rounded hover:bg-green-700 transition">
//                           OK
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 /* No wallet: offer two options - Connect MetaMask (if available) OR Generate local wallet */
//                 <>
//                   <div className="mb-3 text-sm text-slate-300">
//                     Connect your MetaMask wallet to allow transaction-time audits. If you don't have MetaMask, you can generate a local wallet.
//                   </div>

//                   <div className="space-y-3">
//                     {/* Connect MetaMask button */}
//                     <button
//                       onClick={connectMetaMask}
//                       className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//                     >
//                       Connect MetaMask
//                     </button>

//                     {/* Generate local wallet fallback */}
//                     <button
//                       onClick={generateWallet}
//                       className="w-full px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition"
//                     >
//                       Generate New Wallet
//                     </button>
//                     {proceedMsg && <div className="mt-2 text-sm text-red-400">{proceedMsg}</div>}
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default CustomBNBWallet;

// src/Components/Shared/WalletConnect.jsx
import React, { useState, useEffect } from 'react';
import { Wallet, LogOut, AlertCircle } from 'lucide-react';

const WalletConnect = () => {
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [chainId, setChainId] = useState(null);

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkIfWalletIsConnected();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) return;

      const accounts = await window.ethereum.request({
        method: 'eth_accounts'
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        const chain = await window.ethereum.request({
          method: 'eth_chainId'
        });
        setChainId(chain);
      }
    } catch (err) {
      console.error('Error checking wallet connection:', err);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      setAccount(null);
      setChainId(null);
    } else {
      setAccount(accounts[0]);
    }
  };

  const handleChainChanged = (chain) => {
    setChainId(chain);
    // Reload the page when chain changes (recommended by MetaMask)
    window.location.reload();
  };

  const connectWallet = async () => {
    setError(null);
    setIsConnecting(true);

    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        setError('MetaMask is not installed. Please install MetaMask to continue.');
        setIsConnecting(false);
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);

        // Get chain ID
        const chain = await window.ethereum.request({
          method: 'eth_chainId'
        });
        setChainId(chain);
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);

      if (err.code === 4001) {
        setError('Connection rejected. Please try again.');
      } else {
        setError('Failed to connect wallet. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
    setError(null);
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkName = (chainId) => {
    const networks = {
      '0x1': 'Ethereum Mainnet',
      '0x5': 'Goerli Testnet',
      '0xaa36a7': 'Sepolia Testnet',
      '0x89': 'Polygon Mainnet',
      '0x13881': 'Mumbai Testnet',
      '0x38': 'BSC Mainnet',
      '0x61': 'BSC Testnet',
    };
    return networks[chainId] || 'Unknown Network';
  };

  return (
    <div className="flex flex-col items-end gap-2">
      {!account ? (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className={`
            flex items-center gap-2 px-2 py-2 rounded-lg font-semibold
            transition-all duration-200 shadow-lg
            ${isConnecting
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#04D9FF] to-[#0099cc] hover:from-[#16e0ff] hover:to-[#00aae0] hover:shadow-xl hover:scale-105'
            }
            text-black
          `}
        >
          <Wallet size={20} />
          <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <div className="bg-[#1A2536] border border-gray-700 rounded-lg px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-white font-mono text-sm">
                {formatAddress(account)}
              </span>
            </div>
            {chainId && (
              <div className="text-xs text-gray-400 mt-1">
                {getNetworkName(chainId)}
              </div>
            )}
          </div>
          <button
            onClick={disconnectWallet}
            className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition-colors"
            title="Disconnect Wallet"
          >
            <LogOut size={18} />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-2 mt-2">
          <AlertCircle size={16} className="text-red-400" />
          <span className="text-red-300 text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
