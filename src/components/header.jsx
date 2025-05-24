import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useWallet, ConnectModal } from '@suiet/wallet-kit';

export default function Header() {
  const { connected, account, disconnect } = useWallet();
  const [showModal, setShowModal] = useState(false);

  const walletAddress = account?.address;

  const shortenAddress = (address) =>
    address.slice(0, 6) + '...' + address.slice(-4);

  const navLinkClass =
    "text-center font-['Amina'] text-lg font-normal leading-6 transition duration-150";

  return (
    <>
      <div className="flex flex-row w-full h-10 justify-between items-center relative">
        {/* Logo */}
        <div className="flex w-[142px] h-[36px] p-[10px] justify-center items-center gap-[10px]">
          <p className="text-white font-['rajdhani'] text-[24px] not-italic font-semibold leading-normal tracking-[5.52px]">
            C<span className="text-[#25D0AB]">A</span>ESER
          </p>
        </div>

        {/* Menu Items */}
        <div className="flex flex-row items-center gap-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${navLinkClass} ${
                isActive ? "text-white" : "text-white/50 hover:text-white"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/property"
            className={({ isActive }) =>
              `${navLinkClass} ${
                isActive ? "text-white " : "text-white/50 hover:text-white"
              }`
            }
          >
            RWA
          </NavLink>
          <NavLink
            to="/bet"
            className={({ isActive }) =>
              `${navLinkClass} ${
                isActive ? "text-white " : "text-white/50 hover:text-white"
              }`
            }
          >
            P2P
          </NavLink>
          <NavLink
            to="/swap"
            className={({ isActive }) =>
              `${navLinkClass} ${
                isActive ? "text-white" : "text-white/50 hover:text-white"
              }`
            }
          >
            Swap
          </NavLink>
          <NavLink
            to="/documents"
            className={({ isActive }) =>
              `${navLinkClass} ${
                isActive ? "text-white " : "text-white/50 hover:text-white"
              }`
            }
          >
            Tokenization
          </NavLink>
        </div>

        {/* Connect / Disconnect Button */}
        <div>
          <button
            onClick={() => {
              if (connected) {
                disconnect();
              } else {
                setShowModal(true);
              }
            }}
            className="flex hover:bg-[#064942] flex-row w-30 pt-3 pb-2 px-5 justify-center items-center gap-2 flex-shrink-0 rounded bg-[#04312C]"
          >
            <span className="text-[#25D0AB] text-center font-['Amina'] text-base font-normal leading-[22px] capitalize">
              {connected ? shortenAddress(walletAddress) : 'CONNECT'}
            </span>
          </button>
        </div>
      </div>

      {/* ConnectModal */}
      <ConnectModal open={showModal} onOpenChange={(open) => setShowModal(open)} />
    </>
  );
}
