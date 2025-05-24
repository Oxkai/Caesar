import React, { useState } from 'react'
import propertyImage from '../assets/property.png';

import { useWallet } from "@suiet/wallet-kit";
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { Transaction } from "@mysten/sui/transactions";

const Documents = () => {
  // Move the hook to the top level of the component
  const { connected, account, signAndExecuteTransaction } = useWallet();

  const mintPropertyNFT = async () => {
    try {
      // Check if wallet is connected
      if (!connected || !account) {
        console.error("No wallet connected");
        alert("Please connect your wallet first!");
        return;
      }

      const tx = new Transaction();

      // Replace with your actual values
      const propertyId = 23323027;
      const propertyName = "Oceanview Villa";
      const location = "Sector 12, Mumbai, India, 400001";
      const propertyOwner = "Rajesh Kumar";
      const landSize = 500;
      const propertyType = "Residential";
      const documentIpfsHash = "bafybeifhdgh2qjzlb4jnofnesdzrb7w4pvvigkxkrfoh25boxh4gmq5pp4";
      const imageUrl = "https://gateway.pinata.cloud/ipfs/bafybeibonvyfxprzp5xetg4jfps7cawjdretax37hq7uwidevwjdv2erxe";

      const PACKAGE_ID = "0xf47b0c6633a1826e8bb09f6d9b8147cd2fef55341696311690b977f4a3a70be9";
      const MODULE_NAME = "property_nft";
      const FUNCTION_NAME = "mint_property_nft";

      // Add function call to transaction
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::${FUNCTION_NAME}`,
        arguments: [
          tx.pure.u64(propertyId),
          tx.pure.string(propertyName),
          tx.pure.string(location),
          tx.pure.string(propertyOwner),
          tx.pure.u64(landSize),
          tx.pure.string(propertyType),
          tx.pure.string(documentIpfsHash),
          tx.pure.string(imageUrl),
        ],
      });

      // Use the correct function name (might be signAndExecuteTransaction instead of signAndExecuteTransactionBlock)
      const result = await signAndExecuteTransaction({
        transaction: tx,
        options: {
          showEvents: true,
          showEffects: true,
        },
      });

      console.log("✅ NFT Minted:", result);
      alert("NFT minted successfully!");
    } catch (error) {
      console.error("Error minting property NFT:", error);
      alert(`Failed to mint NFT: ${error.message}`);
    }
  };


  const [propertyID, setPropertyID] = useState('');
  const [location, setLocation] = useState('');
  const [owner, setOwner] = useState('');
  const [lendSize, setLendSize] = useState('');
  const [type, setType] = useState('');


  const [formData, setFormData] = useState({
    propertyId: "",
    location: "",
    owner: "",
    lendSize: "",
    type: ""
  });

  const propertyDatabase = {
    "23323027": {
      location: "Sector 12, Mumbai, India, 400001",
      owner: "Rajesh Kumar",
      lendSize: "500",
      type: "Residential"
    },
    "23323005": {
      location: "Palm Hills, Pune, India, 411045",
      owner: "Neha Sharma",
      lendSize: "800",
      type: "Commercial"
    }
  };

  const handlePropertyIdChange = (e) => {
    const propertyId = e.target.value;
    setFormData({ ...formData, propertyId });

    if (propertyDatabase[propertyId]) {
      const data = propertyDatabase[propertyId];
      setFormData({
        propertyId,
        location: data.location,
        owner: data.owner,
        lendSize: data.lendSize,
        type: data.type
      });
    }
  };

   const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };


  return (
<>
<div className="w-full  flex flex-col justify-center items-center gap-12">
        {/* Header Section */}
        <div className="w-full flex justify-between items-center">
          <div className="flex px-4 py-0 justify-center items-center gap-2">
            <h1 className="text-teal-400 text-4xl font-semibold leading-7 font-['rajdhani']">
              Tokenization
            </h1>
          </div>
          
          {/* Borrow/Lend Toggle */}
        
        </div>

        {/* Form Section */}
        <div className="w-full flex flex-col items-center gap-12">
          <div className="w-full px-4 flex items-start gap-12">
            {/* Left Column */}
            <div className="flex-1 flex flex-col justify-center items-start gap-8">
              {/* Property ID */}
              <div className="w-full flex flex-col items-start gap-1">
                <div className="w-full flex items-center gap-2">
                  <label className="text-white/95 text-base font-semibold leading-7 font-['rajdhani'] capitalize">
                    Property ID
                  </label>
                </div>
                <div className="w-full h-11 px-4 flex justify-center items-center gap-3 border rounded" style={{ borderColor: '#353535' }}>
                  <input
                type="text"
                value={formData.propertyId}
                onChange={handlePropertyIdChange}
                placeholder="Enter Property ID / survey no."
                className="flex-1 bg-transparent text-white text-sm font-amina capitalize outline-none placeholder:text-gray-600"
              />
                </div>
              </div>

              {/* Property Name */}
              <div className="w-full flex flex-col items-start gap-1">
                <div className="w-full flex items-center gap-2">
                  <label className="text-white/95 text-base font-semibold leading-7 font-['rajdhani'] ">
                    Image
                  </label>
                </div>
                <div className="w-full h-11 px-4 flex justify-center items-center gap-3 border border-color: #353535; rounded" style={{ borderColor: '#353535' }}>
                  <input
                type="text"
               
                placeholder="ex. Raj Farmhouse"
                className="flex-1 bg-transparent text-white text-sm font-amina capitalize outline-none placeholder:text-gray-600"
              />
                </div>
              </div>

              {/* Location */}
              <div className="w-full flex flex-col items-start gap-1">
                <div className="w-full flex items-center gap-2">
                  <label className="text-white/95 text-base font-semibold leading-7 font-['rajdhani'] capitalize">
                    Location
                  </label>
                </div>
                <div className="w-full h-11 px-4 flex justify-center items-center gap-3 border rounded" style={{ borderColor: '#353535' }}>
                  <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange(e, "location")}
                placeholder="ex. area, city, country, pincode"
                className="flex-1 bg-transparent text-white text-sm font-amina capitalize outline-none placeholder:text-gray-600"
              />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex-1 flex flex-col items-start gap-8">
              {/* Owner */}
              <div className="w-full flex flex-col items-start gap-1">
                <div className="w-full flex items-center gap-2">
                  <label className="text-white/95 text-base font-semibold leading-7 font-['rajdhani'] capitalize">
                    Owner
                  </label>
                </div>
                <div className="w-full h-11 px-4 flex justify-center items-center gap-3 border border-color: #353535; rounded" style={{ borderColor: '#353535' }}>
                 <input
                type="text"
                value={formData.owner}
                onChange={(e) => handleChange(e, "owner")}
                placeholder="Owner of property"
                className="flex-1 bg-transparent text-white text-sm font-amina capitalize outline-none placeholder:text-gray-600"
              />
                </div>
              </div>

              {/* Lend Size and Type */}
              <div className="w-full flex items-start gap-4">
                <div className="flex-1 flex flex-col items-start gap-1">
                  <div className="w-full flex items-center gap-2">
                    <label className="text-white/95 text-base font-semibold leading-7 font-['rajdhani'] capitalize">
                      Lend size
                    </label>
                  </div>
                  <div className="w-full h-11 px-4 flex justify-center items-center gap-3 border border-color: #353535; rounded" style={{ borderColor: '#353535' }}>
                    <input
                  type="text"
                  value={formData.lendSize}
                  onChange={(e) => handleChange(e, "lendSize")}
                  placeholder="sq. meter"
                  className="flex-1 bg-transparent text-white text-sm font-amina capitalize outline-none placeholder:text-gray-600"
                />
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-start gap-1">
                  <div className="w-full flex items-center gap-2">
                    <label className="text-white/95 text-base font-semibold leading-7 font-['rajdhani'] capitalize">
                      Type
                    </label>
                  </div>
                  <div className="w-full h-11 px-4 flex justify-center items-center gap-3 border border-color: #353535; rounded" style={{ borderColor: '#353535' }}>
                    <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => handleChange(e, "type")}
                  placeholder="ex. residential"
                  className="flex-1 bg-transparent text-white text-sm font-amina capitalize outline-none placeholder:text-gray-600"
                />
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="w-full flex flex-col items-start gap-1">
                <div className="w-full flex items-center gap-2">
                  <label className="text-white/95 text-base font-semibold leading-7 font-['rajdhani'] capitalize">
                    Property Documents
                  </label>
                </div>
                <div className="w-full h-11 px-4 flex justify-center items-center gap-3 border border-color: #353535; rounded" style={{ borderColor: '#353535' }}>
                  <input
                type="text"
                
                placeholder="IPFS hash"
                className="flex-1 bg-transparent text-white text-sm font-amina capitalize outline-none placeholder:text-gray-600"
              />
                </div>
              </div>
            </div>
          </div>

          {/* Tokenize Button */}
          <button onClick={mintPropertyNFT} className="w-48 h-12 flex justify-center items-center gap-3 bg-white rounded">
            <span className="text-black text-center text-xl font-semibold leading-8 font-['rajdhani'] capitalize">
              Tokenize
            </span>
          </button>
        </div>
      </div>
</>
  )
}

export default Documents