"use client";
import React, { useState, useEffect } from "react";
import propertyImage from "../assets/property.png";

import { useWallet } from "@suiet/wallet-kit";
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { Transaction } from "@mysten/sui/transactions";

const PACKAGE_ID =
  "0x139d93535258c46fc3b94cdbf1de315ece4f37420ccd0f52669685c3b030c474";
const PROPERTY_OBJECT_ID =
  "0x574cb059b87f3b7efb5fc24d2a159e13cce8bd1a76c8f89837c506ee0cab099c";

const client = new SuiClient({ url: getFullnodeUrl("devnet") });

function decodeAsciiArray(arr) {
  if (!Array.isArray(arr)) return arr;
  return arr.map((code) => String.fromCharCode(code)).join("");
}

const PropertyDetails = () => {
  const wallet = useWallet();
  const [coins, setCoins] = useState([]);
  const [propertyInfo, setPropertyInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCoins = async () => {
    if (!wallet.connected) return;
    const res = await client.getCoins({ owner: wallet.address });
    setCoins(res.data);
    console.log("Coins:", res.data);
  };

  const fetchPropertyInfo = async () => {
    const res = await client.getObject({
      id: PROPERTY_OBJECT_ID,
      options: { showContent: true },
    });
    setPropertyInfo(res);
    console.log("Property Info:", res);
  };

  const invest = async () => {
    console.log("🟢 Starting invest()");

    if (!wallet.connected) {
      alert("Connect your wallet!");
      console.log("🔴 Wallet not connected.");
      return;
    }

    console.log("🟢 Wallet connected:", wallet);

    if (coins.length === 0) {
      alert("No SUI coins found!");
      console.log("🔴 No coins found.");
      return;
    }

    console.log("🟢 Coins:", coins);

    const coinObjectId = coins[0].coinObjectId;
    console.log("🟢 Using coinObjectId:", coinObjectId);

    const investAmount = 100000000; // 0.1 SUI in MIST as a number (u64)
    console.log("🟢 Invest amount (u64 MIST):", investAmount);

    const tx = new Transaction();
    console.log("🟢 Transaction object created:", tx);

    try {
      console.log("🟢 Adding moveCall to transaction");
      tx.moveCall({
        target: `${PACKAGE_ID}::property_investment::invest`,
        arguments: [
          tx.object(PROPERTY_OBJECT_ID),
          tx.object(coinObjectId),
          tx.pure.u64(investAmount), // no toString here, just number
        ],
      });

      console.log("🟢 moveCall added:", tx);

      setLoading(true);
      console.log(
        "🟢 Sending transaction to wallet for signing and execution..."
      );

      const result = await wallet.signAndExecuteTransaction({
        transaction: tx,
      });

      console.log("✅ Investment successful:", result);
      alert("Investment done!");

      fetchPropertyInfo();
    } catch (error) {
      console.error("🔴 Error during investment:", error);
      alert("Failed to invest.");
    } finally {
      setLoading(false);
      console.log("🟢 invest() finished.");
    }
  };

  useEffect(() => {
    if (wallet.connected) {
      fetchCoins();
      fetchPropertyInfo();
    }
  }, [wallet.connected]);

  const [investAmount, setInvestAmount] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // Function to close the popup
  const handleClose = () => {
    setShowPopup(false);
  };

  return (
    <div className="flex  items-start gap-2 self-stretch">
      {/* Left Border */}
      <div className="w-1 flex flex-col justify-center items-start gap-2 flex-shrink-0 self-stretch">
        <div className="h-1 self-stretch bg-[#A0A0A0]" />
        <div className="flex flex-row w-0.5 items-center gap-2.5 flex-grow flex-shrink-0 flex-basis-0 bg-[#1C1C1C]" />
        <div className="h-1 self-stretch bg-[#A0A0A0]" />
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center flex-grow flex-shrink-0 flex-basis-0">
        <div className="h-0.5 flex flex-col items-start gap-2.5 self-stretch bg-[#1C1C1C]" />

        {/* Profile Section */}
        <div className="pt-4 pb-4 flex flex-col items-start gap-1 self-stretch">
          <div className="flex flex-col justify-center items-center -gap-1 self-stretch">
            <div className="flex flex-row justify-end items-center gap-2.5 self-stretch">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="16"
                viewBox="0 0 15 16"
                fill="none"
              >
                <path d="M14 15.3206V1.32056H0.778745" stroke="#7E7E7E" />
              </svg>
            </div>
            <div className="px-2.5 flex flex-col items-start gap-2.5 self-stretch">
              <img
                src={propertyImage}
                alt="Property"
                className="h-[339px] flex flex-col items-start gap-2.5 self-stretch rounded "
              />
            </div>
            <div className="flex flex-row items-center gap-2.5 self-stretch">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
              >
                <path d="M1 0.320557V14.3206H14.2213" stroke="#7E7E7E" />
              </svg>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex flex-col items-start self-stretch">
            <div className="p-3 flex flex-col justify-center items-start self-stretch border-b border-[#1C1C1C]">
              <h2 className="self-stretch text-[#25D0AB] font-['Amina'] text-5xl font-normal leading-[52.397px] tracking-[-0.967px]">
                Mert Mumtaz
              </h2>
              <p className="self-stretch text-[#EDEDED] font-['Amina'] text-2xl font-normal leading-[40.607px]">
                Cofounder, Helius
              </p>
            </div>

            {/* Overview Section */}
            <div className="p-3 flex flex-col justify-center items-start self-stretch">
              <h3 className="self-stretch text-[#25D0AB] font-['Amina'] text-[28.729px] font-normal leading-[40.607px]">
                Overview
              </h3>

              <p className="self-stretch w-[690px] text-[#EDEDED]/50 font-['Amina'] text-base font-normal leading-6">
                Nestled in a prime location, this stunning property offers a
                harmonious blend of modern design and functional living. Spread
                across a generous plot, the residence features spacious
                interiors, high-quality finishes, and ample natural light
                throughout. Key highlights include multiple well-appointed
                bedrooms, contemporary bathrooms, a fully equipped kitchen, and
                expansive living areas designed for both relaxation and
                entertainment. The outdoor space is equally impressive, boasting
                a landscaped garden, private patio, and secure parking.
                Positioned close to essential amenities, schools, and transport
                links, this property presents an exceptional opportunity for
                homeowners and investors alike.
              </p>
            </div>
          </div>
        </div>

        <div className="h-0.5 flex flex-col items-start gap-2.5 self-stretch bg-[#1C1C1C]" />
      </div>

      {/* Right Section */}
      <div className="flex flex-row items-start gap-2 self-stretch">
        <div className="w-1 flex flex-col justify-center items-end gap-2 self-stretch">
          <div className="h-1 self-stretch bg-[#A0A0A0]" />
          <div className="flex flex-row w-0.5 items-center gap-2.5 flex-grow flex-shrink-0 flex-basis-0 bg-[#1C1C1C]" />
          <div className="h-1 self-stretch bg-[#A0A0A0]" />
        </div>
        {/* Investment Details */}
        <div className="w-[349px] flex flex-col items-center self-stretch">
          <div className="h-0.5 flex flex-col items-start gap-2.5 self-stretch bg-[#1C1C1C]" />

          <div className="py-[30px] px-5 flex flex-col items-center gap-4 flex-grow flex-shrink-0 flex-basis-0">
            {/* Investment Amount */}
            <div className="w-[295px] py-4 flex flex-col items-center gap-4">
              {propertyInfo ? (
                <h2 className="self-stretch text-white text-center font-['Amina'] text-4xl font-normal leading-[27.871px]">
                  {propertyInfo.data.content.fields.valuation / 1000000000} Sui
                </h2>
              ) : (
                <></>
              )}

              <div className="w-[269px] h-1.5 px-0.5 flex flex-col items-start gap-2.5 bg-[#1C1C1C]">
                {propertyInfo ? (
                  <div
                    style={{
                      width: `${
                        ((propertyInfo.data.content.fields.total_invested /
                          1e9) *
                          295) /
                        (propertyInfo.data.content.fields.valuation / 1e9)
                      }px`,
                    }}
                    className="h-1.5 flex-shrink-0 bg-[#25D0AB]"
                  />
                ) : (
                  <></>
                )}
              </div>

              {propertyInfo ? (
                <p className="self-stretch text-white text-center font-['Amina'] text-sm font-normal leading-[27.871px]">
                  Raised{" "}
                  {propertyInfo.data.content.fields.total_invested / 1000000000}{" "}
                  Sui of{" "}
                  {propertyInfo.data.content.fields.valuation / 1000000000} Sui
                </p>
              ) : (
                <></>
              )}
            </div>

            {/* Investment Details */}
            <div className="flex flex-col items-start gap-4">
              {/* First Column */}
              <div className="w-[319.129px] py-2.5 px-3 flex flex-col items-start gap-1 border-b border-[#343434]">
                <div className="flex flex-row justify-between items-start self-stretch">
                  <div className="w-[161.655px] flex flex-col items-start gap-1">
                    <p className="self-stretch text-[#EDEDED]/60 font-['Amina'] text-[16.723px] font-normal leading-[27.871px]">
                      Blockchain Network :
                    </p>
                  </div>
                  <div className="w-[132.39px] flex flex-col items-start gap-1">
                    <p className="self-stretch text-[#EDEDED]/60 text-right font-['Amina'] text-[16.723px] font-normal leading-[27.871px]">
                      Sui Devnet
                    </p>
                  </div>
                </div>
                <div className="flex flex-row justify-between items-start self-stretch">
                  <div className="w-[161.655px] flex flex-col items-start gap-1">
                    <p className="self-stretch text-[#EDEDED]/60 font-['Amina'] text-[16.723px] font-normal leading-[27.871px]">
                      Owner Address :
                    </p>
                  </div>
                  <div className="w-[132.39px] flex flex-col items-start gap-1">
                    {propertyInfo ? (
                      <p className="self-stretch text-[#EDEDED]/60 text-right font-['Amina'] text-[16.723px] font-normal leading-[27.871px]">
                        {`${propertyInfo.data.content.fields.owner.slice(
                          0,
                          6
                        )}...${propertyInfo.data.content.fields.owner.slice(
                          -4
                        )}`}
                      </p>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <div className="flex flex-row justify-between items-start self-stretch">
                  <div className="w-[161.655px] flex flex-col items-start gap-1">
                    <p className="self-stretch text-[#EDEDED]/60 font-['Amina'] text-[16.723px] font-normal leading-[27.871px]">
                      ID :
                    </p>
                  </div>
                  <div className="w-[132.39px] flex flex-col items-start gap-1">
                    {propertyInfo ? (
                      <p className="self-stretch text-[#EDEDED]/60 text-right font-['Amina'] text-[16.723px] font-normal leading-[27.871px]">
                        {`${propertyInfo.data.content.fields.id.id.slice(
                          0,
                          6
                        )}...${propertyInfo.data.content.fields.id.id.slice(
                          -4
                        )}`}
                      </p>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>

              {/* Second Column */}
              <div className="w-[319.129px] py-2.5 px-3 flex flex-col items-start gap-1 border-b border-[#343434]">
                <div className="flex flex-row justify-between items-start self-stretch">
                  <div className="w-[161.655px] flex flex-col items-start gap-1">
                    <p className="self-stretch text-[#EDEDED]/60 font-['Amina'] text-[16.723px] font-normal leading-[27.871px]">
                      Valuation :
                    </p>
                  </div>
                  <div className="w-[132.39px] flex flex-col items-start gap-1">
                    <p className="self-stretch text-[#EDEDED]/60 text-right font-['Amina'] text-[16.723px] font-normal leading-[27.871px]">
                      {propertyInfo ? (
                        <p className="self-stretch text-[#EDEDED]/60 text-right font-['Amina'] text-[16.723px] font-normal leading-[27.871px]">
                          {propertyInfo.data.content.fields.valuation} MIST
                        </p>
                      ) : (
                        <></>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row justify-between items-start self-stretch">
                  <div className="w-[161.655px] flex flex-col items-start gap-1">
                    <p className="self-stretch text-[#EDEDED]/60 font-['Amina'] text-[16.723px] font-normal leading-[27.871px]">
                      APY% :
                    </p>
                  </div>
                  <div className="w-[132.39px] flex flex-col items-start gap-1">
                    {propertyInfo ? (
                      <p className="self-stretch text-[#EDEDED]/60 text-right font-['Amina'] text-[16.723px] font-normal leading-[27.871px]">
                        {propertyInfo.data.content.fields.api_percent}
                      </p>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>

              {/* Third Column */}
              <div className="w-[319.129px] py-2.5 px-3 flex flex-col items-start gap-1 border-b border-[#343434]">
                <div className="flex flex-row justify-between items-start self-stretch">
                  <div className="w-[161.655px] flex flex-col items-start gap-1">
                    <p className="self-stretch text-[#EDEDED]/60 font-['Amina'] text-[16.723px] font-normal leading-[27.871px]">
                      Investors :
                    </p>
                  </div>
                  <div className="w-[132.39px] flex flex-col items-start gap-1">
                    {propertyInfo ? (
                      <p className="self-stretch text-[#EDEDED]/60 text-right font-['Amina'] text-[16.723px] font-normal leading-[27.871px]">
                        {propertyInfo.data.content.fields.shareholders}
                      </p>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>

                <div className="flex flex-row justify-between items-start self-stretch">
                  <div className="w-[161.655px] flex flex-col items-start gap-1">
                    <p className="self-stretch text-[#EDEDED]/60 font-['Amina'] text-[16.723px] font-normal leading-[27.871px]">
                      Projected Return :
                    </p>
                  </div>
                  <div className="w-[132.39px] flex flex-col items-start gap-1">
                    <p className="self-stretch text-[#EDEDED]/60 text-right font-['Amina'] text-[16.723px] font-normal leading-[27.871px]">
                      0.144 ETH /yr
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Invest Button */}
            <button
              onClick={() => setShowPopup(true)}
              className="flex flex-row w-[319px] h-[49px] justify-center items-center gap-3 rounded bg-white"
            >
              <span className=" text-black text-center font-['Amina'] text-xl font-normal leading-[30.637px] capitalize">
                Invest
              </span>
            </button>
            <button
              onClick={() => setShowPopup(true)}
              className="flex flex-row w-[319px] h-[49px] justify-center items-center gap-3 rounded "
            >
              <span className=" text-white text-center font-['Amina'] text-[18px] font-normal leading-[30.637px] capitalize">
                Redeem
              </span>
            </button>

            {showPopup && (
              <div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50"
                onClick={handleClose}
              >
                <div
                  className="flex flex-row w-[393px] p-2.5 items-center gap-2 bg-black"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Left Border Column */}
                  <div className="flex w-[4px] flex-col items-center gap-2 shrink-0 self-stretch">
                    <div className="h-1 w-full bg-[#A0A0A0]" />
                    <div className="flex flex-row w-0.5 items-center gap-2.5 flex-grow flex-shrink-0 basis-0 bg-[#1C1C1C]" />
                    <div className="h-1 w-full bg-[#A0A0A0]" />
                  </div>

                  {/* Main Content */}
                  <div className="flex flex-col items-center flex-grow flex-shrink-0 basis-0">
                    <div className="h-0.5 w-full bg-[#1C1C1C]" />

                    {/* Form Section */}
                    <div className="py-8 px-5 flex flex-col justify-center items-start gap-3.5">
                      <h2 className="w-full text-[#25D0AB] font-['Amina'] text-3xl font-normal leading-9">
                        Enter the amount u want to Invest?
                      </h2>

                      <p className="w-[279px] text-white/60 font-['Amina'] text-base font-normal leading-7">
                        Please enter the amount you want to invest
                      </p>

                      {/* Input Field */}
                      <input
                        type="text"
                        inputMode="numeric"
                        value={investAmount}
                        onChange={(e) => setInvestAmount(e.target.value)}
                        pattern="[0-9]*"
                        placeholder="Enter The Amount"
                        className="w-[319px] h-12 px-4 border border-[#353535] rounded text-white placeholder-[#353535] font-['Amina'] text-base font-normal leading-8 capitalize outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />

                      {/* Bet Button */}
                      <button
                        onClick={invest}
                        className="flex flex-row w-[319px] h-12 justify-center items-center gap-3 rounded bg-white"
                      >
                        <span className="text-black text-center font-['Amina'] text-xl font-normal leading-8 capitalize">
                          Invest
                        </span>
                      </button>

                      {/* Terms and Conditions */}
                      <p className="w-[319px] text-white/40 text-center font-['Amina'] text-xs font-normal leading-7">
                        Terms and conditions
                      </p>
                      <p className="w-[319px] text-white/40 text-center font-['Amina'] text-xs font-normal leading-7"></p>
                    </div>

                    <div className="h-0.5 w-full bg-[#1C1C1C]" />
                  </div>

                  {/* Right Border Column */}
                  <div className="flex w-[4px] flex-col items-center gap-2 shrink-0 self-stretch">
                    <div className="h-1 w-full bg-[#A0A0A0]" />
                    <div className="flex flex-row w-0.5 items-center gap-2.5 flex-grow flex-shrink-0 basis-0 bg-[#1C1C1C]" />
                    <div className="h-1 w-full bg-[#A0A0A0]" />
                  </div>
                </div>
              </div>
            )}

            <p className="w-[319px] text-white/40 text-center font-['Amina'] text-xs font-normal leading-[27.871px]">
              Terms and conditions
            </p>
          </div>

          <div className="h-0.5 flex flex-col items-start gap-2.5 self-stretch bg-[#1C1C1C]" />
        </div>

        {/* Right Border */}
        <div className="w-1 flex flex-col justify-center items-end gap-2 self-stretch">
          <div className="h-1 self-stretch bg-[#A0A0A0]" />
          <div className="flex flex-row w-0.5 items-center gap-2.5 flex-grow flex-shrink-0 flex-basis-0 bg-[#1C1C1C]" />
          <div className="h-1 self-stretch bg-[#A0A0A0]" />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
