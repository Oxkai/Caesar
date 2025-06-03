import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useWallet, ConnectModal } from '@suiet/wallet-kit';
import { useLetterReveal } from '../components/useLetterReveal'

export default function Header() {
  const { connected, account, disconnect } = useWallet();
  const [showModal, setShowModal] = useState(false);
  const [varified,setVarified] = useState(true);
  const title2 = useLetterReveal("CAESER", "CAESER", 0.15);


  const walletAddress = account?.address;

  const shortenAddress = (address) =>
    address.slice(0, 6) + '...' + address.slice(-4);

  const navLinkClass =
    "text-center font-['Amina'] text-lg font-normal leading-6 transition duration-150";

  return (
    <>
      <div className="flex flex-row w-full h-10 justify-between items-center relative">
        {/* Logo */}
       <div 
  className="flex w-[142px] h-[36px] p-[10px]  items-center gap-[10px]"
>
  <p className="text-white font-['rajdhani'] text-[24px] not-italic font-semibold leading-normal tracking-[5.52px]">
    {title2.displayText.split('').map((char, index) => {
      // Highlight the 'A' character (or you can style it however you want)
      const isActive = char === 'A';
      return (
        <span
          key={index}
          onMouseEnter={title2.startAnimation}
          onMouseLeave={title2.reverseAnimation}
          className={isActive ? "text-[#25D0AB]" : ""}
        >
          {char}
        </span>
      );
    })}
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
            className="flex hover:bg-[#064942] flex-row w-30 pt-2.5 pb-2.5 px-5 justify-center items-center gap-2 flex-shrink-0 rounded bg-[#04312C]"
          >
            <span className="text-[#25D0AB] text-center font-['rajdhani'] text-[16px] font-medium leading-[22px] capitalize">
              {connected ? shortenAddress(walletAddress) : 'CONNECT'}
            </span>
             {connected  && varified ? (<div className='mb-[3px]'>
              <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M20.3477 10.0013C20.2341 9.83176 20.1221 9.66114 20.0121 9.48919C19.7903 9.17017 19.5452 8.88596 19.2874 8.59579C18.6047 7.8137 18.0108 7.12971 17.9987 6.04579L17.9919 5.71801C17.9887 5.49209 17.9859 5.26616 17.9835 5.04023L17.9764 4.71246L17.9727 4.41523C17.9033 3.87103 17.6379 3.5045 17.2227 3.1569C16.5441 2.767 15.7966 2.85417 15.0343 2.85898C13.9568 2.84515 13.3058 2.50317 12.5296 1.78468C11.9578 1.27338 11.3951 0.833866 10.7048 0.490234H9.90123C9.75862 0.584886 9.61546 0.678875 9.4691 0.767665C9.03559 1.03851 8.66013 1.34652 8.2885 1.69579C7.57341 2.36524 6.93413 2.82548 5.9179 2.8194L5.58011 2.82253C5.34806 2.82322 5.116 2.82254 4.88396 2.82044C4.26187 2.82873 3.77574 2.85696 3.27776 3.25304C2.63193 3.93185 2.60755 4.67119 2.61328 5.56801C2.61328 6.70515 2.52924 7.33924 1.74833 8.17912C1.64377 8.29542 1.53937 8.41186 1.43513 8.52843L1.28542 8.69466C0.931245 9.09354 0.598498 9.48666 0.436942 10.0013L0.347656 10.4458V10.8902C0.526228 11.1569 0.526228 11.1569 0.683175 11.4465C0.884451 11.7996 1.13641 12.0891 1.40792 12.3902C2.58842 13.7296 2.58842 13.7296 2.59235 14.6489L2.59759 14.9866C2.60058 15.2199 2.60223 15.4533 2.60247 15.6866C2.61631 16.397 2.6884 16.9701 3.11551 17.5569C3.55379 17.9703 3.95681 18.0998 4.55001 18.1059L4.87699 18.1123C5.10275 18.1161 5.32852 18.1189 5.5543 18.1206C6.43621 18.1406 7.18717 18.2569 7.83092 18.9013C8.17479 19.228 8.52676 19.5289 8.90234 19.818L9.04824 19.9325L9.05001 19.9338C9.3217 20.1416 9.57632 20.3364 9.90123 20.4458C9.90123 20.4751 10.7048 20.46 10.7048 20.4902L11.0619 20.3125C11.5399 20.0336 11.9513 19.7104 12.3566 19.3347C13.0744 18.6711 13.7307 18.1635 14.7446 18.1517L15.0604 18.1449C15.2776 18.1418 15.4948 18.139 15.7119 18.1366C16.422 18.1206 16.9103 18.085 17.4682 17.618C17.9119 17.0904 18.0366 16.6137 18.0356 15.9423L18.0397 15.6177C18.0418 15.3941 18.0423 15.1704 18.0411 14.9468C18.0594 13.904 18.4349 13.2945 19.1479 12.5625C19.6381 12.0472 20.0689 11.5931 20.2584 10.8902L20.3477 10.0013ZM14.7896 8.02912C14.6964 7.68128 14.5683 7.54505 14.2762 7.33468C13.7892 7.27617 13.5661 7.3425 13.2072 7.67639L13.0081 7.87426L12.7873 8.09371L12.5575 8.32357L12.5338 8.34704C12.1363 8.74089 11.7403 9.1333 11.3741 9.55655C11.0701 9.90837 10.7489 10.2408 10.4214 10.571L10.197 10.7958L9.96941 11.0279L9.74951 11.2482C9.5164 11.4833 9.35022 11.6665 9.00837 11.6902C8.83704 11.5473 8.70556 11.4139 8.56194 11.2458C8.05334 10.6473 7.49814 9.83843 6.70368 9.6569C6.41908 9.73468 6.41908 9.73468 6.15681 9.92357C5.97266 10.1791 5.97266 10.1791 5.93917 10.4625C5.97379 10.721 6.00825 10.833 6.1851 11.0215L6.34166 11.1743L6.51426 11.3439C6.88312 11.7044 7.25526 12.0617 7.60073 12.4447C8.03688 12.9606 8.47966 13.5896 9.17578 13.7013C9.57791 13.6213 9.57791 13.6213 10.1045 13.1002L10.2542 12.9507C10.3604 12.8451 10.4665 12.7396 10.5726 12.634C10.7385 12.4682 10.9045 12.3025 11.071 12.1373C11.5516 11.6605 12.0373 11.1888 12.4807 10.677C12.7268 10.3892 12.9876 10.1217 13.258 9.85636C13.7866 9.33995 14.6153 8.76669 14.7896 8.02912Z" fill="#25D0AB"/>
              </svg>
            </div>):(
              <>
              </>
            )}
           
          </button>
        </div>
      </div>

      {/* ConnectModal */}
      <ConnectModal open={showModal} onOpenChange={(open) => setShowModal(open)} />
    </>
  );
}
