
import React, { useState } from 'react'

 

const lenders = [
  {
    address: "0x456c4c...76a",
    name: "Rohit Mehra",
    availableAmount: "15000 - 20000 USDC",
    interestRange: "7 - 10%",
    preferredTenure: "6-18 months",
    riskAppetite: "Medium",
    regionsAllowed: "India, UAE",
  },
  {
    address: "0x99aC88...Bd3",
    name: "Sanya Kapoor",
    availableAmount: "20000 - 25000 USDC",
    interestRange: "6 - 8%",
    preferredTenure: "12-24 months",
    riskAppetite: "High",
    regionsAllowed: "India, Singapore",
  },
  {
    address: "0x7A1E55...F21",
    name: "Ankit Sharma",
    availableAmount: "10000 - 15000 USDC",
    interestRange: "8 - 12%",
    preferredTenure: "3-12 months",
    riskAppetite: "Low",
    regionsAllowed: "India, UK",
  },
  {
    address: "0xBB73C1...9A7",
    name: "Meera Jain",
    availableAmount: "30000 - 40000 USDC",
    interestRange: "5 - 7%",
    preferredTenure: "12-36 months",
    riskAppetite: "Medium",
    regionsAllowed: "UAE, Singapore",
  },
  {
    address: "0xC77E88...35F",
    name: "Rajat Verma",
    availableAmount: "25000 - 30000 USDC",
    interestRange: "9 - 11%",
    preferredTenure: "6-24 months",
    riskAppetite: "High",
    regionsAllowed: "India, UAE, Singapore",
  },
  {
    address: "0xE12D76...AD5",
    name: "Kiran Desai",
    availableAmount: "5000 - 10000 USDC",
    interestRange: "6 - 9%",
    preferredTenure: "6-12 months",
    riskAppetite: "Medium",
    regionsAllowed: "India",
  },
  {
    address: "0xAB79D1...8A4",
    name: "Pranav Patel",
    availableAmount: "10000 - 20000 USDC",
    interestRange: "7 - 8.5%",
    preferredTenure: "9-18 months",
    riskAppetite: "Low",
    regionsAllowed: "India, Singapore,",
  }
];




const Bet = () => {

const [borrow, setBorrow] = useState(0);
  
  return (
   <>
  <div 
        className="flex flex-col justify-center items-center gap-12 w-full"
        data-testid="1507:22"
      >
        <div 
          className="flex flex-col items-center w-full"
          data-testid="1529:245"
        >
          <div 
            className="flex flex-col items-center w-full"
            data-testid="1529:246"
          >
            {/* Header Section */}
            <div 
              className="flex flex-row pb-7 justify-between items-center w-full"
              data-testid="1529:248"
            >
              <div 
                className="flex flex-row px-4 justify-center items-center gap-3"
                data-testid="1529:249"
              >
                <h1 
                  className="text-[#25D0AB] text-4xl font-semibold leading-7"
                  style={{ fontFamily: 'Rajdhani, sans-serif' }}
                  data-testid="1529:250"
                >
                  P2p lending / borrowing
                </h1>
              </div>
              
              <div 
                className="flex flex-row items-center gap-3"
                data-testid="1529:251"
              >
                {/* Search Input */}
                <div 
                  className="flex flex-row w-80 h-9 p-1 items-center gap-2 rounded border border-[#343434]"
                  data-testid="1529:252"
                >
                  <div 
                    className="flex flex-row px-3 items-center flex-1 h-full rounded"
                    data-testid="1529:253"
                  >
                    <input
                      type="text"
                      placeholder="Search Property  "
                      className="w-full bg-transparent text-white placeholder-[#343434] text-sm outline-none"
                      style={{ fontFamily: 'Amina, sans-serif' }}
                      data-testid="1529:254"
                    />
                  </div>
                </div>
                
                {/* Borrow/Lend Toggle */}
                <div 
                  className="flex flex-row items-center"
                  data-testid="1529:257"
                >
                  


                  <div 
                    className="flex flex-row w-28 h-9 justify-center items-center gap-2 rounded border border-emerald-800/40"
                    data-testid="1529:258"
                   
                  >
                    <span 
                      className="text-emerald-400/50 text-center text-sm capitalize"
                      style={{ fontFamily: 'Amina, sans-serif' }}
                      data-testid="1529:259"
                     
                    >
                      Borrow
                    </span>
                  </div>
                  <div 
                    className="w-28 flex flex-col items-start gap-3"
                    data-testid="1529:260"
                  >
                    <div 
                      className="flex flex-row h-9 justify-center items-center gap-2 w-full rounded bg-emerald-950"
                      data-testid="1529:261"
                    >
                      <span 
                        className="text-[#25D0AB] text-center text-sm capitalize"
                        style={{ fontFamily: 'Amina, sans-serif' }}
                        data-testid="1529:262"
                      >
                        Lend
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Table Section */}
            <div 
              className="flex flex-col items-start w-full"
              data-testid="1529:263"
            >
              {/* Table Header */}
              <div 
                className="flex flex-row py-4 pl-4 justify-between items-center w-full border-b border-[#343434]"
                data-testid="1529:265"
              >
                <div 
                  className="flex flex-row w-36 justify-center items-center gap-3"
                  data-testid="1529:337"
                >
                  <span 
                    className="w-36  flex-shrink-0 text-white/50 text-sm leading-7"
                    style={{ fontFamily: 'Amina, sans-serif' }}
                    data-testid="1529:266"
                  >
                    Lender
                  </span>
                </div>
                <div 
                  className="flex flex-row w-36 justify-center items-center gap-3"
                  data-testid="1529:338"
                >
                  <span 
                    className="w-36 flex-shrink-0 text-white/50 text-sm leading-7"
                    style={{ fontFamily: 'Amina, sans-serif' }}
                    data-testid="1529:267"
                  >
                    Name
                  </span>
                </div>
                <div 
                  className="w-72 flex flex-col items-start gap-3"
                  data-testid="1529:339"
                >
                  <div 
                    className="flex flex-row items-center gap-12 w-full"
                    data-testid="1529:268"
                  >
                    <div 
                      className="flex flex-row w-36 justify-center items-center gap-3"
                      data-testid="1529:341"
                    >
                      <span 
                        className="w-36 flex-shrink-0 text-white/50 text-sm leading-7"
                        style={{ fontFamily: 'Amina, sans-serif' }}
                        data-testid="1529:269"
                      >
                        Available Amount
                      </span>
                    </div>
                    <div 
                      className="flex flex-row w-24 justify-center items-center gap-3"
                      data-testid="1529:340"
                    >
                      <span 
                        className="w-24 flex-shrink-0 text-white/50 text-sm leading-7"
                        style={{ fontFamily: 'Amina, sans-serif' }}
                        data-testid="1529:270"
                      >
                        Min Interest
                      </span>
                    </div>
                  </div>
                </div>
                <div 
                  className="flex flex-row w-36 justify-center items-center gap-3"
                  data-testid="1529:342"
                >
                  <span 
                    className="w-36 flex-shrink-0 text-white/50 text-sm leading-7"
                    style={{ fontFamily: 'Amina, sans-serif' }}
                    data-testid="1529:271"
                  >
                    Preferred Tenure
                  </span>
                </div>
                <div 
                  className="flex flex-row w-24 justify-center items-center gap-3"
                  data-testid="1529:343"
                >
                  <span 
                    className="w-24 flex-shrink-0 text-white/50 text-sm leading-7"
                    style={{ fontFamily: 'Amina, sans-serif' }}
                    data-testid="1529:272"
                  >
                    Risk Appetite
                  </span>
                </div>
                <div 
                  className="flex flex-row w-36 justify-center items-center gap-3"
                  data-testid="1529:337"
                >
                  <span 
                    className="w-36  flex-shrink-0 text-white/50 text-sm leading-7"
                    style={{ fontFamily: 'Amina, sans-serif' }}
                    data-testid="1529:266"
                  >
                    Regions Allowed
                  </span>
                </div>
              </div>
              
              {/* Table Row */}
             
               {lenders.map((lender, index) => (

 <div 
                className="flex flex-row py-4 pl-4 justify-between items-center hover:bg-[#11221F] w-full border-b border-[#343434]"
                data-testid="1529:298"
              >
                <div 
                  className="flex  flex-row w-36 justify-center items-center gap-3"
                  data-testid="1529:345"
                >
                  <span 
                    className="w-36  flex-shrink-0 text-white text-sm leading-7"
                    style={{ fontFamily: 'Amina, sans-serif' }}
                    data-testid="1529:299"
                  >
                     {lender.address}
                  </span>
                </div>
                <div 
                  className="flex flex-row w-36 justify-center items-center gap-3"
                  data-testid="1529:346"
                >
                  <span 
                    className="w-36 flex-shrink-0 text-white text-sm leading-7"
                    style={{ fontFamily: 'Amina, sans-serif' }}
                    data-testid="1529:300"
                  >
                    {lender.name}
                  </span>
                </div>
                <div 
                  className="flex flex-row items-center gap-12"
                  data-testid="1529:301"
                >
                  <div 
                    className=" w-36  "
                    data-testid="1529:347"
                  >
                    <span 
                      className="w-36 flex-shrink-0 text-white text-sm leading-7"
                      style={{ fontFamily: 'Amina, sans-serif' }}
                      data-testid="1529:302"
                    >
                      {lender.availableAmount}
                    </span>
                  </div>
                  <div 
                    className="flex flex-row w-24   justify-center items-center gap-3"
                    data-testid="1529:348"
                  >
                    <span 
                      className="w-24 flex-shrink-0 text-white text-sm leading-7"
                      style={{ fontFamily: 'Amina, sans-serif' }}
                      data-testid="1529:303"
                    >
                      {lender.interestRange}
                    </span>
                  </div>
                </div>
                <div 
                  className="flex flex-row w-36 justify-center items-center gap-3"
                  data-testid="1529:349"
                >
                  <span 
                    className="w-36 flex-shrink-0 text-white text-sm leading-7"
                    style={{ fontFamily: 'Amina, sans-serif' }}
                    data-testid="1529:304"
                  >
                    {lender.preferredTenure}
                  </span>
                </div>
                <div 
                  className="flex flex-row w-24 justify-center items-center gap-3"
                  data-testid="1529:350"
                >
                  <span 
                    className="w-24 flex-shrink-0 text-white text-sm leading-7"
                    style={{ fontFamily: 'Amina, sans-serif' }}
                    data-testid="1529:305"
                  >
                    {lender.riskAppetite}
                  </span>
                </div>
              <div 
                  className="flex flex-row w-36 justify-center items-center gap-3"
                  data-testid="1529:337"
                >
                  <span 
                    className="w-36 flex-shrink-0 text-white text-sm leading-7"
                    style={{ fontFamily: 'Amina, sans-serif' }}
                    data-testid="1529:266"
                  >
                    {lender.regionsAllowed}
                  </span>
                </div>
              </div>

               ))}
              
            
            </div>
          </div>
        </div>
      </div>
   </>
  )
}

export default Bet