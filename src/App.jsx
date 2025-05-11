import { useState } from 'react'
import Header from './components/header'
import BettingCard from './components/bettingCard'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css'
import Home from './routes/home'
import Property from './routes/property'
import Swap from './routes/bet'
import KYC from './routes/kyc'
import Bet from './routes/bet';
import Documents from './routes/documents';
import PropertyDetails from './routes/propertyDetails';


function App() {
  const [count, setCount] = useState(0)

  return (
<>
 <Router>
    <div  className="w-full min-h-[829px] py-16 px-16 flex flex-col items-center gap-24">
      {/* Top Navigation Section */}
    
      <Header/>
      {/* Bets Section */}
      <div className="px-5 flex flex-col items-center gap-6 w-full">

         <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/property" element={<Property />} />
          <Route path="/bet" element={<Bet />} >
          {/* <Route path="/propertyDetails" element={<PropertyDetails />}/> */}
          </Route>
          <Route path="/kyc" element={<KYC />} />
          <Route path="/documents" element={<Documents />} />
        </Routes>
      </div>

      

      

    
    </div>
    </Router>


</>  )
}

export default App
