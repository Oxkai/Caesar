
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import myImage from '../../assets/b.png'



function PropertyCard3() {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  

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

      <div className="w-[229px] px-2 flex flex-col items-start gap-4">
      {/* Header Section with Name and Role */}
      <div className="flex flex-col items-start w-full">
        <h3 className="w-full text-[#25D0AB] font-['Amina'] text-xl font-normal leading-7 tracking-tight">
          Orchid Bay
        </h3>
        <p className="w-full text-[#EDEDED] font-['Amina'] text-sm font-normal leading-[21px]">
          Bali, Indonesia
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
            76000
          </p>
          <p className="w-full text-[#EDEDED]/60 text-right font-['Amina'] text-xs font-normal leading-5">
            32 ETH
          </p>
          <p className="w-full text-[#EDEDED]/60 text-right font-['Amina'] text-xs font-normal leading-5">
            10%
          </p>
        </div>
      </div>
    </div>

        {/* Button Section */}
        <div className="flex flex-row items-start h-[35px] gap-[6px] self-stretch">
          <button
          
            className="flex-grow flex-shrink-0 basis-0 flex justify-center items-center self-stretch rounded-[1.83px] bg-[#04312C]"
          >
            <span className="text-[#25D0AB] text-center font-['Amina'] text-base leading-6 capitalize">
              More
            </span>
          </button>
          
        </div>
      </div>
    </div>
  );
}

export default PropertyCard3;
