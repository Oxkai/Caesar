import { useState } from "react";
import myImage from '../../assets/7.png'

function BettingCard2() {
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
         <img 
                   src={myImage}
                       alt="Property"
         
                 width={214} 
                 height={213} 
                 className="w-[214px] h-[213px] rounded-[7px] bg-[rgba(37,208,171,0.2)] flex items-center justify-center overflow-hidden"
               />
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

        {/* Question Section */}
        <div className="px-[9px] flex flex-col items-start gap-[18px] self-stretch">
          <div className="flex flex-col items-start self-stretch">
            <p className="self-stretch text-[#25D0AB] font-['Amina'] text-xl leading-[27px] tracking-[-0.5px]">
              Will Messi play in the 2026 FIFA World Cup?
            </p>
          </div>
        </div>

        {/* Progress Bar Section */}
        <div className="flex flex-col items-center gap-[6px] self-stretch">
          <div className="w-[228px] h-[5.086px] flex flex-col items-start bg-[#1c1c1c]">
            <div className="w-[150.134px] h-[5.086px] flex-shrink-0 bg-[#25D0AB]"></div>
          </div>
          <div className="flex justify-between items-start px-[5px] self-stretch">
            <div className="w-[115.5px] flex flex-col items-start gap-[3px]">
              <p className="self-stretch text-[#25D0AB] font-['Amina'] text-[12px] leading-[20px]">
                60%
              </p>
            </div>
            <div className="w-[94.6px] flex flex-col items-start gap-[3px]">
              <p className="self-stretch text-[#ededed] text-right font-['Amina'] text-[12px] leading-[20px]">
                40%
              </p>
            </div>
          </div>
        </div>

        {/* YES/NO Values Section */}
        <div className="py-[7px] px-[9px] flex flex-col items-start gap-[3px] self-stretch border-b border-[#343434] border-b-[0.996px]">
          <div className="flex justify-between items-start self-stretch">
            <div className="w-[115.5px] flex flex-col items-start gap-[3px]">
              <p className="self-stretch text-[#ededed] font-['Amina'] text-[12px] leading-[20px]">
                YES
              </p>
            </div>
            <div className="w-[94.6px] flex flex-col items-start gap-[3px]">
              <p className="self-stretch text-[#ededed] text-right font-['Amina'] text-[12px] leading-[20px]">
                NO
              </p>
            </div>
          </div>
          <div className="flex justify-between items-start self-stretch">
            <div className="w-[115.5px] flex flex-col items-start gap-[3px]">
              <p className="self-stretch text-[#ededed] font-['Amina'] text-[12px] leading-[20px]">
                $720
              </p>
            </div>
            <div className="w-[94.6px] flex flex-col items-start gap-[3px]">
              <p className="self-stretch text-[#ededed] text-right font-['Amina'] text-[12px] leading-[20px]">
                $480
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
            <span className="text-[#25D0AB] text-center font-['Rajdhani'] text-[16px] not-italic font-semibold leading-[24px] capitalize">
              YES
            </span>
          </button>
          <button className="flex-grow flex-shrink-0 basis-0 flex justify-center items-center self-stretch rounded-[1.83px] bg-[#04312C]">
            <span className="text-[#25D0AB] text-center font-['Rajdhani'] text-[16px] not-italic font-semibold leading-[24px] capitalize">
              NO
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

export default BettingCard2;
