import React, { useState } from "react";
import { ethers } from "ethers";
import { FaRegCopy, FaChevronDown, FaRegUserCircle } from "react-icons/fa";

const BNB_TESTNET_RPC = "https://data-seed-prebsc-1-s1.binance.org:8545/";

function CustomBNBWallet() {
  const [showModal, setShowModal] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [copied, setCopied] = useState(false);
  const [tab] = useState("Activity");
  const [contractAddress, setContractAddress] = useState("");
  const [proceedMsg, setProceedMsg] = useState("");
  const [status, setStatus] = useState(""); // "Safe", "Risky", "Unknown"
  const [showConfirm, setShowConfirm] = useState(false);
  const [cancelMsg, setCancelMsg] = useState(""); // New state for cancel message

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setStatus("");
    setShowConfirm(false);
    setProceedMsg("");
    setContractAddress("");
    setCancelMsg("");
  };

  const generateWallet = () => {
    const newWallet = ethers.Wallet.createRandom();
    setWallet(newWallet);
  };

  const copyAddress = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    }
  };

  const handleProceed = () => {
    if (!ethers.isAddress(contractAddress)) {
      setProceedMsg("Invalid contract address.");
      setStatus("");
      setShowConfirm(false);
      return;
    }
    setProceedMsg("");

    if (contractAddress.endsWith("1")) setStatus("Safe");
    else if (contractAddress.endsWith("2")) setStatus("Risky");
    else setStatus("Unknown");
    setShowConfirm(true);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setStatus("");
    setProceedMsg("");
    setContractAddress("");
    setCancelMsg("Transaction cancelled");
    setTimeout(() => setCancelMsg(""), 3000); 
  };

  const handleOk = () => {
    setShowConfirm(false);
    setStatus("");
    setProceedMsg("You have proceeded!");
  };

  const statusColor = {
    Safe: "bg-green-600",
    Risky: "bg-red-600",
    Unknown: "bg-yellow-600",
  };

  return (
    <div className="mb-4">
      <button
        onClick={openModal}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
        title="Connect to BNB Wallet">
        Connect Wallet
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#181A20] text-white w-[390px] rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-[#22242A]">
              <div className="flex items-center gap-2">
                <FaRegUserCircle className="text-3xl" />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">Account 1</span>
                    <FaChevronDown className="text-xs" />
                  </div>
                  {wallet && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <span>
                        {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                      </span>
                      <button onClick={copyAddress}>
                        <FaRegCopy className="ml-1 hover:text-blue-400" />
                      </button>
                      {copied && <span className="text-green-400 ml-1">Copied!</span>}
                    </div>
                  )}
                </div>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-white text-xl">&times;</button>
            </div>

            {/* Main Content */}
            <div className="px-6 py-6">
              {wallet ? (
                <>
                  {/* Balance */}
                  <div className="text-3xl font-bold mb-1">1.5211 tBNB</div>
                  <div className="text-blue-400 text-sm mb-5">+0 (0.00%) <a href="#" className="underline">Portfolio</a></div>
                  
                  {/* Contract Address Input */}
                  <div className="mb-7">
                    <input
                      type="text"
                      placeholder="Enter contract address"
                      value={contractAddress}
                      onChange={e => {
                        setContractAddress(e.target.value);
                        setProceedMsg("");
                        setStatus("");
                        setShowConfirm(false);
                        setCancelMsg("");
                      }}
                      className="w-full px-3 py-2 rounded bg-[#23262F] text-white border border-[#23262F] focus:outline-none focus:border-blue-400 mb-3"
                    />
                    <button
                      onClick={handleProceed}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mb-3"
                    >
                      Proceed
                    </button>
                    {proceedMsg && (
                      <div className="mt-2 text-sm text-red-400">
                        {proceedMsg}
                      </div>
                    )}
                    {cancelMsg && (
                      <div className="mt-2 text-sm text-yellow-400">
                        {cancelMsg}
                      </div>
                    )}
                  </div>

                  {/* Result Status Section */}
                  {status && (
                    <div className={`mb-5 py-3 rounded text-center font-semibold text-white ${statusColor[status]}`}>
                      Status: {status}
                    </div>
                  )}

                  {/* Confirmation Section */}
                  {showConfirm && (
                    <div className="mb-7">
                      <div className="mb-3 text-center text-base font-medium">
                        Do you want to proceed?
                      </div>
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={handleCancel}
                          className="px-5 py-2 bg-gray-600 rounded hover:bg-gray-700 transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleOk}
                          className="px-5 py-2 bg-green-600 rounded hover:bg-green-700 transition"
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  )}

                </>
              ) : (
                <button
                  onClick={generateWallet}
                  className="w-full mt-4 px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition"
                >
                  Generate New Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomBNBWallet;