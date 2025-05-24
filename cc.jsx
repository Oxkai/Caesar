'use client';

import { ConnectButton, useWallet } from '@suiet/wallet-kit';
import { useEffect, useState } from 'react';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { Transaction } from '@mysten/sui/transactions'
const PACKAGE_ID = '0x139d93535258c46fc3b94cdbf1de315ece4f37420ccd0f52669685c3b030c474';
const PROPERTY_OBJECT_ID = '0x574cb059b87f3b7efb5fc24d2a159e13cce8bd1a76c8f89837c506ee0cab099c';

const client = new SuiClient({ url: getFullnodeUrl('devnet') });

function decodeAsciiArray(arr) {
  if (!Array.isArray(arr)) return arr;
  return arr.map((code) => String.fromCharCode(code)).join('');
}

export default function App() {
  const wallet = useWallet();
  const [coins, setCoins] = useState([]);
  const [propertyInfo, setPropertyInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCoins = async () => {
    if (!wallet.connected) return;
    const res = await client.getCoins({ owner: wallet.address });
    setCoins(res.data);
    console.log('Coins:', res.data);
  };

  const fetchPropertyInfo = async () => {
    const res = await client.getObject({
      id: PROPERTY_OBJECT_ID,
      options: { showContent: true },
    });
    setPropertyInfo(res);
    console.log('Property Info:', res);
  };
const invest = async () => {
  console.log('🟢 Starting invest()');

  if (!wallet.connected) {
    alert('Connect your wallet!');
    console.log('🔴 Wallet not connected.');
    return;
  }

  console.log('🟢 Wallet connected:', wallet);

  if (coins.length === 0) {
    alert('No SUI coins found!');
    console.log('🔴 No coins found.');
    return;
  }

  console.log('🟢 Coins:', coins);

  const coinObjectId = coins[0].coinObjectId;
  console.log('🟢 Using coinObjectId:', coinObjectId);

  const investAmount = 100000000; // 0.1 SUI in MIST as a number (u64)
  console.log('🟢 Invest amount (u64 MIST):', investAmount);

  const tx = new Transaction();
  console.log('🟢 Transaction object created:', tx);

  try {
    console.log('🟢 Adding moveCall to transaction');
    tx.moveCall({
      target: `${PACKAGE_ID}::property_investment::invest`,
      arguments: [
        tx.object(PROPERTY_OBJECT_ID),
        tx.object(coinObjectId),
        tx.pure.u64(investAmount), // no toString here, just number
      ],
    });

    console.log('🟢 moveCall added:', tx);

    setLoading(true);
    console.log('🟢 Sending transaction to wallet for signing and execution...');

    const result = await wallet.signAndExecuteTransaction({
      transaction: tx,
    });

    console.log('✅ Investment successful:', result);
    alert('Investment done!');

    fetchPropertyInfo();
  } catch (error) {
    console.error('🔴 Error during investment:', error);
    alert('Failed to invest.');
  } finally {
    setLoading(false);
    console.log('🟢 invest() finished.');
  }
};



  useEffect(() => {
    if (wallet.connected) {
      fetchCoins();
      fetchPropertyInfo();
    }
  }, [wallet.connected]);

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-4">🏠 Property Investment DApp</h1>

      <ConnectButton />

      {wallet.connected && (
        <div className="mt-4">
          <p><strong>Connected:</strong> {wallet.address}</p>

          <button
            onClick={invest}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            {loading ? 'Investing...' : 'Invest 0.1 SUI'}
          </button>

          <h2 className="text-xl mt-6">📄 Property Info:</h2>
          {propertyInfo ? (
            <pre className="bg-gray-100 p-4 mt-2 rounded max-w-xl overflow-auto">
              <div><strong>Address:</strong> {decodeAsciiArray(propertyInfo.data.content.fields.address)}</div>
              <div><strong>API Percent:</strong> {propertyInfo.data.content.fields.api_percent}</div>
              <div><strong>Description:</strong> {decodeAsciiArray(propertyInfo.data.content.fields.description)}</div>
              <div><strong>ID:</strong> {propertyInfo.data.content.fields.id.id}</div>
              <div><strong>Name:</strong> {decodeAsciiArray(propertyInfo.data.content.fields.name)}</div>
              <div><strong>Owner:</strong> {propertyInfo.data.content.fields.owner}</div>
              <div><strong>Shareholders:</strong> {propertyInfo.data.content.fields.shareholders}</div>
              <div><strong>Total Invested:</strong> {propertyInfo.data.content.fields.total_invested}</div>
              <div><strong>Valuation:</strong> {propertyInfo.data.content.fields.valuation}</div>
              <div><strong>Vault:</strong> {propertyInfo.data.content.fields.vault}</div>
            </pre>
          ) : (
            <p>Loading property info...</p>
          )}
        </div>
      )}
    </div>
  );
}
