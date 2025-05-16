
import React from 'react'
import BettingCard from '../components/bettingCard'
import PropertyCard from '../components/propertyCard'


const Bet = () => {
  return (
   <>
    <div className="flex flex-row justify-between items-center w-full">
          {/* Bets Title */}
          <div className="flex flex-row py-0 px-4 justify-center items-center gap-2.5">
            <span className="text-white font-['Amina'] text-4xl font-normal leading-7">
              Bets
            </span>
          </div>
          
          {/* Search and Balance Section */}
          <div className="flex flex-row items-center gap-2.5">
            {/* Search Property Input */}
           
              <input
  type="number"
  placeholder="Enter The Amount"
  className="w-[329px] h-9 px-4 border border-[#353535] rounded text-white placeholder-[#353535] font-['Amina'] text-base font-normal leading-8 capitalize outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
/>

           
            
            {/* Balance and Add Button */}
            <div className="flex flex-row h-9 justify-end items-center">
              {/* ETH Balance */}
              <div className="flex flex-row py-1.5 px-3 justify-center items-center h-full rounded bg-[#282828]">
                <span className="text-white text-center font-['rajdhani'] text-[16px] not-italic font-semibold leading-[13px] capitalize">
                  4.465 ETH
                </span>
              </div>
              
              {/* Plus Button */}
              <button className="flex flex-row w-9 py-0.5 px-3 justify-center items-center h-full rounded bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
  <path d="M4.37683 4.26624V0.203735H5.62683V4.26624H9.68933V5.51624H5.62683V9.57874H4.37683V5.51624H0.314331V4.26624H4.37683Z" fill="black"/>
</svg>
              </button>
            </div>
          </div>
        </div>
        <div className='flex justify-between items-start content-start gap-[10.561px] self-stretch flex-wrap'>
          <BettingCard/>
          <BettingCard/>
          <BettingCard/>
          <BettingCard/>
          <BettingCard/>
          <BettingCard/>
          <BettingCard/>
          <BettingCard/>
        </div>
   </>
  )
}

export default Bet