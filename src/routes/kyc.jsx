
import React from 'react'
import {
  ConnectButton,
  WalletProvider,
} from '@suiet/wallet-kit';
import SwapWidget from '../components/SwapWidget';




const KYC = () => {
  





  return (
    <div>
      <ConnectButton/>
      <div className="App">
      <SwapWidget />
    </div>
      <button className="flex hover:bg-[#064942] flex-row w-30 pt-3 pb-2 px-5 justify-center items-center gap-2 flex-shrink-0 rounded bg-[#04312C]">
        <span className="text-[#25D0AB] hover:text-[#25D0AB] text-center font-['Amina'] text-base font-normal leading-[22px] capitalize">
          CONNECT
        </span>
      </button>
  
    </div>
  )
}

export default KYC