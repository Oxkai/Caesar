
import React from 'react'

import propertyImage from '../assets/back.png';
import { useLetterReveal } from '../components/useLetterReveal'

const Home = () => {

  const title1 = useLetterReveal("CAESER" , "ARENA!", 0.25);



  return (
    <>
  
     <img
            src={propertyImage}
            alt="Property"
            className="z-0 absolute  "
      />

   
     <div className="z-10 w-full max-w-7xl pt-20 px-2.5 flex flex-col items-start gap-2.5">
      <div className="flex flex-col items-center gap-8 w-full">
        <div className="flex flex-col justifs items-center gap-[2px]">
          <h1 className="px-2 w-full text-white  font-['Amina'] text-[90px] font-bold leading-tight">
           ENTER THE <span 
           onMouseEnter={title1.startAnimation}
        onMouseLeave={title1.reverseAnimation}
            
            className="text-[#25D0AB]">{title1.displayText || "ARENA!"}</span>
          </h1>
          <p className="w-full max-w-[890px] text-white/80 text-center font-['Amina'] text-[18px] font-normal leading-6">
            Caesar is your gateway to decentralized finance, letting verified users tokenize properties, swap assets cross-chain, and create P2P loans secured by tokenized collateral — all with blockchain trust and transparency.
          </p>
        </div>
        <div className="flex flex-row items-start gap-4">
          <button className="flex flex-row py-3 px-6 justify-center items-center gap-2.5 rounded bg-[#04312C]">
            <span className="text-[#25D0AB] text-center font-['rajdhani'] text-[20px] not-italic font-semibold leading-[25.229px] tracking-[0.5px] capitalize">
              CONNECT
            </span>
          </button>
          <button className="flex flex-row w-[121px] py-3 px-6 justify-center items-center gap-2.5 rounded bg-[#17191A]">
            <span className="text-white text-center font-['rajdhani'] text-[20px] not-italic font-semibold leading-[25.229px] tracking-[0.5px] capitalize">
              KYC
            </span>
          </button>
        </div>
      </div>
    </div>
    
    </>
    

  )
}

export default Home