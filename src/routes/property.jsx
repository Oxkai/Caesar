
import React from 'react'
import BettingCard from '../components/bettingCard'
import PropertyCard from '../components/propertyCard'
const Property = () => {
  return (
   <>
    <div className="flex flex-row justify-between items-center w-full">
          {/* Bets Title */}
          <div className="flex flex-row py-0 px-4 justify-center items-center gap-2.5">
            <span className="text-white font-['Amina'] text-4xl font-normal leading-7">
              RWA Listed Properties
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
              
              
              {/* Plus Button */}
            
            </div>
          </div>
        </div>
        <div className='flex justify-between items-start content-start gap-[10.561px] self-stretch flex-wrap'>
         <PropertyCard/>
         <PropertyCard/>
         <PropertyCard/>
         <PropertyCard/>
        </div>
   </>
  )
}

export default Property