import { useState, useEffect } from 'react'
import { ConnectButton, useWallet } from '@suiet/wallet-kit'
import { Transaction } from "@mysten/sui/transactions"
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client'



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
  },
];




const lender = [
  {
    address: "0x456c4c...76a",
    name: "Rohit Mehra",
    availableAmount: "15000 - 20000 USDC",
    interestRange: "7 - 10%",
    preferredTenure: "6-18 months",
    riskAppetite: "Medium",
    regionsAllowed: "India, UAE",
  },
 
];



const client = new SuiClient({ url: getFullnodeUrl('testnet') })
const PACKAGE_ID = '0x3682a302f2370ff62c63de2d5d321a321ff623d6c58b7c65c36fe9074901ae70'









const Bet = () => {
  const [active, setActive] = useState("open"); // Options: 'open', 'closed', 'other'
  const [activeTab, setActiveTab] = useState("lend"); // 'lend' is active by default
  const [showPopup, setShowPopup] = useState(false);
  const [extend, setExtend] = useState(true);

  // Function to close the popup
  const handleClose = () => {
    setShowPopup(false);
  };



















  const { connected, account } = useWallet()
    const wallet = useWallet()
  
    const [txHash, setTxHash] = useState('')
    const [loading, setLoading] = useState(false)
    const [fetchingLoans, setFetchingLoans] = useState(false)
    const [loans, setLoans] = useState([])
  
    // Input fields for creating a loan
    const [nftId, setNftId] = useState('')
    const [appraisedValue, setAppraisedValue] = useState('')
    const [principal, setPrincipal] = useState('1000000000')
    const [interestRate, setInterestRate] = useState('')
    const [duration, setDuration] = useState('')
  
    const handleCreateLoan = async () => {
      if (!connected || !account?.address) {
        alert('Please connect wallet first')
        return
      }
  
      try {
        setLoading(true)
        const tx = new Transaction()
  
        // Validate inputs
        if (!nftId || !appraisedValue || !principal || !interestRate || !duration) {
          throw new Error('Please fill in all fields')
        }
  
        // Verify NFT ownership
        const nftObject = await client.getObject({
          id: nftId,
          options: { showContent: true, showOwner: true, showType: true }
        })
  
        if (!nftObject.data) throw new Error('NFT not found')
        if (nftObject.data.owner?.AddressOwner !== account.address) {
          throw new Error('You do not own this NFT')
        }
  
        tx.moveCall({
          target: `${PACKAGE_ID}::loan::create_loan_request`,
          typeArguments: [nftObject.data.type],
          arguments: [
            tx.object(nftId),
            tx.pure.u64(Number(appraisedValue)),
            tx.pure.u64(Number(principal)),
            tx.pure.u64(Number(interestRate)),
            tx.pure.u64(Number(duration)),
            tx.object('0x6'),
          ]
        })
  
        tx.setGasBudget(100_000_000)
  
        const res = await wallet.signAndExecuteTransaction({
          transaction: tx,
          options: {
            showEffects: true,
            showObjectChanges: true,
            showEvents: true,
          },
        })
  
        if (res.effects?.status?.status !== 'success') {
          throw new Error(`Transaction failed: ${res.effects?.status?.error || 'Unknown error'}`)
        }
  
        setTxHash(res.digest)
        await fetchLoans()
      } catch (err) {
        console.error(err)
        alert('Transaction failed: ' + err.message)
      } finally {
        setLoading(false)
      }
    }
  
    const fetchLoans = async () => {
      if (!connected || !account?.address) return
  
      try {
        setFetchingLoans(true)
  
        const ownedObjects = await client.getOwnedObjects({
          owner: account.address,
          filter: {
            StructType: `${PACKAGE_ID}::loan::Loan`
          },
          options: {
            showContent: true,
            showType: true,
          }
        })
  
        const loanEvents = await client.queryEvents({
          query: {
            MoveEventType: `${PACKAGE_ID}::loan::LoanCreated`
          },
          order: 'descending',
          limit: 50
        })
  
        const processedLoans = []
  
        for (const obj of ownedObjects.data) {
          if (obj.data?.content?.dataType === 'moveObject') {
            processedLoans.push({
              id: obj.data.objectId,
              type: 'owned',
              ...obj.data.content.fields
            })
          }
        }
  
        for (const event of loanEvents.data) {
          if (event.parsedJson) {
            processedLoans.push({
              id: event.parsedJson.loan_id,
              type: 'created',
              borrower: event.parsedJson.borrower,
              principal: event.parsedJson.principal,
              interest_rate: event.parsedJson.interest_rate,
              duration: event.parsedJson.duration,
              collateral_value: event.parsedJson.collateral_value,
              ltv_ratio: event.parsedJson.ltv_ratio,
              timestamp: event.timestampMs,
              
            })
          }
        }
  
        setLoans(processedLoans)
      } catch (error) {
        console.error('Failed to fetch loans:', error)
      } finally {
        setFetchingLoans(false)
      }
    }
  
    const getLoanDetails = async (loanId) => {
      try {
        const loanObject = await client.getObject({
          id: loanId,
          options: {
            showContent: true,
            showType: true,
          }
        })
        console.log('Loan details:', loanObject)
      } catch (error) {
        console.error('Failed to get loan details:', error)
      }
    }
  
    const fundLoan = async (loanId, amount) => {
    if (!connected || !account?.address) {
      alert('Please connect wallet first')
      return
    }
  
    try {
      setLoading(true)
      const tx = new Transaction()
      
      // Split coins for the loan payment (separate from gas)
      const [coin] = tx.splitCoins(tx.gas, [amount])
  
      tx.moveCall({
        target: `${PACKAGE_ID}::loan::fund_loan`,
        // FIXED: Use the correct NFT type, not SUI coin type
        typeArguments: ['0xbca88b2db1c6a0510a7fde74669bf04fdf79441dc3e16c7cc3355d1610094f26::property_nft::PropertyNFT'],
        arguments: [
          tx.object(loanId),
          coin, // This is the SUI payment coin
          tx.object('0x6'), // Clock object
        ]
      })
  
      tx.setGasBudget(100_000_000)
  
      const res = await wallet.signAndExecuteTransaction({
        transaction: tx,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      })
  
      if (res.effects?.status?.status !== 'success') {
        throw new Error(`Transaction failed: ${res.effects?.status?.error || 'Unknown error'}`)
      }
  
      console.log('Loan funded:', res)
      await fetchLoans()
    } catch (error) {
      console.error('Failed to fund loan:', error)
      alert('Failed to fund loan: ' + error.message)
    } finally {
      setLoading(false)
    }
  }
  
  // ALTERNATIVE: Dynamic type detection version
  const fundLoanDynamic = async (loanId, amount) => {
    if (!connected || !account?.address) {
      alert('Please connect wallet first')
      return
    }
  
    try {
      setLoading(true)
      
      // First, get the loan object to extract the NFT type
      const loanObject = await suiClient.getObject({
        id: loanId,
        options: { showType: true }
      })
      
      // Extract NFT type from Loan<T> type
      const loanType = loanObject.data?.type
      const nftTypeMatch = loanType?.match(/Loan<(.+)>/)?.[1]
      
      if (!nftTypeMatch) {
        throw new Error('Could not determine NFT type from loan object')
      }
  
      const tx = new Transaction()
      const [coin] = tx.splitCoins(tx.gas, [amount])
  
      tx.moveCall({
        target: `${PACKAGE_ID}::loan::fund_loan`,
        typeArguments: [nftTypeMatch], // Dynamically extracted NFT type
        arguments: [
          tx.object(loanId),
          coin,
          tx.object('0x6'),
        ]
      })
  
      tx.setGasBudget(100_000_000)
  
      const res = await wallet.signAndExecuteTransaction({
        transaction: tx,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      })
  
      if (res.effects?.status?.status !== 'success') {
        throw new Error(`Transaction failed: ${res.effects?.status?.error || 'Unknown error'}`)
      }
  
      console.log('Loan funded:', res)
      await fetchLoans()
    } catch (error) {
      console.error('Failed to fund loan:', error)
      alert('Failed to fund loan: ' + error.message)
    } finally {
      setLoading(false)
    }
  }
  
    useEffect(() => {
      if (connected && account?.address) {
        fetchLoans()
      }
    }, [connected, account?.address])
























  return (
    <>
      <div
        className="flex flex-col justify-center items-center  w-full"
        data-testid="1507:22"
      >
        <div
          className="flex flex-col items-center w-full"
          data-testid="1529:245"
        >
          <div
            className="flex flex-col items-center  w-full"
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
                  style={{ fontFamily: "Rajdhani, sans-serif" }}
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
                      style={{ fontFamily: "Amina, sans-serif" }}
                      data-testid="1529:254"
                    />
                  </div>
                </div>

                {/* Borrow/Lend Toggle */}

                <div
                  className="flex flex-row items-center gap-3"
                  data-testid="1529:257"
                >
                  {/* Borrow Button */}
                  <div
                    className={`flex flex-row w-28 h-9 justify-center items-center gap-2 rounded border ${
                      active === "_request"
                        ? "bg-[#0B453F]/80 border-[#25D0BC]"
                        : "border-emerald-800/40"
                    } cursor-pointer`}
                    data-testid="1529:258"
                    onClick={() => setActive("_request")}
                  >
                    <span
                      className={`text-center text-sm capitalize ${
                        active === "_request"
                          ? "text-[#25D0BC]"
                          : "text-emerald-400/50"
                      }`}
                      style={{ fontFamily: "Amina, sans-serif" }}
                      data-testid="1529:259"
                    >
                      Requests
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* buttons */}

            <div className="flex w-full mt-[-16px] items-start">
              <div className="flex flex-row py-5 items-start gap-2.5 flex-1">
                {/* Open Button */}
                <div
                  onClick={() => setActive("open")}
                  className={
                    active === "open"
                      ? "flex flex-row h-10 justify-center items-center gap-2.5 flex-1 rounded-sm border border-[#25D0BC] bg-[#0B453F]/80"
                      : "flex flex-row h-10 justify-center items-center gap-2.5 flex-1 rounded-sm border border-[#25D0BC]/40"
                  }
                >
                  <span
                    className={
                      active === "open"
                        ? "text-[#25D0BC] text-center font-['rajdhani'] text-[15.179px] font-semibold leading-[23.252px] capitalize"
                        : "text-[#25D0BC]/50 text-center font-['rajdhani'] text-[15.179px] font-semibold leading-[23.252px] capitalize"
                    }
                  >
                    Open
                  </span>
                </div>

                {/* Active Button */}
                <div
                  onClick={() => setActive("active")}
                  className={
                    active === "active"
                      ? "flex flex-row h-10 justify-center items-center gap-2.5 flex-1 rounded-sm border border-[#25D0BC] bg-[#0B453F]/80"
                      : "flex flex-row h-10 justify-center items-center gap-2.5 flex-1 rounded-sm border border-[#25D0BC]/40"
                  }
                >
                  <span
                    className={
                      active === "active"
                        ? "text-[#25D0BC] text-center font-['rajdhani'] text-[15.179px] font-semibold leading-[23.252px] capitalize"
                        : "text-[#25D0BC]/50 text-center font-['rajdhani'] text-[15.179px] font-semibold leading-[23.252px] capitalize"
                    }
                  >
                    Active
                  </span>
                </div>

                {/* Closed Button */}
                <div
                  onClick={() => setActive("closed")}
                  className={
                    active === "closed"
                      ? "flex flex-row h-10 justify-center items-center gap-2.5 flex-1 rounded-sm border border-[#25D0BC] bg-[#0B453F]/80"
                      : "flex flex-row h-10 justify-center items-center gap-2.5 flex-1 rounded-sm border border-[#25D0BC]/40"
                  }
                >
                  <span
                    className={
                      active === "closed"
                        ? "text-[#25D0BC] text-center font-['rajdhani'] text-[15.179px] font-semibold leading-[23.252px] capitalize"
                        : "text-[#25D0BC]/50 text-center font-['rajdhani'] text-[15.179px] font-semibold leading-[23.252px] capitalize"
                    }
                  >
                    Closed
                  </span>
                </div>
              </div>
            </div>

            {/* <div className="w-full  py-5  flex flex-col items-start ">
              <div className="flex flex-row items-center w-full border border-solid border-teal-600">
               
                <div className="h-10 flex flex-col items-start flex-1 border-r border-teal-800 bg-slate-800">
                  <div className="flex flex-row mt-[-0.75px] bg  justify-between items-center  w-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="9"
                      height="9"
                      viewBox="0 0 9 9"
                      fill="none"
                    >
                      <path
                        d="M0.988281 8.78711V1.28711H8.48828"
                        stroke="#25D0AB"
                      />
                    </svg>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="9"
                      height="9"
                      viewBox="0 0 9 9"
                      fill="none"
                    >
                      <path
                        d="M8.3291 8.78711V1.28711H0.829102"
                        stroke="#25D0AB"
                      />
                    </svg>
                  </div>

                  <div className="w-full text-teal-400 text-center font-[rajdhani] text-sm font-semibold leading-7">
                    OPEN
                  </div>
                  <div className="flex flex-row justify-between items-center w-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="9"
                      height="9"
                      viewBox="0 0 9 9"
                      fill="none"
                    >
                      <path
                        d="M0.988281 0.787109V8.28711H8.48828"
                        stroke="#25D0AB"
                      />
                    </svg>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="9"
                      height="9"
                      viewBox="0 0 9 9"
                      fill="none"
                    >
                      <path
                        d="M8.3291 0.787109V8.28711H0.829102"
                        stroke="#25D0AB"
                      />
                    </svg>
                  </div>
                </div>

               
                <div className="h-10 flex flex-col justify-center items-center -gap-0.5 flex-1 border-r border-teal-800">
                  <div className="w-52 text-gray-400 text-center font-[rajdhani] text-sm font-semibold leading-7">
                    ACTIVE
                  </div>
                </div>

             
                <div className="h-10 flex flex-col justify-center items-center -gap-0.5 flex-1">
                  <div className="w-52 text-gray-400 text-center font-[rajdhani] text-sm font-semibold leading-7">
                    CLOSED
                  </div>
                </div>
              </div>
            </div> */}

            {active == "_request" ? (<>

             <div
                  className="flex flex-col items-start w-full"
                  data-testid="1529:263"
                >
                  <div
                    className=" pb-[18px] flex flex-col items-start gap-[10px] self-stretch"
                    data-testid="1533:44"
                  >
                    <button
                      onClick={() => setShowPopup(true)}
                      className="flex flex-row h-[78px] pt-[21px]  pb-[21px]  justify-center items-center gap-[6px] self-stretch rounded-[6px] border border-[rgba(37,208,171,0.3)] bg-[rgba(37,208,171,0.03)]"
                      data-testid="1533:45"
                    >
                      <div
                        className="pt-[1.066px] pl-[1.066px] pb-[4px] pr-[1.066px] flex flex-col items-start"
                        data-testid="1533:46"
                      >
                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 14 14" fill="none">
  <path d="M8.09857 1.10533C8.55314 1.42024 8.82468 1.85683 9.06422 2.34549C9.11007 2.43507 9.16397 2.51798 9.21972 2.60168C9.29961 2.72481 9.37147 2.84684 9.43507 2.9791C9.49801 3.10994 9.56893 3.23042 9.6482 3.35207C9.72653 3.47234 9.79695 3.59127 9.85911 3.72061C9.94654 3.90174 10.0515 4.06926 10.158 4.2397C10.236 4.36584 10.3088 4.49458 10.3808 4.62419C10.5182 4.87108 10.6599 5.11526 10.8027 5.35905C10.9834 5.66777 11.161 5.97794 11.3354 6.29024C11.4407 6.47789 11.5482 6.66425 11.6552 6.85096C11.6773 6.88983 11.6995 6.92871 11.7223 6.96876C11.9393 7.34931 12.159 7.72827 12.3788 8.10717C12.427 8.19016 12.4751 8.27317 12.5232 8.35618C12.5473 8.39776 12.5473 8.39776 12.5719 8.44018C12.71 8.67874 12.8464 8.91828 12.9827 9.15787C13.0949 9.35445 13.2093 9.54956 13.3252 9.74397C13.4856 10.0131 13.6444 10.2828 13.7931 10.5585C13.806 10.5819 13.8189 10.6053 13.8322 10.6295C13.9647 10.8798 14.0119 11.1158 14.0063 11.3977C14.0059 11.4227 14.0055 11.4477 14.0052 11.4735C14.0039 11.5429 14.0018 11.6124 13.9996 11.6819C13.999 11.7099 13.9983 11.7379 13.9977 11.7668C13.9714 12.1348 13.7579 12.4647 13.5378 12.7475C13.5201 12.7724 13.5024 12.7972 13.4841 12.8228C13.2295 13.1524 12.7954 13.3488 12.4011 13.458C12.2489 13.4768 12.0987 13.4772 11.9455 13.476C11.879 13.4764 11.879 13.4764 11.8112 13.4767C11.6893 13.4772 11.5675 13.477 11.4456 13.4766C11.3137 13.4762 11.1818 13.4767 11.05 13.4771C10.792 13.4778 10.5341 13.4776 10.2762 13.4772C10.0665 13.4769 9.85681 13.4768 9.64711 13.477C9.61721 13.477 9.5873 13.477 9.55649 13.4771C9.49574 13.4771 9.43498 13.4772 9.37423 13.4772C8.80518 13.4776 8.23613 13.4771 7.66709 13.4764C7.17935 13.4757 6.69161 13.4758 6.20387 13.4765C5.63679 13.4773 5.06971 13.4776 4.50263 13.4771C4.44211 13.4771 4.38158 13.477 4.32105 13.477C4.27639 13.477 4.27639 13.477 4.23082 13.4769C4.02149 13.4768 3.81216 13.477 3.60283 13.4773C3.34755 13.4777 3.09228 13.4776 2.837 13.4769C2.70688 13.4765 2.57677 13.4764 2.44664 13.4768C2.30532 13.4773 2.16402 13.4767 2.02269 13.476C1.96157 13.4765 1.96157 13.4765 1.89921 13.477C1.63211 13.4744 1.42094 13.4215 1.17629 13.3159C1.15099 13.306 1.12568 13.296 1.09961 13.2858C0.686853 13.1198 0.367885 12.708 0.181687 12.3213C0.136663 12.1976 0.0980685 12.0749 0.0641606 11.9478C0.0481515 11.8622 0.0481515 11.8622 0.00407911 11.824C-0.000495076 11.7237 -0.00250086 11.6246 -0.00258119 11.5243C-0.00301619 11.4969 -0.0034512 11.4696 -0.00389938 11.4414C-0.0049376 11.025 0.111737 10.7294 0.314893 10.3676C0.336506 10.3281 0.358119 10.2887 0.380387 10.248C0.493529 10.0425 0.6105 9.83976 0.732082 9.63916C0.832374 9.47306 0.929795 9.30527 1.02755 9.13766C1.04948 9.10007 1.07141 9.06247 1.09401 9.02374C1.2244 8.79979 1.35293 8.57497 1.47909 8.34862C1.62233 8.09261 1.77109 7.83982 1.91918 7.5866C2.06263 7.34124 2.2048 7.09524 2.34521 6.84813C2.42897 6.70094 2.51311 6.55396 2.59716 6.40693C2.63398 6.34251 2.67079 6.27808 2.70761 6.21365C2.96126 5.76977 2.96126 5.76977 3.02883 5.65154C3.07299 5.57423 3.11712 5.4969 3.1612 5.41954C3.34581 5.09583 3.53237 4.77327 3.71928 4.45089C3.76748 4.36771 3.81562 4.28449 3.86373 4.20126C4.00337 3.95974 4.14317 3.71833 4.28402 3.47751C4.55819 3.00918 4.55819 3.00918 4.82614 2.5373C4.8635 2.47076 4.9009 2.40425 4.93833 2.33775C4.96558 2.2892 4.99272 2.2406 5.01978 2.19195C5.35793 1.58619 5.74431 1.08272 6.42129 0.848769C6.99472 0.693126 7.59565 0.807735 8.09857 1.10533ZM6.32915 2.08439C6.08302 2.39705 5.89921 2.76559 5.70565 3.1122C5.60293 3.29605 5.49805 3.47856 5.39227 3.66067C5.2529 3.90063 5.11457 4.14115 4.97711 4.3822C4.84176 4.61949 4.70571 4.85635 4.56861 5.09263C4.42936 5.33265 4.29106 5.5732 4.15345 5.81417C4.13544 5.8457 4.11743 5.87723 4.09888 5.90972C4.02182 6.0447 3.94484 6.17973 3.86817 6.31494C3.74973 6.52337 3.62921 6.73019 3.50518 6.93532C3.35177 7.18912 3.20641 7.44704 3.06185 7.70595C2.95568 7.89535 2.84715 8.08341 2.73925 8.27182C2.706 8.33013 2.706 8.33013 2.67209 8.38962C2.45513 8.77018 2.23544 9.14914 2.0156 9.52803C1.91854 9.69531 1.82162 9.86265 1.7249 10.0301C1.68943 10.0915 1.65393 10.1529 1.61841 10.2143C1.50887 10.4037 1.40023 10.5935 1.29297 10.7842C1.25362 10.8538 1.21348 10.9228 1.1731 10.9917C1.03852 11.2343 0.984744 11.4405 1.03421 11.7174C1.12686 12.0015 1.29934 12.2335 1.56264 12.377C1.74804 12.4541 1.93821 12.4427 2.13604 12.4416C2.17896 12.4418 2.22188 12.442 2.26611 12.4422C2.38481 12.4426 2.5035 12.4426 2.62221 12.4423C2.7504 12.4421 2.87859 12.4426 3.00678 12.4429C3.25776 12.4436 3.50873 12.4436 3.7597 12.4434C3.96374 12.4433 4.16777 12.4433 4.3718 12.4435C4.40086 12.4435 4.42992 12.4435 4.45985 12.4436C4.51888 12.4436 4.57791 12.4437 4.63694 12.4437C5.19035 12.4442 5.74375 12.444 6.29716 12.4436C6.80319 12.4433 7.30922 12.4437 7.81525 12.4446C8.33511 12.4455 8.85497 12.4458 9.37484 12.4456C9.66659 12.4454 9.95834 12.4455 10.2501 12.4461C10.4985 12.4467 10.7469 12.4467 10.9952 12.4461C11.1219 12.4458 11.2485 12.4457 11.3752 12.4462C11.5127 12.4468 11.6501 12.4463 11.7876 12.4457C11.8274 12.446 11.8672 12.4463 11.9082 12.4467C12.2523 12.4435 12.5094 12.3494 12.7563 12.1082C12.9372 11.867 13.0072 11.6626 12.9695 11.3622C12.9075 11.1124 12.7912 10.9007 12.6609 10.6806C12.6224 10.6146 12.584 10.5485 12.5456 10.4825C12.5269 10.4506 12.5082 10.4188 12.489 10.386C12.4203 10.2686 12.3529 10.1506 12.2857 10.0324C12.2634 9.99335 12.2411 9.95434 12.2181 9.91414C12.1739 9.83683 12.1298 9.7595 12.0857 9.68214C12.0134 9.55532 11.9409 9.42861 11.8683 9.30195C11.8537 9.27644 11.8391 9.25093 11.824 9.22464C11.6433 8.90942 11.4599 8.59644 11.2689 8.28736C11.1542 8.10165 11.0466 7.91668 10.9524 7.71957C10.7824 7.37633 10.5747 7.05146 10.374 6.72562C10.2682 6.55298 10.1676 6.37865 10.0722 6.19991C9.81017 5.71279 9.52352 5.23785 9.24567 4.75962C9.09625 4.50224 8.94746 4.24463 8.80235 3.9848C8.64519 3.70351 8.48259 3.42545 8.31971 3.14745C8.21619 2.97067 8.11347 2.79359 8.01346 2.6148C7.81774 2.26599 7.64684 1.97452 7.25049 1.8424C6.89137 1.81642 6.59034 1.8105 6.32915 2.08439Z" fill="#25D0AB" fill-opacity="0.6"/>
  <path d="M7.35701 4.87063C7.58757 5.00513 7.72513 5.14235 7.81879 5.39458C7.85643 5.7569 7.79373 6.12937 7.74997 6.48909C7.71299 6.79678 7.67664 7.10321 7.6595 7.41279C7.64163 7.7289 7.60782 8.04254 7.57042 8.35689C7.56276 8.42215 7.55537 8.48745 7.54822 8.55278C7.53773 8.64874 7.52648 8.74459 7.51505 8.84045C7.51201 8.86943 7.50897 8.8984 7.50584 8.92825C7.47706 9.15734 7.40206 9.30341 7.2238 9.45736C7.06964 9.53444 6.99535 9.53954 6.82418 9.51509C6.66443 9.39084 6.55782 9.2446 6.516 9.04563C6.51105 9.00288 6.50611 8.96012 6.50102 8.91608C6.49821 8.89264 6.4954 8.86921 6.49251 8.84507C6.48349 8.76874 6.4751 8.69235 6.46675 8.61595C6.46059 8.56242 6.45442 8.5089 6.44822 8.45538C6.41078 8.12726 6.37963 7.79894 6.35506 7.46959C6.33818 7.25066 6.31616 7.03272 6.29108 6.81461C6.28785 6.78637 6.28462 6.75814 6.28128 6.72905C6.26514 6.58873 6.24865 6.44847 6.23169 6.30824C6.1212 5.37441 6.1212 5.37441 6.32688 5.1104C6.59581 4.82555 6.97987 4.71861 7.35701 4.87063Z" fill="#25D0AB" fill-opacity="0.6"/>
  <path d="M7.14383 9.94135C7.29388 10.0104 7.42516 10.1012 7.53457 10.2255C7.59113 10.4415 7.60964 10.671 7.51681 10.876C7.35732 11.0475 7.19635 11.1207 6.96179 11.1313C6.79486 11.1229 6.69933 11.0896 6.57549 10.9715C6.42996 10.775 6.36191 10.6114 6.39788 10.3676C6.53897 10.0737 6.81146 9.8626 7.14383 9.94135Z" fill="#25D0AB" fill-opacity="0.6"/>
</svg> */}
                        {/* <Group373 /> */}
                      </div>
                      <span
                        className="text-[rgba(37,208,171,0.6)] font-rajdhani text-[17px] font-medium leading-[28px] capitalize"
                        data-testid="1533:51"
                      >
                        Create new request
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
                                  style={{ fontFamily: "Amina, sans-serif" }}
                                >
                                  Create Request
                                </h1>
                                <p
                                  className="self-stretch w-[319px] text-white text-opacity-60 text-sm font-normal leading-[24px]"
                                  style={{ fontFamily: "Amina, sans-serif" }}
                                >
                                  Fill the required information and Upload the
                                  documents
                                </p>
                              </div>

                              {/* Form section */}
                              <div className="flex flex-col items-start gap-6">
                                <div className="flex flex-col items-start gap-5">
                                  {/* Full Name field */}
                                  <div className="flex flex-col items-start gap-2">
                                    <label
                                      className="w-[279px] text-white text-opacity-80 text-sm font-medium"
                                      style={{
                                        fontFamily: "Amina, sans-serif",
                                      }}
                                    >
                                      Available Amount*
                                    </label>
                                    <div className="flex flex-row w-[319px] h-11 px-3.5 justify-center items-center gap-3 rounded border border-solid border-[#353535]">
                                      <input
                                        type="text"
                                        placeholder="USDC amount"
                                        className="flex-grow flex-shrink-0 bg-transparent text-white text-sm font-normal leading-8 capitalize outline-none placeholder:text-neutral-600"
                                        style={{
                                          fontFamily: "Amina, sans-serif",
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-start gap-2">
                                    <label
                                      className="w-[279px] text-white text-opacity-80 text-sm font-medium"
                                      style={{
                                        fontFamily: "Amina, sans-serif",
                                      }}
                                    >
                                      Min Interest*
                                    </label>
                                    <div className="flex flex-row w-[319px] h-11 px-3.5 justify-center items-center gap-3 rounded border border-solid border-[#353535]">
                                      <input
                                        type="text"
                                        placeholder="Ex. 7-8%"
                                        className="flex-grow flex-shrink-0 bg-transparent text-white text-sm font-normal leading-8 capitalize outline-none placeholder:text-neutral-600"
                                        style={{
                                          fontFamily: "Amina, sans-serif",
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-start gap-2">
                                    <label
                                      className="w-[279px] text-white text-opacity-80 text-sm font-medium"
                                      style={{
                                        fontFamily: "Amina, sans-serif",
                                      }}
                                    >
                                      Preferred Tenure*
                                    </label>
                                    <div className="flex flex-row w-[319px] h-11 px-3.5 justify-center items-center gap-3 rounded border border-solid border-[#353535]">
                                      <input
                                        type="text"
                                        placeholder="Ex. 3 Months"
                                        className="flex-grow flex-shrink-0 bg-transparent text-white text-sm font-normal leading-8 capitalize outline-none placeholder:text-neutral-600"
                                        style={{
                                          fontFamily: "Amina, sans-serif",
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-start gap-2">
                                    <label
                                      className="w-[279px] text-white text-opacity-80 text-sm font-medium"
                                      style={{
                                        fontFamily: "Amina, sans-serif",
                                      }}
                                    >
                                     Colltral Token 
                                    </label>
                                    <div className="flex flex-row w-[319px] h-11 px-3.5 justify-center items-center gap-3 rounded border border-solid border-[#353535]">
                                      <input
                                        type="text"
                                        placeholder="Address "
                                        className="flex-grow flex-shrink-0 bg-transparent text-white text-sm font-normal leading-8 capitalize outline-none placeholder:text-neutral-600"
                                        style={{
                                          fontFamily: "Amina, sans-serif",
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Submit button and terms */}
                                <div className="w-[319px] flex flex-col items-start gap-2">
                                  <button className="flex flex-row h-12 justify-center items-center gap-3 self-stretch rounded bg-white">
                                    <span
                                      className="text-black text-center text-xl font-semibold leading-8 capitalize"
                                      style={{
                                        fontFamily: "Rajdhani, sans-serif",
                                      }}
                                    >
                                      CREATE 
                                    </span>
                                  </button>
                                  <p
                                    className="w-[319px] text-white text-opacity-40 text-center text-xs font-normal leading-7"
                                    style={{ fontFamily: "Amina, sans-serif" }}
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
                        style={{ fontFamily: "Amina, sans-serif" }}
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
                        style={{ fontFamily: "Amina, sans-serif" }}
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
                            style={{ fontFamily: "Amina, sans-serif" }}
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
                            style={{ fontFamily: "Amina, sans-serif" }}
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
                        style={{ fontFamily: "Amina, sans-serif" }}
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
                        style={{ fontFamily: "Amina, sans-serif" }}
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
                        style={{ fontFamily: "Amina, sans-serif" }}
                        data-testid="1529:266"
                      >
                        Regions Allowed
                      </span>
                    </div>
                  </div>

                  {/* Table Row */}

                  {lenders.map((lender, index) => (
                    <>
                      {extend ? (
                        <div
                          onClick={() => setExtend(false)}
                          className="flex flex-col py-4 pl-4  hover:bg-[#11221F] w-full border-b border-[#343434]"
                          data-testid="1529:298"
                        >
                          <div className="w-full flex flex-row justify-between items-center ">
                            <div
                              className="flex  flex-row w-36 justify-center items-center gap-3"
                              data-testid="1529:345"
                            >
                              <span
                                className="w-36  flex-shrink-0 text-white text-sm leading-7"
                                style={{ fontFamily: "Amina, sans-serif" }}
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
                                style={{ fontFamily: "Amina, sans-serif" }}
                                data-testid="1529:300"
                              >
                                {lender.name}
                              </span>
                            </div>
                            <div
                              className="flex flex-row items-center gap-12"
                              data-testid="1529:301"
                            >
                              <div className=" w-36  " data-testid="1529:347">
                                <span
                                  className="w-36 flex-shrink-0 text-white text-sm leading-7"
                                  style={{ fontFamily: "Amina, sans-serif" }}
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
                                  style={{ fontFamily: "Amina, sans-serif" }}
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
                                style={{ fontFamily: "Amina, sans-serif" }}
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
                                style={{ fontFamily: "Amina, sans-serif" }}
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
                                style={{ fontFamily: "Amina, sans-serif" }}
                                data-testid="1529:266"
                              >
                                {lender.regionsAllowed}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => setExtend(true)}
                          className="flex flex-col py-4 pl-4 gap-[10px]  hover:bg-[#11221F] w-full border-b border-[#343434]"
                          data-testid="1529:298"
                        >
                          <div className="w-full flex flex-row justify-between items-center ">
                            <div
                              className="flex  flex-row w-36 justify-center items-center gap-3"
                              data-testid="1529:345"
                            >
                              <span
                                className="w-36  flex-shrink-0 text-white text-sm leading-7"
                                style={{ fontFamily: "Amina, sans-serif" }}
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
                                style={{ fontFamily: "Amina, sans-serif" }}
                                data-testid="1529:300"
                              >
                                {lender.name}
                              </span>
                            </div>
                            <div
                              className="flex flex-row items-center gap-12"
                              data-testid="1529:301"
                            >
                              <div className=" w-36  " data-testid="1529:347">
                                <span
                                  className="w-36 flex-shrink-0 text-white text-sm leading-7"
                                  style={{ fontFamily: "Amina, sans-serif" }}
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
                                  style={{ fontFamily: "Amina, sans-serif" }}
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
                                style={{ fontFamily: "Amina, sans-serif" }}
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
                                style={{ fontFamily: "Amina, sans-serif" }}
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
                                style={{ fontFamily: "Amina, sans-serif" }}
                                data-testid="1529:266"
                              >
                                {lender.regionsAllowed}
                              </span>
                            </div>
                          </div>
                          <div className="w-full  flex flex-col items-start gap-y-2">
                            <div className="flex justify-between items-end w-full ">
                              <div className="flex items-start gap-x-[87px] ">
                                <p className="text-white/60 font-['Amina'] text-[14px] font-normal leading-[28px]">
                                  Colltral Token
                                </p>
                                <p className="flex-grow text-white/60 font-['Amina'] text-[14px] font-normal w-[425px] leading-[28px] break-all">
                                  0xf273353e1d8e0196a481c559a171f80b06e186623481ecc737adf3e6fd734bec
                                </p>
                              </div>
                              <div className="flex items-center gap-x-[10px] py-[4px]">
                                <div className="flex justify-center items-center w-[112px] h-[34px] gap-[9.688px] rounded-[2.906px] border border-solid border-[#25D0BC]/80">
                                  <p className="text-[#25D0BC]/80 text-center font-['Rajdhani'] text-[15.179px] font-semibold leading-[23.252px] capitalize">
                                    View
                                  </p>
                                </div>
                                <div className="flex justify-center items-center w-[112px] h-[34px] gap-[9.688px] rounded-[2.906px] bg-[#25D0BC]/30">
                                  <p className="text-[#25D0BC] text-center font-['Rajdhani'] text-[15.179px] font-semibold leading-[23.252px] capitalize">
                                    Fund
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ))}
                </div>
            
            
            </>) : (<></>)}

            {/* Table Section */}
            {active == "open" ? (
              <>
                <div
                  className="flex flex-col items-start w-full"
                  data-testid="1529:263"
                >
                  <div
                    className=" pb-[18px] flex flex-col items-start gap-[10px] self-stretch"
                    data-testid="1533:44"
                  >
                 
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
                                  style={{ fontFamily: "Amina, sans-serif" }}
                                >
                                  Create Request
                                </h1>
                                <p
                                  className="self-stretch w-[319px] text-white text-opacity-60 text-sm font-normal leading-[24px]"
                                  style={{ fontFamily: "Amina, sans-serif" }}
                                >
                                  Fill the required information and Upload the
                                  documents
                                </p>
                              </div>

                              {/* Form section */}
                              <div className="flex flex-col items-start gap-6">
                                <div className="flex flex-col items-start gap-5">
                                  {/* Full Name field */}
                                  <div className="flex flex-col items-start gap-2">
                                    <label
                                      className="w-[279px] text-white text-opacity-80 text-sm font-medium"
                                      style={{
                                        fontFamily: "Amina, sans-serif",
                                      }}
                                    >
                                      Available Amount*
                                    </label>
                                    <div className="flex flex-row w-[319px] h-11 px-3.5 justify-center items-center gap-3 rounded border border-solid border-[#353535]">
                                      <input
                                        type="text"
                                        placeholder="USDC amount"
                                        value={principal}
                                        onChange={e => setPrincipal(e.target.value)}
                                        className="flex-grow flex-shrink-0 bg-transparent text-white text-sm font-normal leading-8 capitalize outline-none placeholder:text-neutral-600"
                                        style={{
                                          fontFamily: "Amina, sans-serif",
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-start gap-2">
                                    <label
                                      className="w-[279px] text-white text-opacity-80 text-sm font-medium"
                                      style={{
                                        fontFamily: "Amina, sans-serif",
                                      }}
                                    >
                                      Min Interest*
                                    </label>
                                    <div className="flex flex-row w-[319px] h-11 px-3.5 justify-center items-center gap-3 rounded border border-solid border-[#353535]">
                                      <input
                                        type="text"
                                        placeholder="Ex. 10%"
                                        value={interestRate}
                                        onChange={e => setInterestRate(e.target.value)}
                                        className="flex-grow flex-shrink-0 bg-transparent text-white text-sm font-normal leading-8 capitalize outline-none placeholder:text-neutral-600"
                                        style={{
                                          fontFamily: "Amina, sans-serif",
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-start gap-2">
                                    <label
                                      className="w-[279px] text-white text-opacity-80 text-sm font-medium"
                                      style={{
                                        fontFamily: "Amina, sans-serif",
                                      }}
                                    >
                                      Preferred Tenure*
                                    </label>
                                    <div className="flex flex-row w-[319px] h-11 px-3.5 justify-center items-center gap-3 rounded border border-solid border-[#353535]">
                                      <input
                                        type="text"
                                        placeholder="Ex. 3 Months"
                                        value={duration}
                                        onChange={e => setDuration(e.target.value)}
                                        className="flex-grow flex-shrink-0 bg-transparent text-white text-sm font-normal leading-8 capitalize outline-none placeholder:text-neutral-600"
                                        style={{
                                          fontFamily: "Amina, sans-serif",
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-start gap-2">
                                    <label
                                      className="w-[279px] text-white text-opacity-80 text-sm font-medium"
                                      style={{
                                        fontFamily: "Amina, sans-serif",
                                      }}
                                    >
                                      NFT address
                                    </label>
                                    <div className="flex flex-row w-[319px] h-11 px-3.5 justify-center items-center gap-3 rounded border border-solid border-[#353535]">
                                      <input
                                        type="text"
                                        value={nftId}
                                        onChange={e => setNftId(e.target.value)}
                                        placeholder="Address"
                                        className="flex-grow flex-shrink-0 bg-transparent text-white text-sm font-normal leading-8 capitalize outline-none placeholder:text-neutral-600"
                                        style={{
                                          fontFamily: "Amina, sans-serif",
                                        }}
                                      />
                                    </div>
                                  </div>
                                  
                                </div>

                                {/* Submit button and terms */}
                                <div className="w-[319px] flex flex-col items-start gap-2">
                                  <button onClick={handleCreateLoan} className="flex flex-row h-12 justify-center items-center gap-3 self-stretch rounded bg-white">
                                    <span
                                      className="text-black text-center text-xl font-semibold leading-8 capitalize"
                                      style={{
                                        fontFamily: "Rajdhani, sans-serif",
                                      }}
                                    >
                                      verification
                                    </span>
                                  </button>
                                  <p
                                    className="w-[319px] text-white text-opacity-40 text-center text-xs font-normal leading-7"
                                    style={{ fontFamily: "Amina, sans-serif" }}
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
                        style={{ fontFamily: "Amina, sans-serif" }}
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
                        style={{ fontFamily: "Amina, sans-serif" }}
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
                            style={{ fontFamily: "Amina, sans-serif" }}
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
                            style={{ fontFamily: "Amina, sans-serif" }}
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
                        style={{ fontFamily: "Amina, sans-serif" }}
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
                        style={{ fontFamily: "Amina, sans-serif" }}
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
                        style={{ fontFamily: "Amina, sans-serif" }}
                        data-testid="1529:266"
                      >
                        Regions Allowed
                      </span>
                    </div>
                  </div>

                  {/* Table Row */}

                  {lender.map((lender, index) => (
                    <>
                      {extend ? (
                        <div
                          onClick={() => setExtend(false)}
                          className="flex flex-col py-4 pl-4  hover:bg-[#11221F] w-full border-b border-[#343434]"
                          data-testid="1529:298"
                        >
                          <div className="w-full flex flex-row justify-between items-center ">
                            <div
                              className="flex  flex-row w-36 justify-center items-center gap-3"
                              data-testid="1529:345"
                            >
                              <span
                                className="w-36  flex-shrink-0 text-white text-sm leading-7"
                                style={{ fontFamily: "Amina, sans-serif" }}
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
                                style={{ fontFamily: "Amina, sans-serif" }}
                                data-testid="1529:300"
                              >
                                {lender.name}
                              </span>
                            </div>
                            <div
                              className="flex flex-row items-center gap-12"
                              data-testid="1529:301"
                            >
                              <div className=" w-36  " data-testid="1529:347">
                                <span
                                  className="w-36 flex-shrink-0 text-white text-sm leading-7"
                                  style={{ fontFamily: "Amina, sans-serif" }}
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
                                  style={{ fontFamily: "Amina, sans-serif" }}
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
                                style={{ fontFamily: "Amina, sans-serif" }}
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
                                style={{ fontFamily: "Amina, sans-serif" }}
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
                                style={{ fontFamily: "Amina, sans-serif" }}
                                data-testid="1529:266"
                              >
                                {lender.regionsAllowed}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => setExtend(true)}
                          className="flex flex-col py-4 pl-4 gap-[10px]  hover:bg-[#11221F] w-full border-b border-[#343434]"
                          data-testid="1529:298"
                        >
                          <div className="w-full flex flex-row justify-between items-center ">
                            <div
                              className="flex  flex-row w-36 justify-center items-center gap-3"
                              data-testid="1529:345"
                            >
                              <span
                                className="w-36  flex-shrink-0 text-white text-sm leading-7"
                                style={{ fontFamily: "Amina, sans-serif" }}
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
                                style={{ fontFamily: "Amina, sans-serif" }}
                                data-testid="1529:300"
                              >
                                {lender.name}
                              </span>
                            </div>
                            <div
                              className="flex flex-row items-center gap-12"
                              data-testid="1529:301"
                            >
                              <div className=" w-36  " data-testid="1529:347">
                                <span
                                  className="w-36 flex-shrink-0 text-white text-sm leading-7"
                                  style={{ fontFamily: "Amina, sans-serif" }}
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
                                  style={{ fontFamily: "Amina, sans-serif" }}
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
                                style={{ fontFamily: "Amina, sans-serif" }}
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
                                style={{ fontFamily: "Amina, sans-serif" }}
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
                                style={{ fontFamily: "Amina, sans-serif" }}
                                data-testid="1529:266"
                              >
                                {lender.regionsAllowed}
                              </span>
                            </div>
                          </div>
                          <div className="w-full  flex flex-col items-start gap-y-2">
                            <div className="flex justify-between items-end w-full ">
                              <div className="flex items-start gap-x-[87px] ">
                                <p className="text-white/60 font-['Amina'] text-[14px] font-normal leading-[28px]">
                                  Colltral Token
                                </p>
                                <p className="flex-grow text-white/60 font-['Amina'] text-[14px] font-normal w-[425px] leading-[28px] break-all">
                                  0xf273353e1d8e0196a481c559a171f80b06e186623481ecc737adf3e6fd734bec
                                </p>
                              </div>
                              <div className="flex items-center gap-x-[10px] py-[4px]">
                                <div className="flex justify-center items-center w-[112px] h-[34px] gap-[9.688px] rounded-[2.906px] border border-solid border-[#25D0BC]/80">
                                  <p className="text-[#25D0BC]/80 text-center font-['Rajdhani'] text-[15.179px] font-semibold leading-[23.252px] capitalize">
                                    View
                                  </p>
                                </div>
                                <div className="flex justify-center items-center w-[112px] h-[34px] gap-[9.688px] rounded-[2.906px] bg-[#25D0BC]/30">
                                  <p className="text-[#25D0BC] text-center font-['Rajdhani'] text-[15.179px] font-semibold leading-[23.252px] capitalize">
                                    Fund
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ))}
                </div>
              </>
            ) : (
              <></>
            )}

            {active == "active" ? (
              <div className="w-full ">
                <div className="flex flex-row  px-[15px] py-4 items-start gap-2.5 border-b border-[#343434]">
                  <div className="flex flex-row items-start gap-10 flex-1">
                    <div className="flex flex-col  items-start gap-9 flex-1">
                      {/* Loan Info Section */}
                      <div className="flex flex-col items-start gap-2.5 w-full">
                        <div className="flex flex-row items-center gap-2.5 w-full">
                          <h3 className="flex-1 text-[#25D0AB] font-amina text-base font-normal leading-7">
                            Loan info
                          </h3>
                        </div>

                        <div className="flex flex-row items-start gap-9 w-full">
                          <span className="w-[150px] text-white font-amina text-sm font-normal leading-7">
                            borrower
                          </span>
                          <span className="flex-1 w-full text-white break-all font-amina text-sm font-normal leading-7">
                            0xf273353e1d8e0196a481c559a171f80b06e186623481ecc737adf3e6fd734bec
                          </span>
                        </div>

                        <div className="flex flex-row items-start gap-9 w-full">
                          <span className="w-[150px] text-white font-amina text-sm font-normal leading-7">
                            lender
                          </span>
                          <span className="flex-1 w-full break-all text-white font-amina text-sm font-normal leading-7">
                            0xf273353e1d8e0196a481c559a171f80b06e186623481ecc737adf3e6fd734bec
                          </span>
                        </div>

                        <div className="flex flex-row items-start gap-9 w-full">
                          <span className="w-[150px] text-white font-amina text-sm font-normal leading-7">
                            Preferred Tenure
                          </span>
                          <span className="flex-1 text-white font-amina text-sm font-normal leading-7">
                            2 years
                          </span>
                        </div>

                        <div className="flex flex-row items-start gap-9 w-full">
                          <span className="w-[150px] text-white font-amina text-sm font-normal leading-7">
                            principalAmount
                          </span>
                          <span className="flex-1 text-white font-amina text-sm font-normal leading-7">
                            $3,000
                          </span>
                        </div>

                        <div className="flex flex-row items-start gap-9 w-full">
                          <span className="w-[150px] text-white font-amina text-sm font-normal leading-7">
                            interestRate
                          </span>
                          <span className="flex-1 text-white font-amina text-sm font-normal leading-7">
                            7%
                          </span>
                        </div>

                        <div className="flex flex-row items-start gap-9 w-full">
                          <span className="w-[150px] text-white font-amina text-sm font-normal leading-7">
                            LTV
                          </span>
                          <span className="flex-1 text-white font-amina text-sm font-normal leading-7">
                            120%
                          </span>
                        </div>
                      </div>

                      {/* Collateral Info Section */}
                      <div className="flex flex-col  items-start gap-2.5 w-full">
                        <div className="flex flex-row items-center gap-2.5 w-full">
                          <h3 className="w-[150px] text-[#25D0AB] font-amina text-base font-normal leading-7">
                            Collateral info
                          </h3>
                        </div>

                        <div className="flex flex-row items-start gap-9 w-full">
                          <span className="w-[150px] text-white font-amina text-sm font-normal leading-7">
                            Token
                          </span>
                          <span className="flex-1 text-white w-full break-all font-amina text-sm font-normal leading-7">
                            0xf273353e1d8e0196a481c559a171f80b06e186623481ecc737adf3e6fd734bec
                          </span>
                        </div>

                        <div className="flex flex-row items-start gap-9 w-full">
                          <span className="w-[150px] text-white font-amina text-sm font-normal leading-7">
                            current prize
                          </span>
                          <span className="flex-1 text-white font-amina text-sm font-normal leading-7">
                            $4,350
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between  items-start gap-6 flex-1 h-full">
                      {/* Contract Info Section */}
                      <div className="flex flex-col items-start gap-2.5 w-full">
                        <div className="flex flex-row items-center gap-2.5 w-full">
                          <h3 className="w-[150px] text-[#25D0AB] font-amina text-base font-normal leading-7">
                            Contract info
                          </h3>
                        </div>

                        <div className="flex flex-row items-start gap-9 w-full">
                          <span className="w-[150px] text-white font-amina text-sm font-normal leading-7">
                            ContractAddress
                          </span>
                          <span className="flex-1 text-white w-full break-all font-amina text-sm font-normal leading-7">
                            0xf273353e1d8e0196a481c559a171f80b06e186623481ecc737adf3e6fd734bec
                          </span>
                        </div>

                        <div className="flex flex-row items-start gap-9 w-full">
                          <span className="w-[150px] text-white font-amina text-sm font-normal leading-7">
                            startDate
                          </span>
                          <span className="flex-1 text-white font-amina text-sm font-normal leading-7">
                            08:15:2005
                          </span>
                        </div>

                        <div className="flex flex-row items-start gap-9 w-full">
                          <span className="w-[150px] text-white font-amina text-sm font-normal leading-7">
                            endDate
                          </span>
                          <span className="flex-1 text-white font-amina text-sm font-normal leading-7">
                            08:15:2005
                          </span>
                        </div>

                        <div className="flex flex-row items-start gap-9 w-full">
                          <span className="w-[150px] text-white font-amina text-sm font-normal leading-7">
                            Transaction hash
                          </span>
                          <span className="flex-1 text-white w-full break-all font-amina text-sm font-normal leading-7">
                            0xf273353e1d8e0196a481c559a171f80b06e186623481ecc737adf3e6fd734bec
                          </span>
                        </div>
                      </div>

                      {/* Payment Info Section */}
                      <div className="flex flex-col items-start gap-2.5 w-full">
                        <div className="flex flex-row items-center gap-2.5 w-full">
                          <h3 className="w-[150px] text-[#25D0AB] font-amina text-base font-normal leading-7">
                            Payment info
                          </h3>
                        </div>

                        <div className="flex flex-row items-start gap-9 w-full">
                          <span className="w-[150px] text-white font-amina text-sm font-normal leading-7">
                            basePlusInterest
                          </span>
                          <span className="flex-1 text-white font-amina text-sm font-normal leading-7">
                            $3,000 (base) +600 (interest)
                          </span>
                        </div>

                        <div className="flex flex-row items-start gap-9 w-full">
                          <div className="flex flex-row w-[150px] h-7 justify-center items-center gap-2.5"></div>
                          <span className="flex-1 text-white font-amina text-sm font-normal leading-7">
                            $3600
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons Section */}
                      <div className="flex flex-col items-start gap-[8px] w-full">
                        <div className="flex flex-row  items-center gap-[8px] w-full">
                          <button className="flex flex-row h-[40px] justify-center items-center gap-2.5 flex-1 rounded-sm  bg-[#232323]">
                            <span className="text-[#FFFFFF] text-center font-[rajdhani] text-[15.179px] font-semibold leading-[23.252px] capitalize">
                              PROPERTY
                            </span>
                          </button>
                          <button className="flex flex-row h-[40px] justify-center items-center gap-2.5 flex-1 rounded-sm bg-[#232323]  ">
                            <span className="text-[#FFFFFF] text-center font-[rajdhani] text-base font-semibold leading-7 capitalize">
                              CONTRACT
                            </span>
                          </button>
                        </div>

                        <div className="flex flex-row items-center  w-full">
                          <button className="flex flex-row h-[40px] justify-center items-center gap-2.5 flex-1 rounded-sm  bg-[#093934] ">
                            <span className="text-[#25D0BC]/80 text-center font-[rajdhani] text-[15.179px] font-semibold leading-[23.252px] capitalize">
                              REPAY
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}

            {active == "closed" ? (
              <>
                <div className="w-full h-[100px] flex justify-center items-center">
                  <p className="w-full text-[rajdhani] text-[#136D63] text-[16px] font-normal text-center  ">
                    No content
                  </p>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Bet;
