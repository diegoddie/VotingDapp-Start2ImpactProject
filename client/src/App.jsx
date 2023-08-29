import React from 'react'
import Home from './pages/Home';
import Navbar from './components/Navbar';
import { Sepolia } from "@thirdweb-dev/chains";
import { ThirdwebProvider } from "@thirdweb-dev/react"
import {Routes, Route} from 'react-router-dom'
import Candidates from './pages/Candidates';
import HideNavbar from './utils/HideNavbar';

function App() {

  return (
    <ThirdwebProvider activeChain={ Sepolia } clientId='26b7c6b6248495ecafc7df0c2135df30'>
        <div className='relative sm:7 p-3 min-h-screen flex flex-row'>
          <div className='flex-1 max-sm:w-full max-w-[1280px] mx-auto'>
            <HideNavbar>
              <Navbar />
            </HideNavbar>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/candidates" element={<Candidates />} />
              <Route path="*" element={<h1>404 Error: Page not found</h1>} />
            </Routes>
          </div>
        </div>
    </ThirdwebProvider>
  );
}

export default App;
