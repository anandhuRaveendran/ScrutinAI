import React, { useState } from 'react';

const WalletConnect = () => {
  const [connected, setConnected] = useState(false);

  return (
    <div className="mb-4">
      {connected ? (
        <div className="text-green-400 font-semibold mb-2">Wallet Connected: 0x123...abcd</div>
      ) : (
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold mb-2"
          onClick={() => setConnected(true)}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletConnect;