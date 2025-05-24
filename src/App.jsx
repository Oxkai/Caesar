import { useState } from 'react'
import Header from './components/header'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { WalletProvider } from "./components/WalletContext";
import './App.css'
import Home from './routes/home'
import Property from './routes/property'

import Bet from './routes/bet';
import Documents from './routes/documents';
import PropertyDetails from './routes/propertyDetails';
import Swap from './routes/Swap';



function App() {
  const [count, setCount] = useState(0)

  return (
<>
<WalletProvider>
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
       
          </Route>
          <Route path="/swap" element={<Swap/>} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/propertyDetails" element={<PropertyDetails />} />
        </Routes>
      </div>

      

      

    
    </div>
    </Router>

</WalletProvider>



</>  )
}

export default App
