
import React,{useState} from 'react'

import propertyImage from '../assets/back.png';
import { useLetterReveal } from '../components/useLetterReveal'

const Home = () => {
  const [fullName, setFullName] = useState("");
  const [idFile, setIdFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [kycStarted, setKycStarted] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");

  const simulateKYCProviderRedirect = async () => {
    const fakeRedirectUrl = "https://kyc-provider.com/session?user=wallet123";
    setRedirectUrl(fakeRedirectUrl);
    setKycStarted(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !idFile || !selfieFile) {
      alert("Please fill in all fields.");
      return;
    }
    console.log("Submitting:", { fullName, idFile, selfieFile });
    setIsSubmitted(true);
  };


















  const title1 = useLetterReveal("CAESER" , "ARENA!", 0.25);
  const [showPopup, setShowPopup] = useState(false);
  
    // Function to close the popup
    const handleClose = () => {
      setShowPopup(false);
    };



  return (
    <>
     <img
            src={propertyImage}
            alt="Property"
            className="z-0 absolute  w-[1086px]"
      />
     <div className="z-10 w-full max-w-7xl pt-[65px] px-2.5 flex flex-col items-start gap-2.5">
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
          <button  className="flex flex-row py-3 px-6 justify-center items-center gap-2.5 rounded bg-[#04312C]">
            <span className="text-[#25D0AB] text-center font-['rajdhani'] text-[20px] not-italic font-semibold leading-[25.229px] tracking-[0.5px] capitalize">
              CONNECT
            </span>
          </button>
          <button onClick={() => setShowPopup(true)} className="flex flex-row w-[121px] py-3 px-6 justify-center items-center gap-2.5 rounded bg-[#17191A]">
            <span className="text-white text-center font-['rajdhani'] text-[20px] not-italic font-semibold leading-[25.229px] tracking-[0.5px] capitalize">
              KYC
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
                  <div className="flex flex-col items-center flex-grow flex-shrink-0">
        <div className="h-0.5 self-stretch bg-neutral-800" />
        
        <div className="py-7 px-5 flex flex-col justify-center items-start gap-5">
          {/* Header section */}
          <div className="flex flex-col items-start gap-1 self-stretch">
            <h1 
              className="self-stretch text-teal-400 text-3xl font-medium leading-9"
              style={{ fontFamily: 'Amina, sans-serif' }}
            >
              KYC Verification
            </h1>
            <p 
              className="self-stretch w-[319px] text-white text-opacity-60 text-sm font-normal leading-[24px]"
              style={{ fontFamily: 'Amina, sans-serif' }}
            >
              Fill the required information and Upload the documents
            </p>
          </div>

          {/* Form section */}
          <div className="flex flex-col items-start gap-6">
            <div className="flex flex-col items-start gap-5">
              {/* Full Name field */}
              <div className="flex flex-col items-start gap-2">
                <label 
                  className="w-[279px] text-white text-opacity-80 text-sm font-medium"
                  style={{ fontFamily: 'Amina, sans-serif' }}
                >
                  Full Name*
                </label>
                <div className="flex flex-row w-[319px] h-11 px-3.5 justify-center items-center gap-3 rounded border border-solid border-[#353535]">
                  <input 
                    type="text"
                    value={fullName}
                    placeholder="Name"
                    className="flex-grow flex-shrink-0 bg-transparent text-neutral-600 text-sm font-normal leading-8 capitalize outline-none placeholder:text-neutral-600"
                    style={{ fontFamily: 'Amina, sans-serif' }}
                  />
                </div>
              </div>

              {/* First Government ID upload */}
              <div className="flex flex-col items-start gap-2">
                <label 
                  className="w-[279px] text-white text-opacity-80 text-sm font-medium"
                  style={{ fontFamily: 'Amina, sans-serif' }}
                >
                  Upload Government ID
                </label>
                <div className="flex flex-row w-[319px] h-11 px-3.5 justify-center items-center gap-3 rounded border border-solid border-[#353535]">
                  <input 
                    type="file"
                    id="gov-id-1"
                    className="hidden"
                    accept="image/*,application/pdf"
                    onChange={(e) => setIdFile(e.target.files[0])}
                    required
                  />
                  <label 
                    htmlFor="gov-id-1"
                    className="flex-grow flex-shrink-0 text-[#999999] text-sm font-medium leading-8 cursor-pointer"
                    style={{ fontFamily: 'Amina, sans-serif' }}
                  >
                    Choose File <span className="ml-2 text-[#353535]">no file selected</span>
                  </label>
                </div>
              </div>

              {/* Second Government ID upload */}
              <div className="flex flex-col items-start gap-2">
                <label 
                  className="w-[279px] text-white text-opacity-80 text-sm font-medium"
                  style={{ fontFamily: 'Amina, sans-serif' }}
                >
                  Upload Selfie
                </label>
                <div className="flex flex-row w-[319px] h-11 px-3.5 justify-center items-center gap-3 rounded border border-solid border-[#353535]">
                  <input 
                    type="file"
                    id="gov-id-1"
                    className="hidden"
                    accept="image/*,application/pdf"
                     onChange={(e) => setSelfieFile(e.target.files[0])}
                    required
                  />
                  <label 
                    htmlFor="gov-id-1"
                    className="flex-grow flex-shrink-0 text-[#999999] text-sm font-medium leading-8 cursor-pointer"
                    style={{ fontFamily: 'Amina, sans-serif' }}
                  >
                  Choose File <span className="ml-2 text-[#353535]">no file selected</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit button and terms */}
            <div className="w-[319px] flex flex-col items-start gap-2">
              <button className="flex flex-row h-12 justify-center items-center gap-3 self-stretch rounded bg-white">
                <span 
                  className="text-black text-center text-xl font-semibold leading-8 capitalize"
                  style={{ fontFamily: 'Rajdhani, sans-serif' }}
                >
                  verification
                </span>
              </button>
              <p 
                className="w-[319px] text-white text-opacity-40 text-center text-xs font-normal leading-7"
                style={{ fontFamily: 'Amina, sans-serif' }}
              >
                Terms and conditions
              </p>
            </div>
          </div>
        </div>
        
        <div className="h-0.5 self-stretch bg-neutral-800" />
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
    
    </>
    

  )
}

export default Home