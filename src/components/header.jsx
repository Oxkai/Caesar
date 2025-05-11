import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <div className="flex flex-row w-full h-10 justify-between items-center">
      {/* Logo */}
      <div className="w-36 h-9 flex-shrink-0 rounded bg-white" />

      {/* Menu Items */}
      <div className="flex flex-row items-center gap-8">
        <Link className="text-white/80 text-center font-['Amina'] text-lg font-normal leading-6" to="/">
          Home
        </Link>
         <Link className="text-white/80 text-center font-['Amina'] text-lg font-normal leading-6" to="/bet">
          Bet
        </Link>
        <Link className="text-white/80 text-center font-['Amina'] text-lg font-normal leading-6" to="/property">
          Property
        </Link>
       
        <Link className="text-white/80 text-center font-['Amina'] text-lg font-normal leading-6" to="/kyc">
          KYC
        </Link>
        <Link className="text-white/80 text-center font-['Amina'] text-lg font-normal leading-6" to="/documents">
          Documents
        </Link>
      </div>

      {/* Connect Button */}
      <button className="flex flex-row w-30 pt-3 pb-2 px-5 justify-center items-center gap-2 flex-shrink-0 rounded bg-[#04312C]">
        <span className="text-[#25D0AB] text-center font-['Amina'] text-base font-normal leading-[22px] capitalize">
          CONNECT
        </span>
      </button>
    </div>
  );
}