import { useState } from "react";

function PropertyCard() {
  const [showPopup, setShowPopup] = useState(false);

  // Function to close the popup
  const handleClose = () => {
    setShowPopup(false);
  };

  return (
    <div className="flex items-center p-[6px] gap-[10px] rounded-[9px] border border-solid border-[#343434]">
      <div className="w-[254px] p-3 flex flex-col justify-center items-center gap-[15px] rounded-[5px] border border-solid border-[#1c1c1c]">
        {/* Image Section with Vector2 */}
        <div className="w-[230px] flex flex-col justify-center items-center">
          <div className="flex justify-end items-center gap-[10px] self-stretch">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
            >
              <path d="M9.16663 9.82056V1.32056H0.666626" stroke="#7E7E7E" />
            </svg>
          </div>
          {/* Rectangle instead of image */}
          <div className="w-[214px] h-[213px] rounded-[7px] bg-[rgba(37,208,171,0.2)]"></div>
          <div className="flex items-center gap-[10px] self-stretch">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
            >
              <path d="M1.16663 0.820557V9.32056H9.66663" stroke="#7E7E7E" />
            </svg>
          </div>
        </div>

      <div className="w-[229px] px-2 flex flex-col items-start gap-4">
      {/* Header Section with Name and Role */}
      <div className="flex flex-col items-start w-full">
        <h3 className="w-full text-[#25D0AB] font-['Amina'] text-xl font-normal leading-7 tracking-tight">
          Mert Mumtaz
        </h3>
        <p className="w-full text-[#EDEDED] font-['Amina'] text-sm font-normal leading-[21px]">
          Cofounder, Helius
        </p>
      </div>
      
      {/* Stats Section with Labels and Values */}
      <div className="flex flex-row justify-between items-start w-full">
        {/* Labels Column */}
        <div className="w-[116px] flex flex-col items-start gap-0.5">
          <p className="w-full text-[#EDEDED]/60 font-['Amina'] text-xs font-normal leading-5">
            Token supply :
          </p>
          <p className="w-full text-[#EDEDED]/60 font-['Amina'] text-xs font-normal leading-5">
            Valuation :
          </p>
          <p className="w-full text-[#EDEDED]/60 font-['Amina'] text-xs font-normal leading-5">
            APY% :
          </p>
        </div>
        
        {/* Values Column */}
        <div className="w-[95px] flex flex-col items-start gap-0.5">
          <p className="w-full text-[#EDEDED]/60 text-right font-['Amina'] text-xs font-normal leading-5">
            5000
          </p>
          <p className="w-full text-[#EDEDED]/60 text-right font-['Amina'] text-xs font-normal leading-5">
            $10,00,000
          </p>
          <p className="w-full text-[#EDEDED]/60 text-right font-['Amina'] text-xs font-normal leading-5">
            12%
          </p>
        </div>
      </div>
    </div>

        {/* Button Section */}
        <div className="flex flex-row items-start h-[35px] gap-[6px] self-stretch">
          <button
            onClick={() => setShowPopup(true)}
            className="flex-grow flex-shrink-0 basis-0 flex justify-center items-center self-stretch rounded-[1.83px] bg-[#04312C]"
          >
            <span className="text-[#25D0AB] text-center font-['Amina'] text-base leading-6 capitalize">
              Learn More
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
                      Enter the amount u want to bet?
                    </h2>

                    <p className="w-[279px] text-white/60 font-['Amina'] text-base font-normal leading-7">
                      Please enter the amount you want to invest
                    </p>

                    {/* Input Field */}
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Enter The Amount"
                      className="w-[319px] h-12 px-4 border border-[#353535] rounded text-white placeholder-[#353535] font-['Amina'] text-base font-normal leading-8 capitalize outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />

                    {/* Bet Button */}
                    <button className="flex flex-row w-[319px] h-12 justify-center items-center gap-3 rounded bg-white">
                      <span className="text-black text-center font-['Amina'] text-xl font-normal leading-8 capitalize">
                        BET
                      </span>
                    </button>

                    {/* Terms and Conditions */}
                    <p className="w-[319px] text-white/40 text-center font-['Amina'] text-xs font-normal leading-7">
                      Terms and conditions
                    </p>
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
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;
